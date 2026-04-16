// src/types/api.ts

/**
 * Cursor-based pagination response matching fastapi_pagination CursorPage.
 */
export interface CursorPage<T> {
  items: T[];
  total: number | null;
  cursor: string | null;
  size: number;
}

/**
 * Standard API error shape returned by the FastAPI backend.
 */
export interface ApiError {
  detail: string | ApiValidationError[];
}

export interface ApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Extract a human-readable error message from an API error response.
 */
export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: ApiError } }).response;
    if (response?.data?.detail) {
      if (typeof response.data.detail === 'string') {
        return response.data.detail;
      }
      if (Array.isArray(response.data.detail)) {
        return response.data.detail.map((e) => e.msg).join(', ');
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
