Ось детальна специфікація `spec.md` для фронтенд-частини проекту Elisia, узгоджена з бекендом та з урахуванням всіх вимог (Next.js, Bun, shadcn/ui, Zustand, next-intl, SEO, тести).

```markdown
# Elisia Flower Shop Frontend - Specification Document (v1.0)

## 📋 Project Overview

**Project Name:** Elisia Flower Shop Client  
**Framework:** Next.js 14+ (App Router)  
**Runtime:** Bun  
**UI Library:** shadcn/ui (Tailwind CSS)  
**State Management:** Zustand  
**Internationalization:** next-intl  
**API Client:** Fetch API (native) + Zod validation  
**Testing:** Vitest (Unit) + Playwright (E2E)  
**SEO:** Critical (Metadata, OpenGraph, JSON-LD)  

---

## 🏗️ Architecture & Stack

### Core Technologies
- **Runtime:** Bun (for dev server, build, and scripts)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** Zustand (Client state: Cart, Auth UI, Modals)
- **i18n:** next-intl (Locale routing: `/ua`, `/en`)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

### Project Structure
```
elisía-frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/              # i18n routing
│   │   │   ├── layout.tsx         # Root layout (providers)
│   │   │   ├── page.tsx           # Home Page (SEO)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx       # Products Catalog (Pagination)
│   │   │   │   └── [slug]/        # Product Detail (SEO)
│   │   │   │       └── page.tsx
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx       # Categories List
│   │   │   │   └── [slug]/        # Category Products (Pagination)
│   │   │   │       └── page.tsx
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── profile/
│   │   ├── api/                   # Optional API routes (proxy)
│   │   └── global.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Header, Footer, Sidebar
│   │   ├── product/               # ProductCard, Gallery, Price
│   │   ├── cart/                  # CartDrawer, CartItem
│   │   └── seo/                   # JSON-LD, Meta tags
│   ├── lib/
│   │   ├── api.ts                 # Fetch wrapper with base URL
│   │   ├── utils.ts               # CN helper, formatters
│   │   └── validations.ts         # Zod schemas (shared with backend)
│   ├── stores/
│   │   ├── cart-store.ts          # Zustand cart logic
│   │   ├── auth-store.ts          # Zustand auth state
│   │   └── ui-store.ts            # Modals, sidebar state
│   ├── messages/                  # i18n translations
│   │   ├── ua.json
│   │   └── en.json
│   └── middleware.ts              # next-intl middleware
├── public/
│   ├── images/
│   └── favicon.ico
├── scripts/
│   └── check-api.ts               # Backend health check script
├── tests/
│   ├── unit/                      # Vitest
│   └── e2e/                       # Playwright
├── next.config.js
├── tailwind.config.ts
├── components.json
├── package.json
└── .env.local
```

---

## 🌐 Internationalization (next-intl)

### Locales
- **Default:** `ua` (Ukrainian)
- **Secondary:** `en` (English)
- **Routing:** Prefix strategy (`/ua/products`, `/en/products`)

### Configuration
```typescript
// next.config.js
const withNextIntl = createNextIntlPlugin();
module.exports = withNextIntl({
  // Next.js config
});

