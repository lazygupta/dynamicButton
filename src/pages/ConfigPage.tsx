import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const actionTypes: { value: ActionType; label: String }[] = [
  { value: 'alert', label: 'Alert' },
  { value: 'showText', label: 'Show Text' },
  { value: 'showImage', label: 'Show Image' },
  { value: 'refreshPage', label: 'Refresh Page' },
  { value: 'setLocalStorage', label: 'Set LocalStorage' },
  { value: 'getLocalStorage', label: 'Get LocalStorage' },
  { value: 'increaseButtonSize', label: 'Increase Button Size' },
  { value: 'closeWindow', label: 'Close Window' },
  { value: 'promptAndShow', label: 'Prompt and Show' },
  { value: 'changeButtonColor', label: 'Change Button Color' },
  { value: 'disableButton', label: 'Disable Button' },
];

// setting the types checks
type ActionType =
  | 'alert'
  | 'showText'
  | 'showImage'
  | 'refreshPage'
  | 'setLocalStorage'
  | 'getLocalStorage'
  | 'increaseButtonSize'
  | 'closeWindow'
  | 'promptAndShow'
  | 'changeButtonColor'
  | 'disableButton';

interface WorkflowConfig {
  buttonLabel: string;
  actions: WorkflowAction[];
}

interface WorkflowAction {
  id: string;
  type: ActionType;
  config?: {
    message?: string;
    text?: string;
    imageUrl?: string;
    key?: string;
    value?: string;
    color?: string;
  };
}



export default function MainPage() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<WorkflowConfig>({ buttonLabel: '', actions: [] });// added types check

  useEffect(() => {
    const savedConfig = localStorage.getItem('Configuration');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = (newConfig: WorkflowConfig) => {
    setConfig(newConfig);
  };


  const handleClearLocalStorage = () => {
    localStorage.clear(); // Clears all localStorage data
    window.location.reload();
    alert('Local storage cleared!');
  };

  const handleSave = () => {
    localStorage.setItem('Configuration', JSON.stringify(config));
    navigate('/output');
  };

  const addAction = () => {
    const newAction: WorkflowAction = {
      id: `id_${Date.now()}`,
      type: 'alert',
      config: { message: '' },
    };
    saveConfig({
      ...config, actions: [...config.actions, newAction],
    });
  };

  // deleting the action workflow
  const removeAction = (id: string) => {
    saveConfig({
      ...config, actions: config.actions.filter((action) => action.id !== id),
    });
  };

  //updating
  const updateAction = (id: string, updates: Partial<WorkflowAction>) => {
    saveConfig({
      ...config,
      actions: config.actions.map((action) =>
        action.id === id ? { ...action, ...updates } : action
      ),
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(config.actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    saveConfig({
      ...config,
      actions: items,
    });
  };

  return (
      <div className="container mx-auto p-6 max-w-2xl z-100">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className='flex justify-center'>
                Save Button Workflow and Name
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className='mb-2'>Button Label</div>
                <Input
                  value={config.buttonLabel}
                  onChange={(e) =>
                    saveConfig({ ...config, buttonLabel: e.target.value })
                  }
                  placeholder="Enter Button Name"
                />
              </div>

              <div>
                <div className='mb-2'>Actions</div>
                {/* // used hello-pangea */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="actions">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {config.actions.map((action, index) => (
                          <Draggable
                            key={action.id}
                            draggableId={action.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-3 bg-secondary p-3 rounded-lg"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>

                                <Select
                                  value={action.type}
                                  onValueChange={(value: ActionType) =>
                                    updateAction(action.id, { type: value })
                                  }
                                >
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {actionTypes.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* // if the actiopn is only of alert and show text */}
                                {(action.type === 'alert' ||
                                  action.type === 'showText' ||
                                  action.type === 'promptAndShow') && (
                                    <Input
                                      value={action.config?.message || ''}
                                      onChange={(e) =>
                                        updateAction(action.id, {
                                          config: { message: e.target.value },
                                        })
                                      }
                                      placeholder="Enter message"
                                    />
                                  )}

                                {action.type === 'showImage' && (
                                  <Input
                                    value={action.config?.imageUrl || ''}
                                    onChange={(e) =>
                                      updateAction(action.id, {
                                        config: { imageUrl: e.target.value },
                                      })
                                    }
                                    placeholder="Enter image URL"
                                  />
                                )}

                                {/* // for setting the workflows */}
                                {(action.type === 'setLocalStorage' ||
                                  action.type === 'getLocalStorage') && (
                                    <div className="flex gap-2 flex-1">
                                      <Input
                                        value={action.config?.key || ''}
                                        onChange={(e) =>
                                          updateAction(action.id, {
                                            config: {
                                              ...action.config,
                                              key: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder="Key"
                                      />


                                      {action.type === 'setLocalStorage' && (
                                        <Input
                                          value={action.config?.value || ''}
                                          onChange={(e) =>
                                            updateAction(action.id, {
                                              config: {
                                                ...action.config,
                                                value: e.target.value,
                                              },
                                            })
                                          }
                                          placeholder="Value"
                                        />
                                      )}
                                    </div>
                                  )}


                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeAction(action.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>


                <div className='flex justify-center'>
                  <Button
                    onClick={addAction}
                    className="mt-4 flex"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />

                    <div>Add more Action
                    </div>
                  </Button>
                </div>

              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <button
              onClick={handleClearLocalStorage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear Local Storage
            </button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save & Go to Output Page
            </Button>
          </CardFooter>
        </Card>
      </div>

  );
}