import { useAuthStore } from '../stores/authStore';

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
  return fetch(url, { ...options, headers });
};
