'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useSnackbarStore, SnackbarType } from '@/stores/snackbar-store';

const icons: Record<SnackbarType, React.ReactNode> = {
  success: <CheckCircle size={20} className="text-green-600" />,
  error: <AlertCircle size={20} className="text-red-600" />,
  info: <Info size={20} className="text-blue-600" />,
  warning: <AlertTriangle size={20} className="text-yellow-600" />,
};

const bgColors: Record<SnackbarType, string> = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-yellow-50 border-yellow-200',
};

const textColors: Record<SnackbarType, string> = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
};

export default function Snackbar() {
  const { messages, removeMessage } = useSnackbarStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgColors[message.type]} animate-slide-in`}
        >
          <div className="flex-shrink-0">{icons[message.type]}</div>
          <p className={`flex-1 text-sm ${textColors[message.type]}`}>
            {message.message}
          </p>
          <button
            onClick={() => removeMessage(message.id)}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X size={16} className={textColors[message.type]} />
          </button>
        </div>
      ))}
    </div>
  );
}
