'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, Percent } from 'lucide-react';

interface ProductsGridProps {
  products: any[];
  pagination: any;
}

export function ProductsGrid({ products, pagination }: ProductsGridProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSort = searchParams.get('sort') || '';

  const handleSort = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    params.set('page', '1'); // Скидаємо на першу сторінку при зміні сортування
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-gray-600">
          Показано <span className="font-semibold text-gray-900">{products.length}</span> товарів
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Сортувати:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === ''
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">За замовчуванням</span>
            </button>
            <button
              onClick={() => handleSort('price_asc')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === 'price_asc'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ArrowUpAZ className="w-4 h-4" />
              <span className="hidden sm:inline">Ціна: низька</span>
            </button>
            <button
              onClick={() => handleSort('price_desc')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === 'price_desc'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ArrowDownAZ className="w-4 h-4" />
              <span className="hidden sm:inline">Ціна: висока</span>
            </button>
            <button
              onClick={() => handleSort('sale')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === 'sale'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span className="hidden sm:inline">Знижки</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination pagination={pagination} />
    </>
  );
}
