'use client';

import { create } from 'zustand';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarMessage {
  id: string;
  type: SnackbarType;
  message: string;
  duration?: number;
}

interface SnackbarState {
  messages: SnackbarMessage[];
  addMessage: (message: Omit<SnackbarMessage, 'id'>) => void;
  removeMessage: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

export const useSnackbarStore = create<SnackbarState>((set, get) => ({
  messages: [],

  addMessage: (message) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newMessage: SnackbarMessage = {
      id,
      duration: 5000,
      ...message,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Автоматичне видалення через duration
    if (newMessage.duration && newMessage.duration > 0) {
      setTimeout(() => {
        get().removeMessage(id);
      }, newMessage.duration);
    }
  },

  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    }));
  },

  success: (message, duration) => {
    get().addMessage({ type: 'success', message, duration });
  },

  error: (message, duration) => {
    get().addMessage({ type: 'error', message, duration });
  },

  info: (message, duration) => {
    get().addMessage({ type: 'info', message, duration });
  },

  warning: (message, duration) => {
    get().addMessage({ type: 'warning', message, duration });
  },
}));
