import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewId } from '../types';

interface User {
  username: string;
  role: string;
  fullName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  defaultView: ViewId;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const getDefaultView = (role?: string): ViewId => {
  if (role === 'Admin') return 'manager';
  return 'waiter';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      defaultView: 'waiter',
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true,
        defaultView: getDefaultView(user.role) 
      }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
