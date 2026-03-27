# Elisia Backend - Seed Credentials & API Test Results

Generated: 2026-03-27

## 🔐 User Credentials

### Owner
| Email | Password | Role |
|-------|----------|------|
| owner@elisia.com | Owner123! | owner |

### Admins
| Email | Password | Role |
|-------|----------|------|
| admin1@elisia.com | Admin123! | admin |
| admin2@elisia.com | Admin123! | admin |

### Customers
| Email | Password | Role |
|-------|----------|------|
| customer1@elisia.com | Customer123! | customer |
| customer2@elisia.com | Customer123! | customer |
| customer3@elisia.com | Customer123! | customer |
| customer4@elisia.com | Customer123! | customer |
| customer5@elisia.com | Customer123! | customer |

## 📦 Categories Created (5 total)

| # | Name | Slug | Description |
|---|------|------|-------------|
| 1 | Троянди | troiandy | Красиві троянди на будь-який смак |
| 2 | Тюльпани | tiulpany | Ніжні тюльпани весняної свіжості |
| 3 | Орхідеї | orkhideyi | Екзотичні орхідеї для особливих випадків |
| 4 | Букети | bukety | Авторські букети від наших флористів |
| 5 | Рослини | roslyny | Кімнатні рослини для вашого дому |

## 🌸 Products Created (50 total)

**10 products per category, prices range 350-2500 UAH**

### Sample Products:

#### Троянди
Букет червоних троянд (850 UAH), Білі троянди (900), Рожеві троянди (800), Троянди мікс (950), Чайні троянди (1100), Кущові троянди (650), Троянди Гран Прі (1200), Бордові троянди (880), Персикові троянди (920), Жовті троянди (780)

#### Тюльпани
Червоні тюльпани (550), Білі тюльпани (580), Жовті тюльпани (520), Рожеві тюльпани (560), Фіолетові тюльпани (600), Тюльпани мікс (650), Махрові тюльпани (720), Лілієподібні тюльпани (680), Папуга tulips (750), Зелені тюльпани (590)

#### Орхідеї
Фаленопсис білий (1200), Фаленопсис рожевий (1250), Фаленопсис фіолетовий (1300), Дендробіум (1500), Каттлея (1800), Цимбідіум (2200), Ванда (2500), Мільтонія (1400), Онцидіум (1350), Пафіопеділум (1600)

#### Букети
Весняний букет (950), Романтичний букет (1200), Святковий букет (1500), Букет нареченої (2000), Польовий букет (750), Екзотичний букет (1800), Монобукет (1100), Букет-корзина (1650), Авторський букет (2200), Комплімент (450)

#### Рослини
Монстера (850), Фікус Еластіка (950), Сансевієрія (550), Спатифіллум (650), Заміокулькас (1100), Кактус мікс (350), Сукуленти (400), Пальма Хамедорея (1200), Драцена (900), Алоказія (1300)

---

## 🧪 API Test Results

### ✅ Working Endpoints (Tested Successfully)

#### 1. Health Check
```bash
curl http://localhost:3000/api/health
```
```json
{"success":true,"message":"API is running","timestamp":"..."}
```

#### 2. Get All Categories
```bash
curl http://localhost:3000/api/categories
```
**Result:** ✅ Returns 5 categories

#### 3. Get Products with Pagination
```bash
curl "http://localhost:3000/api/products/pagination?page=1&limit=2"
```
**Result:** ✅ Returns products with pagination (50 total, 25 pages)

#### 4. Get Category with Products
```bash
curl "http://localhost:3000/api/categories/troiandy?page=1&limit=2"
```
**Result:** ✅ Returns category with 10 products

#### 5. Get Product by Slug
```bash
curl http://localhost:3000/api/products/buket-chervonykh-troiand
```
**Result:** ✅ Returns product details

---

### ⚠️ Known Issues

#### Auth Endpoints (Not Working)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/me
- POST /api/auth/logout

**Error:** `undefined is not an object (evaluating 'cols[colKey]')`

**Cause:** Drizzle ORM + postgres-js compatibility issue with `db.insert().returning()` operations.

**Fix Options:**
1. Use raw SQL queries for INSERT operations
2. Switch to @vercel/postgres driver
3. Use stored procedures

#### Other Endpoints (Need Auth Fix)
All endpoints requiring authentication are blocked until auth is fixed:
- /api/users/*
- /api/orders/*
- /api/payment/*
- /api/delivery/*
- Admin category/product operations

---

## 📊 API Status Summary

| Module | Status | Notes |
|--------|--------|-------|
| Health | ✅ | Working |
| Categories (READ) | ✅ | All GET endpoints working |
| Products (READ) | ✅ | All GET endpoints working |
| Categories (WRITE) | ⚠️ | Needs auth fix |
| Products (WRITE) | ⚠️ | Needs auth fix |
| Auth | ❌ | INSERT/returning issue |
| Users | ⚠️ | Needs auth fix |
| Orders | ⚠️ | Needs auth fix |
| Payment | ⚠️ | Needs auth fix |
| Delivery | ⚠️ | Needs auth fix |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Push schema to database
bun run db:push

# 3. Seed database
bun run seed

# 4. Start development server
bun run dev

# 5. Test public endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/categories
curl "http://localhost:3000/api/products/pagination?page=1&limit=5"
curl http://localhost:3000/api/categories/troiandy
```

---

## 📝 Database Info

- **Database:** Neon PostgreSQL (serverless)
- **ORM:** Drizzle ORM
- **Driver:** postgres-js
- **Tables:** 11 (users, roles, addresses, categories, products, categories_products, orders, order_items, delivery, payments, refresh_tokens)

---

## 🔧 Next Steps to Fix Auth

1. **Option A: Raw SQL for INSERT**
   ```typescript
   const result = await db.execute(
     sql`INSERT INTO users (email, password) VALUES (${email}, ${hash}) RETURNING *`
   );
   ```

2. **Option B: Switch to @vercel/postgres**
   ```bash
   bun add @vercel/postgres
   ```
   Update `src/db/index.ts` to use vercel driver

3. **Option C: Use two-step process**
   ```typescript
   await db.insert(users).values({...});
   const [user] = await db.select().from(users).where(eq(users.email, email));
   ```