// src/middleware.ts
export default createMiddleware({
  locales: ['ua', 'en'],
  defaultLocale: 'ua',
  localePrefix: 'always'
});
```

### Translation Structure (`messages/ua.json`)
```json
{
  "Home": {
    "title": "Elisia - Магазин квітів",
    "hero": "Свіжі квіти з доставкою",
    "featured": "Популярні категорії"
  },
  "Products": {
    "title": "Каталог продуктів",
    "filter": "Фільтри",
    "sortBy": "Сортувати",
    "priceAsc": "Ціна: низька до високої",
    "priceDesc": "Ціна: висока до низької"
  },
  "Cart": {
    "title": "Кошик",
    "empty": "Ваш кошик порожній",
    "checkout": "Оформити замовлення"
  },
  "Common": {
    "loading": "Завантаження...",
    "error": "Сталася помилка",
    "submit": "Відправити"
  }
}
```

---

## 🛒 State Management (Zustand)

### 1. Cart Store (`stores/cart-store.ts`)
- **Persistence:** `localStorage` (via `persist` middleware)
- **State:**
  - `items`: `{ productId, slug, name, price, quantity, cover }[]`
  - `total`: calculated
  - `isOpen`: boolean (for drawer)
- **Actions:**
  - `addItem(product)`
  - `removeItem(productId)`
  - `updateQuantity(productId, qty)`
  - `clearCart()`
  - `toggleCart()`

### 2. Auth Store (`stores/auth-store.ts`)
- **State:**
  - `user`: `{ id, email, role } | null`
  - `accessToken`: string | null
  - `isLoading`: boolean
- **Actions:**
  - `login(email, password)`
  - `register(data)`
  - `logout()`
  - `refreshToken()`
  - `fetchMe()`

### 3. UI Store (`stores/ui-store.ts`)
- **State:**
  - `sidebarOpen`: boolean
  - `searchQuery`: string
- **Actions:**
  - `toggleSidebar()`
  - `setSearch(query)`

---

## 🛣️ Pages & SEO Strategy

### 1. Home Page (`/[locale]/page.tsx`)
- **Content:** Hero Section, Featured Categories, New Products, Benefits.
- **SEO:**
  - `title`: "Elisia - Купити квіти з доставкою | Україна"
  - `description`: "Свіжі букети, троянди, тюльпани. Замовляйте онлайн."
  - `openGraph`: Main banner image.
  - `JSON-LD`: Organization schema.
- **Data Fetching:** Server Components (fetch from backend `/api/categories`, `/api/products`).

### 2. Products Catalog (`/[locale]/products/page.tsx`)
- **Content:** Grid of ProductCards, Filters (Price, Sort), Pagination.
- **Query Params:** `?page=1&limit=12&sort=price_asc`.
- **SEO:**
  - `title`: "Каталог квітів | Elisia"
  - `canonical`: Dynamic based on params.
- **Performance:** ISR (Incremental Static Regeneration) for product lists.

### 3. Category Page (`/[locale]/categories/[slug]/page.tsx`)
- **Content:** Category Header, Products Grid, Pagination.
- **SEO:**
  - `title`: "{Category Name} | Elisia"
  - `description`: "Купити {Category Name} найкращої якості."
  - `JSON-LD`: CollectionPage schema.
- **Data:** Fetch from `/api/categories/:slug`.

### 4. Product Detail (`/[locale]/products/[slug]/page.tsx`)
- **Content:** Image Gallery, Price, Description, Add to Cart, Related Products.
- **SEO:**
  - `title`: "{Product Name} - {Price} | Elisia"
  - `JSON-LD`: Product schema (price, availability, rating).
  - `openGraph`: Product cover image.
- **Data:** Fetch from `/api/products/:slug`.
- **Interaction:** Client Component for "Add to Cart" button.

### 5. Auth Pages (`/login`, `/register`)
- **Validation:** Zod schemas (matching backend).
- **Feedback:** Toast notifications on success/error.
- **Redirect:** To `/profile` or previous page after login.

### 6. Cart & Checkout
- **Cart:** Drawer (Sheet component) + Full Page (`/cart`).
- **Checkout:** Form (Address, Delivery Type), Stripe Integration (Client Secret).
- **Order Success:** `/order/success/:id` page.

---

## 🔌 API Integration & Health Check

### Base URL
- Env: `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:3000/api`)

### Health Check Script (`scripts/check-api.ts`)
**Requirement:** Before starting Next.js dev server, verify backend is running.
```typescript
// scripts/check-api.ts
import { $ } from 'bun';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const HEALTH_ENDPOINT = `${API_URL}/health`;

async function checkApi() {
  try {
    const response = await fetch(HEALTH_ENDPOINT);
    if (response.ok) {
      console.log('✅ Backend API is ready.');
      process.exit(0);
    } else {
      throw new Error('API returned non-200 status');
    }
  } catch (error) {
    console.error('❌ Backend API is not available. Please start the backend first.');
    console.error('Run: bun run dev in backend folder');
    process.exit(1);
  }
}

checkApi();
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "bun run scripts/check-api.ts && next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "bun test tests/unit",
    "test:e2e": "playwright test tests/e2e"
  }
}
```

### Fetch Wrapper (`src/lib/api.ts`)
- Handles Base URL.
- Attaches Auth Token (from Zustand/Cookies).
- Handles Errors (401 -> Logout, 400 -> Validation Error).
- Validates Response with Zod (optional but recommended).

---

## 🎨 UI Components (shadcn/ui)

### Required Components
1.  **Button:** Variants (default, outline, ghost, destructive).
2.  **Input:** For forms (login, search).
3.  **Card:** Product cards, info blocks.
4.  **Sheet:** Cart drawer, Mobile menu.
5.  **Dialog:** Quick view, Confirm actions.
6.  **Select:** Filters (Sort, Category).
7.  **Pagination:** Custom component for API pagination.
8.  **Skeleton:** Loading states for products.
9.  **Toast:** Notifications (sonner).
10. **Form:** React Hook Form integration.
11. **DropdownMenu:** User profile menu.
12. **Avatar:** User profile image.

### Theme
- **Default:** Light/Dark mode support (next-themes).
- **Primary Color:** Flower-inspired (e.g., Rose Pink `#e11d48` or Green `#16a34a`).
- **Typography:** Inter or Geist Sans.

