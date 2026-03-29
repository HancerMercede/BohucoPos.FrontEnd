import { create } from 'zustand';
import type { NotificationStore } from '../types';

export const useNotificationStore = create<NotificationStore>((set) => ({
  notification: null,

  showNotification: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 5000);
  },

  clearNotification: () => set({ notification: null }),
}));
