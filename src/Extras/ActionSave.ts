export type ActionType =
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

export interface WorkflowAction {
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

export interface WorkflowConfig {
  buttonLabel: string;
  actions: WorkflowAction[];
}