const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  cover: string;
  description: string;
  price: string;
  salePrice: string | null;
  stock: number;
  categoryId?: string;
  gallery?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  cover: string | null;
  description: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  cover: string;
  description: string;
  products: Product[];
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json();
  
  // Фільтруємо тільки категорії з українськими назвами
  const validSlugs = ['troiandy', 'tiulpany', 'orkhideyi', 'bukety', 'roslyny'];
  return (data.data || []).filter((cat: Category) => validSlugs.includes(cat.slug));
}

export async function getProducts(
  page = 1,
  limit = 12,
  filter?: string,
  search?: string,
  sort?: string
): Promise<PaginationResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);

  const response = await fetch(`${API_URL}/products/pagination?${params}`, {
    next: { revalidate: 60 },
  });
  const data = await response.json();
  
  // Фільтруємо тестові продукти
  const filteredProducts = (data.data || []).filter((p: Product) => 
    !p.name.startsWith('Test Product') && !p.slug.startsWith('test-product')
  );
  
  return {
    ...data,
    data: filteredProducts,
    pagination: {
      ...data.pagination,
      total: filteredProducts.length,
    },
  };
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithProducts | null> {
  const response = await fetch(`${API_URL}/categories/${slug}`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json();
  return data.data || null;
}

export async function getCategoryProducts(
  slug: string,
  page = 1,
  limit = 12,
  filter?: string,
  search?: string
): Promise<PaginationResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);

  const response = await fetch(`${API_URL}/categories/${slug}/pagination?${params}`, {
    next: { revalidate: 60 },
  });
  return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: 60 },
  });
  const data = await response.json();
  return data.data || null;
}

export async function getRelatedProducts(categorySlug: string | null, currentSlug: string, limit = 5): Promise<Product[]> {
  if (!categorySlug) return [];
  
  const response = await fetch(`${API_URL}/categories/${categorySlug}/pagination?page=1&limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json();
  
  // Фільтруємо тестові продукти
  return (data.data || [])
    .filter((p: Product) => 
      !p.name.startsWith('Test Product') && 
      !p.slug.startsWith('test-product') &&
      p.slug !== currentSlug
    );
}
