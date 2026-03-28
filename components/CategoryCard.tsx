import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    cover: string | null;
    description?: string;
  };
  isActive?: boolean;
  variant?: 'default' | 'compact';
}

export function CategoryCard({ category, isActive, variant = 'default' }: CategoryCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/products/category/${category.slug}`}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
          isActive
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-100 hover:border-pink-200'
        }`}
      >
        {category.cover && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={category.cover}
              alt={category.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/category/${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isActive
          ? 'ring-2 ring-pink-500 shadow-xl'
          : 'hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="aspect-[4/3] relative">
        {category.cover ? (
          <>
            <Image
              src={category.cover}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100" />
        )}
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg drop-shadow-lg">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-white/80 text-sm mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
