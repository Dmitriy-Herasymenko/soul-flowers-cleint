# Soul Flowers API Documentation

API для квіткового магазину Elisia. Розроблено для інтеграції з frontend.

**Production URL:** `https://soul-flowers-api.vercel.app`  
**Swagger Docs:** `https://soul-flowers-api.vercel.app/api/docs`

---

## 📋 Зміст

- [Аутентифікація](#аутентифікація)
- [Категорії](#категорії)
- [Продукти](#продукти)
- [Замовлення](#замовлення)
- [Оплата](#оплата)
- [Доставка](#доставка)
- [Користувачі](#користувачі)
- [Приклади коду](#приклади-коду)

---

## 🔐 Аутентифікація

### Реєстрація
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Вимоги до пароля:**
- Мінімум 8 символів
- Хоча б одна велика літера
- Хоча б одна цифра

**Відповідь (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "cover": null,
    "roles": ["customer"]
  }
}
```

### Логін
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Відповідь (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["customer"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Оновлення токена
```http
POST /api/auth/me
Cookie: refresh_token=<token>
```

### Вихід
```http
POST /api/auth/logout
Cookie: refresh_token=<token>
```

---

## 🌸 Категорії

### Отримати всі категорії
```http
GET /api/categories
```

**Відповідь:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Троянди",
      "slug": "troiandy",
      "cover": "https://...",
      "description": "..."
    }
  ]
}
```

### Отримати категорію з продуктами
```http
GET /api/categories/:slug?page=1&limit=10
```

### Продукти категорії з пагінацією
```http
GET /api/categories/:slug/pagination?page=1&limit=10&filter=sale&search=троянд
```

**Параметри:**
- `page` - сторінка (default: 1)
- `limit` - товарів на сторінці (default: 10)
- `filter` - сортування: `desc`, `asc`, `price_desc`, `price_asc`, `sale`
- `search` - пошук по назві/опису

**Відповідь:**
```json
{
  "success": true,
  "data": [...products],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 🛍️ Продукти

### Отримати продукти з пагінацією
```http
GET /api/products/pagination?page=1&limit=10&filter=sale&categoryId=uuid&search=букет
```

**Параметри:**
- `page` - сторінка
- `limit` - товарів на сторінці
- `filter` - `desc`, `asc`, `price_desc`, `price_asc`, `sale`
- `categoryId` - фільтр по категорії
- `search` - пошук

### Отримати продукт по slug
```http
GET /api/products/:slug
```

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Букет червоних троянд",
    "slug": "buket-chervonykh-troiand",
    "cover": "https://...",
    "description": "...",
    "price": "750.00",
    "salePrice": "650.00",
    "gallery": ["https://...", "https://..."],
    "stock": 15
  }
}
```

---

## 📦 Замовлення

### Створити замовлення
**Auth required:** `Bearer <accessToken>`

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "deliveryType": "shipping",
  "address": {
    "street": "вул. Хрещатик, 1",
    "city": "Київ",
    "postalCode": "01001",
    "country": "Україна"
  }
}
```

**deliveryType:** `shipping` або `pickup`

**Відповідь (201):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "userId": "uuid",
      "totalAmount": "1500.00",
      "status": "pending"
    },
    "delivery": {
      "id": "uuid",
      "orderId": "uuid",
      "status": "pending",
      "address": "вул. Хрещатик, 1, Київ, 01001, Україна"
    }
  }
}
```

### Отримати свої замовлення
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### Отримати замовлення по ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

---

## 💳 Оплата

### Створити платіжний інтент
```http
POST /api/payment/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "uuid"
}
```

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### Отримати статус оплати
```http
GET /api/payment/:orderId
Authorization: Bearer <token>
```

---

## 🚚 Доставка

### Отримати доставки кур'єра
**Auth required:** Courier role

```http
GET /api/delivery/courier
Authorization: Bearer <token>
```

### Отримати всі доставки (Admin/Owner)
```http
GET /api/delivery/admin/all?page=1&limit=10
Authorization: Bearer <token>
```

### Оновити статус доставки
```http
PATCH /api/delivery/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "delivered_pickup",
  "notes": "Доставлено"
}
```

**Статуси:** `pending`, `paid_cashed`, `paid_card`, `delivered_shipping`, `delivered_pickup`

### Призначити кур'єра (Admin/Owner)
```http
PATCH /api/delivery/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "courierId": "uuid"
}
```

---

## 👥 Користувачі

### Отримати свій профіль
```http
GET /api/users/me
Authorization: Bearer <token>
```

### Оновити профіль
```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "cover": "https://..."
}
```

### Отримати свої адреси
```http
GET /api/users/me/addresses
Authorization: Bearer <token>
```

### Створити адресу
```http
POST /api/users/me/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "street": "вул. Хрещатик, 1",
  "city": "Київ",
  "postalCode": "01001",
  "country": "Україна"
}
```

### Видалити адресу
```http
DELETE /api/users/me/addresses/:id
Authorization: Bearer <token>
```

### Отримати всіх користувачів (Admin/Owner)
```http
GET /api/users/all?page=1&limit=10&role=admin
Authorization: Bearer <token>
```

### Призначити роль (Owner only)
```http
POST /api/users/assign-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "role": "admin"
}
```

**Ролі:** `owner`, `admin`, `customer`

---

## 💻 Приклади коду

### React/TypeScript hook для API

```typescript
// hooks/useApi.ts
import { useState } from 'react';

const API_URL = 'https://soul-flowers-api.vercel.app/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const authRequest = async <T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    return request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  return { request, authRequest, loading, error };
}
```

### Приклад використання

```typescript
// components/ProductList.tsx
import { useApi } from '@/hooks/useApi';

export function ProductList() {
  const { request, loading, error } = useApi();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await request<{
        data: any[];
        pagination: any;
      }>('/products/pagination?page=1&limit=10');
      
      if (data) {
        setProducts(data.data);
        setPagination(data.pagination);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Pagination {...pagination} />
    </div>
  );
}
```

### Auth Context

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const API_URL = 'https://soul-flowers-api.vercel.app/api';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      // Fetch user profile
      fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUser(data.data);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    localStorage.setItem('accessToken', data.data.accessToken);
  };

  const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // Auto login after registration
    await login(email, password);
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });
    
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      login, 
      register, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### Створення замовлення

```typescript
// hooks/useOrder.ts
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function useOrder() {
  const { accessToken } = useAuth();
  const { authRequest, loading, error } = useApi();

  const createOrder = async (
    items: OrderItem[],
    deliveryType: 'shipping' | 'pickup',
    address?: Address
  ) => {
    if (!accessToken) throw new Error('Not authenticated');

    const data = await authRequest<{
      data: {
        order: any;
        delivery: any;
      };
    }>('/orders', accessToken, {
      method: 'POST',
      body: JSON.stringify({ items, deliveryType, address }),
    });

    return data?.data;
  };

  const getUserOrders = async (page = 1, limit = 10) => {
    if (!accessToken) throw new Error('Not authenticated');

    const data = await authRequest<{
      data: any[];
      pagination: any;
    }>(`/orders?page=${page}&limit=${limit}`, accessToken);

    return data;
  };

  return { createOrder, getUserOrders, loading, error };
}
```

---

## 📝 CORS

API налаштовано для роботи з будь-яким frontend:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🔧 Помилки

Всі помилки повертаються у форматі:

```json
{
  "success": false,
  "error": {
    "message": "Опис помилки"
  }
}
```

**HTTP коди:**
- `200` - Успіх
- `201` - Створено
- `400` - Помилка валідації
- `401` - Неавторизовано
- `403` - Заборонено (немає прав)
- `404` - Не знайдено
- `500` - Помилка сервера

---

## 📞 Контакти

API розроблено для Elisia Flower Shop.

**Технології:**
- Backend: Elysia.js + Bun
- Database: Neon PostgreSQL + Drizzle ORM
- Auth: JWT (Access + Refresh tokens)
- Payment: Stripe
