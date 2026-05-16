# Northeast Store 🌿

An authentic marketplace for organic and traditional food products from the Eight States of Northeast India. 

**Live Demo:** [https://northeast-store.vercel.app](https://northeast-store.vercel.app)

---

## 🌟 Key Features

### 🛒 Marketplace
- **24+ Curated Products**: Authentic items sourced directly from local producers.
- **Advanced Filtering**: Filter by category (Food, Smoked Meats, Spices), State (Assam, Manipur, Nagaland, etc.), and Price.
- **Smart Search**: Find products instantly using the search bar.
- **Persistent Cart**: Global shopping cart using React Context and LocalStorage.

### 👑 Collaborative Admin Dashboard (`/admin`)
- **Real-time User Tracking**: Monitor currently online team members and users.
- **Role Management**: Promote users to **ADMIN** or demote them to **USER** with one click.
- **Activity Monitoring**: Detailed "Last Active" timestamps for all registered users.
- **Team Collaboration**: Secure access for multiple administrators to manage the store.

### 📖 Recipe Blog
- **Traditional Recipes**: Learn how to cook authentic Northeastern dishes like Black Sesame Potato Curry and Naga Style Pork.
- **Interactive Guides**: Detailed step-by-step instructions for regional staples.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless Cloud Database)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT-based secure sessions with Middleware protection.
- **Styling**: Premium Glassmorphism UI with Vanilla CSS Modules.
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/yaswanthhari/northeast-store.git
cd northeast-store

# 2. Install dependencies
npm install

# 3. Environment Setup
# Create a .env file with your DATABASE_URL (SQLite or PostgreSQL)
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Initialize Database
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Run Development Server
npm run dev
```

Visit `http://localhost:3000` to see the site.

---

## 📋 Administrative Access

To access the **Admin Dashboard**:
1. Log in to the application.
2. Navigate to [https://northeast-store.vercel.app/admin](https://northeast-store.vercel.app/admin).
3. Ensure your account has the `ADMIN` role in the database.

---

## 📄 License
Copyright © 2014 - 2026, The NorthEast Store Private Limited. All rights reserved.
