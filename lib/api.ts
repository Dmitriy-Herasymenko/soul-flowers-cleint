const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

// Імпорт для клієнтських запитів з токеном
import { getAuthHeaders } from './api-interceptor';

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
  filter?: string,
  search?: string,
  sort?: string
): Promise<PaginationResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);

  const response = await fetch(`${API_URL}/products/pagination?${params}`, {
    next: { revalidate: 60 },
  });
  return response.json();
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
  filter?: string,
  search?: string,
  sort?: string
): Promise<PaginationResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);

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
  return (data.data || []).filter((p: Product) => p.slug !== currentSlug);
}

// ==================== CLIENT-SIDE API (з токеном) ====================

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: string;
}

// Отримати замовлення користувача (client-side з токеном)
export async function getUserOrders(): Promise<Order[]> {
  const data = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  }).then((res) => res.json());
  return data.data || [];
}

// Отримати одне замовлення
export async function getOrderById(id: string): Promise<Order | null> {
  const data = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  }).then((res) => res.json());
  return data.data || null;
}

// Створити замовлення
export async function createOrder(orderData: {
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  phone: string;
}): Promise<Order> {
  const data = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(orderData),
  }).then((res) => res.json());
  return data.data;
}

// Отримати профіль користувача
export async function getUserProfile(): Promise<unknown | null> {
  const data = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  }).then((res) => res.json());
  return data.data || null;
}
