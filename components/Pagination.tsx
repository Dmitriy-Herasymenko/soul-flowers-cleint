'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function Pagination({ pagination }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <Link
        href={createPageURL(page - 1)}
        className={`px-4 py-2 rounded-md border ${
          page === 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-disabled={page === 1}
      >
        ← Назад
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={createPageURL(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-md border ${
              page === pageNum
                ? 'border-pink-500 bg-pink-500 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </Link>
        ))}
      </div>

      <Link
        href={createPageURL(page + 1)}
        className={`px-4 py-2 rounded-md border ${
          page === totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-disabled={page === totalPages}
      >
        Вперед →
      </Link>
    </nav>
  );
}
