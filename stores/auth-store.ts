'use client';

import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/lib/auth';
import { getToken, getUser } from '@/lib/api-interceptor';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  isOwner: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return getToken();
}

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  return getUser();
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser() as User | null,
  token: getStoredToken(),
  isLoading: false,
  isAuthenticated: !!getStoredToken(),

  isOwner: (getStoredUser() as User | null)?.roles?.includes('owner') ?? false,
  isAdmin: (getStoredUser() as User | null)?.roles?.includes('admin') ?? false,
  isCustomer: (getStoredUser() as User | null)?.roles?.includes('customer') ?? false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await apiLogin(email, password);
      set({
        user: data.user,
        token: data.accessToken,
        isLoading: false,
        isAuthenticated: true,
        isOwner: data.user.roles?.includes('owner') ?? false,
        isAdmin: data.user.roles?.includes('admin') ?? false,
        isCustomer: data.user.roles?.includes('customer') ?? false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await apiRegister(name, email, password);
      set({
        user: data.user,
        token: data.accessToken,
        isLoading: false,
        isAuthenticated: true,
        isOwner: data.user.roles?.includes('owner') ?? false,
        isAdmin: data.user.roles?.includes('admin') ?? false,
        isCustomer: data.user.roles?.includes('customer') ?? false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    apiLogout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isOwner: false,
      isAdmin: false,
      isCustomer: false,
    });
  },

  checkAuth: async () => {
    const token = getToken();
    const user = getUser();
    
    if (token && user) {
      // Спробуємо оновити дані користувача з сервера
      try {
        const freshUser = await getCurrentUser();
        if (freshUser) {
          const userObj = freshUser as User;
          set({
            user: userObj,
            isAuthenticated: true,
            isOwner: userObj.roles?.includes('owner') ?? false,
            isAdmin: userObj.roles?.includes('admin') ?? false,
            isCustomer: userObj.roles?.includes('customer') ?? false,
          });
          return;
        }
      } catch {
        // Якщо не вдалося отримати дані - використовуємо кеш
      }
      
      // Використовуємо кешовані дані
      const userObj = user as User;
      set({
        user: userObj,
        isAuthenticated: true,
        isOwner: userObj.roles?.includes('owner') ?? false,
        isAdmin: userObj.roles?.includes('admin') ?? false,
        isCustomer: userObj.roles?.includes('customer') ?? false,
      });
    } else {
      set({ isAuthenticated: false, user: null, isOwner: false, isAdmin: false, isCustomer: false });
    }
  },
}));
