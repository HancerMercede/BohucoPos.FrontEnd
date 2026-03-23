export interface ApiError {
  error: string;
  statusCode: number;
  traceId?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

export const parseApiError = async (response: Response): Promise<string> => {
  try {
    const data: ApiError = await response.json();
    return data.error || `Error ${response.status}`;
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

export const handleApiError = async (response: Response): Promise<never> => {
  const message = await parseApiError(response);
  
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action');
  }
  
  throw new Error(message);
};

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'error' in error && 'statusCode' in error;
};
