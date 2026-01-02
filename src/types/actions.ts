export type Action =
  | NavigateAction
  | ClickAction
  | TypeAction
  | SelectAction
  | WaitForSelectorAction
  | WaitForNavigationAction
  | WaitForTimeoutAction
  | ScreenshotAction
  | GetContentAction
  | GetAttributeAction
  | GetTextAction
  | EvaluateAction
  | ScrollAction
  | HoverAction
  | PressAction
  | FillAction
  | CheckAction
  | UncheckAction
  | SetCookiesAction;

export interface NavigateAction {
  type: 'navigate';
  url: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeout?: number;
}

export interface ClickAction {
  type: 'click';
  selector: string;
  clickCount?: number;
  button?: 'left' | 'right' | 'middle';
  timeout?: number;
}

export interface TypeAction {
  type: 'type';
  selector: string;
  value: string;
  delay?: number;
  timeout?: number;
}

export interface FillAction {
  type: 'fill';
  selector: string;
  value: string;
  timeout?: number;
}

export interface SelectAction {
  type: 'select';
  selector: string;
  value: string | string[];
  timeout?: number;
}

export interface WaitForSelectorAction {
  type: 'waitForSelector';
  selector: string;
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
  timeout?: number;
}

export interface WaitForNavigationAction {
  type: 'waitForNavigation';
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeout?: number;
}

export interface WaitForTimeoutAction {
  type: 'waitForTimeout';
  timeout: number;
}

export interface ScreenshotAction {
  type: 'screenshot';
  fullPage?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg';
  saveTo?: string; // Key to save in results
}

export interface GetContentAction {
  type: 'getContent';
  saveTo?: string; // Key to save in results
}

export interface GetAttributeAction {
  type: 'getAttribute';
  selector: string;
  attribute: string;
  saveTo?: string;
}

export interface GetTextAction {
  type: 'getText';
  selector: string;
  saveTo?: string;
}

export interface EvaluateAction {
  type: 'evaluate';
  expression: string; // Simple expressions only for security
  saveTo?: string;
}

export interface ScrollAction {
  type: 'scroll';
  selector?: string;
  x?: number;
  y?: number;
}

export interface HoverAction {
  type: 'hover';
  selector: string;
  timeout?: number;
}

export interface PressAction {
  type: 'press';
  selector: string;
  key: string;
  timeout?: number;
}

export interface CheckAction {
  type: 'check';
  selector: string;
  timeout?: number;
}

export interface UncheckAction {
  type: 'uncheck';
  selector: string;
  timeout?: number;
}

export interface SetCookiesAction {
  type: 'setCookies';
  cookies: Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }>;
}

export interface ActionResult {
  success: boolean;
  action: Action;
  data?: any;
  error?: string;
  duration: number;
}
