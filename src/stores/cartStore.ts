import { create } from 'zustand';
import type { CartItem, CartStore } from '../types';

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  sent: false,

  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      set({ cart: cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)) });
    } else {
      set({ cart: [...cart, { ...item, qty: 1, notes: '' }] });
    }
  },

  updateCartQty: (id, delta) => {
    set((state) => ({
      cart: state.cart
        .map((c) => {
          if (c.id === id) {
            const newQty = c.qty + delta;
            return newQty > 0 ? { ...c, qty: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null && c.qty > 0),
    }));
  },

  updateCartNote: (id, notes) => {
    set((state) => ({
      cart: state.cart.map((c) => (c.id === id ? { ...c, notes } : c)),
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((c) => c.id !== id) }));
  },

  clearCart: () => set({ cart: [], sent: false }),

  setCart: (cart) => set({ cart }),
}));
