import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ProductsGrid } from '@/components/ProductsGrid';
import { HeroSlider } from '@/components/HeroSlider';
import { Truck, Sparkles, CreditCard, Heart, Award, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soul Flowers - Купити квіти з доставкою | Свіжі букети онлайн',
  description: 'Широкий вибір свіжих квітів: троянди, тюльпани, орхідеї та авторські букети. Замовляйте онлайн з доставкою по Україні. Найкращі ціни та якість.',
  keywords: ['квіти', 'купити квіти', 'троянди', 'тюльпани', 'букети', 'доставка квітів', 'Soul Flowers'],
  openGraph: {
    title: 'Soul Flowers - Інтернет-магазин квітів',
    description: 'Свіжі квіти з доставкою по Україні',
    type: 'website',
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { page = '1', limit = '24' } = await searchParams;
  const productsData = await getProducts(parseInt(page), parseInt(limit));
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
      {/* Hero Slider */}
      <HeroSlider />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:flex-shrink-0 lg:w-64">
            <CategorySidebar categories={categories} />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Products */}
            <section id="products" className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Популярні товари
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Найкращі квіткові композиції від наших флористів
                  </p>
                </div>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
                >
                  Дивитися всі товари
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <Suspense fallback={<ProductsSkeleton />}>
                <ProductsGrid products={productsData.data} pagination={productsData.pagination} />
              </Suspense>
            </section>

            {/* Benefits */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Чому обирають Soul Flowers
                </h2>
                <p className="text-gray-600">
                  Переваги, які роблять нас кращими
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Швидка доставка</h3>
                  <p className="text-gray-600 leading-relaxed">Доставимо ваш букет вчасно та у найкращому вигляді по всій Україні</p>
                </div>
                <div className="group p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Свіжі квіти</h3>
                  <p className="text-gray-600 leading-relaxed">Тільки найсвіжіші квіти від перевірених постачальників щодня</p>
                </div>
                <div className="group p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Зручна оплата</h3>
                  <p className="text-gray-600 leading-relaxed">Оплата карткою онлайн або готівкою при отриманні замовлення</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-8 md:p-12 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Зроблено з любов'ю</h3>
                  <p className="text-gray-600 text-sm">Кожен букет створюється з турботою про ваші емоції</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Гарантія якості</h3>
                  <p className="text-gray-600 text-sm">Повернемо кошти, якщо квіти не сподобаються</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Безкоштовна доставка</h3>
                  <p className="text-gray-600 text-sm">При замовленні від 1500 грн доставка безкоштовна</p>
                </div>
              </div>
            </section>
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
