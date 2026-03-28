'use client';

import { useCartStore } from '@/stores/cart-store';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function CartDrawer() {
  const { isOpen, toggleCart, items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.error(
      <div className="flex items-center gap-3">
        <Trash2 className="w-5 h-5" />
        <div>
          <p className="font-semibold">Видалено з кошика</p>
          <p className="text-sm opacity-80">{name}</p>
        </div>
      </div>,
      {
        duration: 2000,
      }
    );
  };

  const handleClearCart = () => {
    useCartStore.getState().clearCart();
    toast.error(
      <div className="flex items-center gap-3">
        <Trash2 className="w-5 h-5" />
        <div>
          <p className="font-semibold">Кошик очищено</p>
        </div>
      </div>,
      {
        duration: 2000,
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Кошик ({totalItems()} шт.)
            </h2>
          </div>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Закрити кошик"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Ваш кошик порожній</p>
              <Link
                href="/products"
                onClick={toggleCart}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Перейти до каталогу →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={toggleCart}
                      className="font-medium text-gray-900 hover:text-pink-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-1 flex items-center gap-2">
                      {item.salePrice ? (
                        <>
                          <span className="font-bold text-pink-600">
                            ₴{item.salePrice}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₴{item.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900">
                          ₴{item.price}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-white rounded transition-colors"
                        aria-label="Зменшити кількість"
                      >
                        <Minus className="w-4 h-4 text-gray-500" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-white rounded transition-colors"
                        aria-label="Збільшити кількість"
                      >
                        <Plus className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="ml-auto p-1 hover:bg-white rounded transition-colors text-red-500"
                        aria-label="Видалити товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 md:p-6 space-y-4">
            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="w-full py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Очистити кошик
            </button>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Загальна сума:</span>
              <span className="text-2xl font-bold text-gray-900">
                ₴{totalPrice()}
              </span>
            </div>

            {/* Checkout Button */}
            <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl">
              Оформити замовлення
            </button>

            {/* Continue Shopping */}
            <Link
              href="/products"
              onClick={toggleCart}
              className="block text-center text-pink-600 hover:text-pink-700 font-medium"
            >
              Продовжити покупки →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
