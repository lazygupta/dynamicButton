import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface WorkflowConfig {
  buttonLabel: string;
  actions: WorkflowAction[];
}

const executeAction = async (
  action: WorkflowAction,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  setOutputText: (text: string) => void,
  setResponseText: (text: string) => void,
  setOutputImage: (url: string) => void,
  setIsDisabled: (disabled: boolean) => void
) => {
  switch (action.type) {
    case 'alert':
      alert(action.config?.message || 'Alert!');
      break;

    case 'showText':
      setResponseText(action.config?.message || '');
      break;

    case 'showImage':
      setOutputImage(action.config?.imageUrl || '');
      break;

    case 'refreshPage':
      window.location.reload();
      break;

    case 'setLocalStorage':
      if (action.config?.key) {
        localStorage.setItem(action.config.key, action.config.value || '');
      }
      break;

    case 'getLocalStorage':
      if (action.config?.key) {
        const value = localStorage.getItem(action.config.key);
        setOutputText(`${action.config.key}: ${value}`);
      }
      break;

    case 'increaseButtonSize':
      if (buttonRef?.current) {
        buttonRef.current.style.transform = 'scale(1.2)';
      }
      break;

    case 'closeWindow':
      if (window.opener) {
        window.close();
      } else {
        alert('Please close it manually.');
      }
      break;

    case 'promptAndShow':
      const response = prompt(action.config?.message || 'Enter your input:');
      if (response) {
        setOutputText(`Response: ${response}`);
      }
      break;

    case 'changeButtonColor':
      if (buttonRef?.current) {
        const color =
          action.config?.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        buttonRef.current.style.backgroundColor = color;
      }
      break;

    case 'disableButton':
      setIsDisabled(true);
      break;
  }
};

export default function Output() {
  const [config, setConfig] = useState<WorkflowConfig | null>(null);
  const [outputText, setOutputText] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('Configuration');
    const savedText = localStorage.getItem('OutputText');
    const savedImage = localStorage.getItem('OutputImage');

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    if (savedText) {
      setOutputText(savedText);
    }
    if (savedImage) {
      setOutputImage(savedImage);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('OutputText', outputText);
  }, [outputText]);

  useEffect(() => {
    localStorage.setItem('OutputImage', outputImage);
  }, [outputImage]);

  const handleClick = async () => {
    if (!config) return;
    for (const action of config.actions) {
      await executeAction(action, buttonRef, setOutputText, setResponseText, setOutputImage, setIsDisabled);
      await new Promise((resolve) => setTimeout(resolve, 200)); // to make it order wise
    }
  };

  if (!config) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No workflow configured yet. Please configure the workflow first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-6">
          <Button
            ref={buttonRef}
            onClick={handleClick}
            disabled={isDisabled}
            size="lg"
          >
            {config.buttonLabel || 'Click Me'}
          </Button>

          {outputText && <div className="text-lg font-medium">{outputText}</div>}
          {responseText && <div className="text-lg font-medium">{responseText}</div>}

          {outputImage && (
            <img
              src={outputImage}
              alt="Workflow output"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
