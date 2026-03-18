import { useAuthStore } from '../stores/authStore';
import { handleApiError, parseApiError } from './errorHandler';

export const getAuthHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response;
};

export const authFetchWithError = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const error = await parseApiError(response);
    throw new Error(error);
  }
  
  return response;
};
