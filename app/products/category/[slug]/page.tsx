import { Suspense } from 'react';
import { getCategoryProducts, getCategories } from '@/lib/api';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ProductsGrid } from '@/components/ProductsGrid';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; limit?: string; filter?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === slug);
  
  const categoryName = currentCategory?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} | Купити квіти - Soul Flowers`,
    description: currentCategory?.description || `Купити ${categoryName.toLowerCase()} найкращої якості з доставкою по Україні. Свіжі квіти від Soul Flowers.`,
    openGraph: {
      title: `${categoryName} | Soul Flowers`,
      description: currentCategory?.description || `Купити ${categoryName.toLowerCase()} з доставкою`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = '1', limit = '12', filter = '', sort = '' } = await searchParams;

  const productsData = await getCategoryProducts(slug, parseInt(page), parseInt(limit), filter, undefined, sort);
  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-pink-100 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">Головна</a>
              </li>
              <li className="text-pink-300">/</li>
              <li>
                <a href="/products" className="hover:text-white transition-colors">Каталог</a>
              </li>
              <li className="text-pink-300">/</li>
              <li className="text-white font-medium">{currentCategory?.name || slug}</li>
            </ol>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {currentCategory?.name || slug}
            </h1>
            <p className="text-lg md:text-xl text-pink-100">
              {currentCategory?.description || `Квіти з категорії ${slug}`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:flex-shrink-0 lg:w-64">
            <CategorySidebar categories={categories} activeSlug={slug} />
          </div>

          {/* Main Content - Products */}
          <main className="flex-1 min-w-0">
            {productsData.data.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  У цій категорії поки немає товарів
                </h3>
                <p className="text-gray-600 mb-6">
                  Але ви можете переглянути інші категорії
                </p>
                <a
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all"
                >
                  Дивитися всі товари
                </a>
              </div>
            ) : (
              <Suspense fallback={<ProductsSkeleton />}>
                <ProductsGrid products={productsData.data} pagination={productsData.pagination} />
              </Suspense>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
