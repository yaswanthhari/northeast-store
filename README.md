# Northeast Store 🌿

An online marketplace for authentic food products from the 8 states of Northeast India. Built with **Next.js 16**, **Prisma**, **PostgreSQL (Neon)**, and deployed on **Vercel**.

## 🛍️ Features

- 24+ authentic Northeast Indian products
- Category filtering, price range filter, sorting
- Shopping cart (localStorage persistent)
- User auth (register/login)
- Checkout & order flow
- Blog/Recipe section
- Responsive, glassmorphism design

## 🚀 Local Development (SQLite)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/northeast-store.git
cd northeast-store

# 2. Install dependencies
npm install

# 3. Set up local env (SQLite)
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to local db
npx prisma db push

# 6. Seed the database
npx prisma db seed

# 7. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Test account:** `test@example.com` / `password123`

## ☁️ Production Setup (Neon PostgreSQL)

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the connection strings from Neon dashboard
3. Add to your `.env` (or Vercel environment variables):

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

4. Run migrations: `npx prisma migrate deploy`
5. Seed the database: `npx prisma db seed`

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database (local) | SQLite via Prisma |
| Database (prod) | Neon PostgreSQL |
| Styling | Vanilla CSS Modules |
| Animations | Framer Motion |
| Icons | Lucide React |
| ORM | Prisma |
