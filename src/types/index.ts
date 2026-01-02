import { Action, ActionResult } from './actions';

export interface FetchJobData {
  url: string;
  jobId: string;
  actions?: Action[]; // New: action-based workflow
  options?: {
    waitFor?: string;
    timeout?: number;
    screenshot?: boolean;
    headers?: Record<string, string>;
  };
}

export interface FetchResult {
  jobId: string;
  url: string;
  html: string;
  screenshot?: string;
  statusCode?: number;
  headers?: Record<string, string>;
  fetchedAt: Date;
  actionResults?: ActionResult[]; // Results from action execution
  extractedData?: Record<string, any>; // Data saved by actions
}

export interface JobRequest {
  url: string;
  actions?: Action[];
  options?: FetchJobData['options'];
}

export * from './actions';
