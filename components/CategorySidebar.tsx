'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface CategorySidebarProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    cover: string | null;
  }[];
  activeSlug?: string;
}

function CategoryImage({ cover, name }: { cover: string | null; name: string }) {
  const [error, setError] = useState(false);
  const showFallback = !cover || error;

  if (showFallback) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex-shrink-0 flex items-center justify-center">
        <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
      <Image
        src={cover}
        alt={name}
        fill
        className="object-cover"
        sizes="40px"
        onError={() => setError(true)}
      />
    </div>
  );
}

export function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <h2 className="font-bold text-gray-900">Категорії</h2>
        </div>
        <nav className="p-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all ${
                activeSlug === category.slug
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'hover:bg-pink-50 text-gray-700'
              }`}
            >
              <CategoryImage cover={category.cover} name={category.name} />
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
