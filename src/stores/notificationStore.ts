import { create } from 'zustand';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationStore {
  notification: Notification | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notification: null,

  showNotification: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 5000);
  },

  clearNotification: () => set({ notification: null }),
}));
