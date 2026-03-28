'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart, Menu, X, Flower2 } from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  // Синхронізуємо кількість товарів тільки на клієнті
  useEffect(() => {
    setItemCount(totalItems());
  }, [totalItems]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Flower2 className="w-full h-full text-pink-500 group-hover:text-pink-600 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Soul Flowers
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Магазин квітів
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Головна
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Каталог
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 md:p-3 hover:bg-pink-50 rounded-full transition-colors group"
                aria-label="Відкрити кошик"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-pink-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Меню"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Головна
                </Link>
                <Link
                  href="/products"
                  className="px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Каталог
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
