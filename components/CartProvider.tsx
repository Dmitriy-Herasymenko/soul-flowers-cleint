'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCartStore();

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#ecfdf5',
              color: '#047857',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <CartSync items={items} />
      {children}
    </>
  );
}

// Компонент для синхронізації сповіщень
function CartSync({ items }: { items: any[] }) {
  const prevItemsLength = useCartStore((state) => state.items.length);

  useEffect(() => {
    // Це спрацює при зміні кошика
  }, [items]);

  return null;
}
