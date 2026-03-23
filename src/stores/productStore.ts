import { create } from 'zustand';
import type { MenuItem } from '../types';
import { getAuthHeaders } from '../utils/api';
import { useNotificationStore } from './notificationStore';
import { ERROR_MESSAGES } from '../constants/messages';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7089';

interface ProductStore {
  products: MenuItem[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/products`, { headers: getAuthHeaders() });
      if (response.ok) {
        const products = await response.json();
        const mappedProducts = products
          .filter((p: any) => p.isActive)
          .map((p: any) => ({
            id: String(p.id),
            name: p.name,
            price: p.price,
            dest: p.destination,
            category: p.category,
            emoji: p.emoji || '🍽️',
          }));
        set({ products: mappedProducts });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      useNotificationStore.getState().showNotification(ERROR_MESSAGES.fetchProducts, 'error');
    } finally {
      set({ isLoading: false });
    }
  },
}));
