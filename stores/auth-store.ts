'use client';

import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/lib/auth';

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
  return localStorage.getItem('auth_token');
}

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,
  isAuthenticated: !!getStoredToken(),
  
  isOwner: getStoredUser()?.roles?.includes('owner') ?? false,
  isAdmin: getStoredUser()?.roles?.includes('admin') ?? false,
  isCustomer: getStoredUser()?.roles?.includes('customer') ?? false,

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

  checkAuth: () => {
    const token = getStoredToken();
    const user = getStoredUser();
    
    if (token && user) {
      set({
        user,
        isAuthenticated: true,
        isOwner: user.roles?.includes('owner') ?? false,
        isAdmin: user.roles?.includes('admin') ?? false,
        isCustomer: user.roles?.includes('customer') ?? false,
      });
    } else {
      set({ isAuthenticated: false, user: null, isOwner: false, isAdmin: false, isCustomer: false });
    }
  },
}));
