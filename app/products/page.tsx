import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ProductsGrid } from '@/components/ProductsGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог квітів | Купити квіти з доставкою - Soul Flowers',
  description: 'Широкий вибір свіжих квітів: троянди, тюльпани, орхідеї та авторські букети. Замовляйте онлайн з доставкою по Україні.',
  openGraph: {
    title: 'Каталог квітів | Soul Flowers',
    description: 'Широкий вибір свіжих квітів з доставкою по Україні',
    type: 'website',
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { page = '1', limit = '12' } = await searchParams;
  const productsData = await getProducts(parseInt(page), parseInt(limit));
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Каталог квітів
          </h1>
          <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
            Оберіть ідеальний букет для вашої події
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:flex-shrink-0 lg:w-64">
            <CategorySidebar categories={categories} />
          </div>

          {/* Main Content - Products */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductsGrid products={productsData.data} pagination={productsData.pagination} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-3/4 animate-shimmer" />
            <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-1/2 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
