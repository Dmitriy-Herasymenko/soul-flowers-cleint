'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    cover: string;
    price: string;
    salePrice: string | null;
    stock: number;
  };
}

const FALLBACK_IMAGE = '/product-fallback.svg';

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasSale = product.salePrice && product.salePrice !== product.price;
  const discount = hasSale
    ? Math.round((1 - parseFloat(product.salePrice!) / parseFloat(product.price)) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      cover: product.cover,
    });
    
    toast.success(
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-5 h-5" />
        <div>
          <p className="font-semibold">Додано до кошика</p>
          <p className="text-sm opacity-80">{product.name}</p>
        </div>
      </div>,
      {
        duration: 2000,
      }
    );
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const showFallback = !product.cover || imageError;
  const displayImage = showFallback ? FALLBACK_IMAGE : product.cover;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
          {hasSale && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Немає в наявності
            </span>
          )}

          {/* Add to Cart Button Overlay */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-500 hover:text-white"
              aria-label="Додати до кошика"
              type="button"
            >
              {isAdded ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-gray-700" />
              )}
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  ₴{product.salePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₴{product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ₴{product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
