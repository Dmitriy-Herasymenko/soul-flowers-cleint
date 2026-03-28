import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getCategories, getRelatedProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { Heart, Share2, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Товар не знайдено | Soul Flowers',
    };
  }

  return {
    title: `${product.name} - ${product.salePrice || product.price} ₴ | Купити в Soul Flowers`,
    description: product.description || `Купити ${product.name} з доставкою по Україні`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.cover],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const categories = await getCategories();

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Товар не знайдено</h1>
          <p className="text-gray-600 mb-6">На жаль, цей товар більше не доступний</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-pink-600 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-rose-600 transition-all shadow-md"
          >
            До каталогу
          </Link>
        </div>
      </div>
    );
  }

  // Знаходимо категорію продукту по slug (бо categoryId може бути null)
  const productCategory = categories.find((cat) =>
    cat.slug === product.slug.split('-').slice(-1).join('-') ||
    cat.slug === 'troiandy' || // fallback для прикладу
    cat.slug === 'bukety' ||
    cat.slug === 'roslyny' ||
    cat.slug === 'tiulpany' ||
    cat.slug === 'orkhideyi'
  );

  // Отримуємо пов'язані продукти з тієї ж категорії
  const relatedProducts = productCategory
    ? await getRelatedProducts(productCategory.slug, slug, 5)
    : [];

  const hasSale = product.salePrice && product.salePrice !== product.price;
  const discount = hasSale
    ? Math.round((1 - parseFloat(product.salePrice!) / parseFloat(product.price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-pink-600 transition-colors">Головна</Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/products" className="hover:text-pink-600 transition-colors">Каталог</Link>
            </li>
            {productCategory && (
              <>
                <li className="text-gray-300">/</li>
                <li>
                  <Link href={`/products/category/${productCategory.slug}`} className="hover:text-pink-600 transition-colors">{productCategory.name}</Link>
                </li>
              </>
            )}
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 p-6 md:p-8 lg:p-12">
            {/* Image Gallery */}
            <div className="w-full">
              <ProductGallery
                cover={product.cover}
                gallery={product.gallery}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center w-full min-w-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-words">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                {hasSale ? (
                  <>
                    <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                      ₴{product.salePrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₴{product.price}
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">₴{product.price}</span>
                )}
              </div>

              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-green-700 font-medium">
                      В наявності ({product.stock} шт.)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <p className="text-red-700 font-medium">
                      Немає в наявності
                    </p>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-lg mb-6 ${
                  product.stock > 0
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:from-pink-700 hover:to-rose-600 hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Додати до кошика' : 'Товар відсутній'}
              </button>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Доставка</p>
                    <p className="text-gray-500 text-xs">По всій Україні</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Гарантія</p>
                    <p className="text-gray-500 text-xs">100% якості</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Повернення</p>
                    <p className="text-gray-500 text-xs">Протягом 14 днів</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Пов'язані товари
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}

        {/* JSON-LD Structured Data */}
        <ProductJsonLD product={product} />
      </div>
    </div>
  );
}

function ProductJsonLD({ product }: { product: any }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.cover,
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'UAH',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
