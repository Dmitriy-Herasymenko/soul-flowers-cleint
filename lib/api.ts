import { apiClient } from './api-client';

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
  return apiClient.get<Category[]>('/categories');
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

  return apiClient.get<PaginationResponse<Product>>(`/products/pagination?${params}`);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithProducts | null> {
  return apiClient.get<CategoryWithProducts>(`/categories/${slug}`);
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

  return apiClient.get<PaginationResponse<Product>>(`/categories/${slug}/pagination?${params}`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return apiClient.get<Product>(`/products/${slug}`);
}

export async function getRelatedProducts(
  categorySlug: string | null,
  currentSlug: string,
  limit = 5
): Promise<Product[]> {
  if (!categorySlug) return [];

  const response = await apiClient.get<PaginationResponse<Product>>(
    `/categories/${categorySlug}/pagination?page=1&limit=${limit}`
  );
  return (response.data || []).filter((p: Product) => p.slug !== currentSlug);
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

export async function getUserOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>('/orders', true);
}

export async function getOrderById(id: string): Promise<Order | null> {
  return apiClient.get<Order>(`/orders/${id}`, true);
}

export async function createOrder(orderData: {
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  phone: string;
}): Promise<Order> {
  return apiClient.post<Order>('/orders', orderData, true);
}

export async function getUserProfile(): Promise<unknown | null> {
  return apiClient.get<unknown>('/auth/me', true);
}

// ==================== ADMIN PRODUCTS API ====================

export async function getAllProducts(
  page = 1,
  limit = 10
): Promise<PaginationResponse<Product>> {
  return apiClient.get<PaginationResponse<Product>>(
    `/products/pagination?page=${page}&limit=${limit}`,
    true
  );
}

export async function createProduct(productData: {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice?: string | null;
  stock: number;
  categoryId: string;
  cover: string;
  gallery?: string[];
}): Promise<Product> {
  return apiClient.post<Product>('/products', productData, true);
}

export async function updateProduct(
  id: string,
  productData: Partial<{
    name: string;
    slug: string;
    description: string;
    price: string;
    salePrice: string | null;
    stock: number;
    categoryId: string;
    cover: string;
    gallery: string[];
  }>
): Promise<Product> {
  return apiClient.put<Product>(`/products/${id}`, productData, true);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete<void>(`/products/${id}`, true);
}
