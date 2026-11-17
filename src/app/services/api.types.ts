// Generic response envelope returned by the PHP API endpoints.
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// A reviewable entry as consumed by the list component.
export interface Entry {
  id: number;
  date: string;
  language: 'english' | 'german';
  tags: string;
  phrase: string;
  email?: string;
  comment?: string;
  isApproved?: boolean;
}