---

## 🧪 Testing Strategy

### 1. Unit Tests (Vitest)
- **Components:** Render tests (Button, Card, ProductPrice).
- **Stores:** Zustand state logic (add to cart, calculate total).
- **Utils:** Price formatting, date formatting.
- **Config:** `vitest.config.ts` with `@testing-library/react`.

### 2. E2E Tests (Playwright)
- **Flows:**
  - User visits Home -> Checks SEO metadata.
  - User searches product -> Adds to cart -> Checkout.
  - User logs in -> Views profile -> Logs out.
  - Locale switch (UA <-> EN).
- **Config:** `playwright.config.ts` pointing to `localhost:3000`.

### Example Test (Playwright)
```typescript
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('Home page loads with SEO metadata', async ({ page }) => {
  await page.goto('/ua');
  await expect(page).toHaveTitle(/Elisia - Магазин квітів/);
  await expect(page.locator('h1')).toContainText('Свіжі квіти');
});

test('Add product to cart', async ({ page }) => {
  await page.goto('/ua/products');
  await page.click('button:has-text("В кошик")');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});
```

---

## 🔒 Security & Best Practices

1.  **Environment Variables:**
    - Never expose `STRIPE_SECRET_KEY` to client.
    - Use `NEXT_PUBLIC_` prefix only for safe vars.
2.  **Authentication:**
    - Store Access Token in memory (Zustand).
    - Store Refresh Token in HTTP-only cookie (handled by backend, frontend just sends requests).
    - Protect routes via Middleware (check auth state).
3.  **XSS Protection:**
    - Sanitize HTML descriptions (use `dompurify` if rendering HTML from backend).
    - Next.js escapes by default.
4.  **Performance:**
    - Use `next/image` for optimization.
    - Lazy load heavy components (Charts, Maps).
    - Implement Suspense boundaries for loading states.

---

## 📊 SEO Implementation Details

### Metadata API (Next.js)
```typescript
// app/[locale]/products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} - Купити в Elisia`,
    description: product.description,
    openGraph: {
      images: [product.cover],
    },
  };
}
```

### Structured Data (JSON-LD)
```typescript
// src/components/seo/product-json-ld.tsx
export function ProductJsonLD({ product }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.cover,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "UAH",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        })
      }}
    />
  );
}
```

### Sitemap & Robots
- **sitemap.ts:** Generate dynamic routes for products and categories.
- **robots.txt:** Allow all, disallow admin/cart routes.

---

## 🚀 Development Workflow

### 1. Prerequisites
- Backend running on `http://localhost:3000` (or specified port).
- Bun installed globally.

### 2. Installation
```bash
bun install
bunx shadcn-ui init
```

### 3. Environment Setup
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_STRIPE_KEY="pk_test_..."
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### 4. Start Development
```bash
bun run dev
# Automatically checks API health first
```

### 5. Build & Production
```bash
bun run build
bun run start
```

### 6. Testing
```bash
bun run test       # Unit tests
bun run test:e2e   # Integration tests
```

---

## 📝 Shared Types (Backend ↔ Frontend)

To ensure consistency, share Zod schemas or types if possible (monorepo style) or duplicate carefully.
**Recommendation:** Create a shared `@elisia/types` package or copy `src/lib/validations.ts` from backend to frontend `src/lib/validations.ts`.

### Example Shared Schema
```typescript
// src/lib/validations.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  cover: z.string().url(),
  // ... match backend response
});
```

---

## 📖 References

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [next-intl](https://next-intl-docs.vercel.app)
- [Playwright](https://playwright.dev)
- [Bun](https://bun.sh)

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-03-27  
**Status:** Ready for Implementation  
**Linked Backend Spec:** Elisia Backend v2.0
```

### Основні акценти цієї специфікації:
1.  **Перевірка API:** Скрипт `check-api.ts` перед запуском `next dev`.
2.  **SEO:** Детальний опис `generateMetadata`, JSON-LD, Sitemap.
3.  **Стек:** Чітко вказано Bun, Next.js App Router, shadcn/ui, Zustand, next-intl.
4.  **Структура:** Відповідає сучасним стандартам Next.js 14+.
5.  **Тести:** Vitest + Playwright (узгоджено з бекендом).
6.  **Інтеграція:** Спільні Zod схеми для валідації даних.
