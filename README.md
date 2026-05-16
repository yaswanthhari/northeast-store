# 🌿 Northeast Store Marketplace

<div align="center">
  <img src="https://northeast-store.vercel.app/logo.jpg" width="200" alt="Northeast Store Logo" />
  <p align="center">
    <strong>Authentic Flavors of the Eight States</strong>
    <br />
    <a href="https://northeast-store.vercel.app"><strong>Live Demo 🚀</strong></a>
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
</div>

---

## ✨ Features

### 🛍️ Premium Marketplace
- **24+ Authentic Products**: Sourced directly from local producers in the Eight States.
- **Glassmorphism UI**: High-end, modern design with smooth animations.
- **Persistent Cart**: Global shopping cart that stays with you across sessions.
- **Advanced Search & Filter**: Find products by category, state, and price.

### 👑 Collaborative Admin Ecosystem (`/admin`)
- **Live User Monitoring**: See exactly who is online in real-time.
- **Role-Based Access**: Secure management system with Admin/User roles.
- **Collaborative Controls**: Promote or demote team members instantly.
- **Activity Logs**: Track the "Last Active" status of all registered users.

### 🍜 Regional Culinary Hub
- **Authentic Recipes**: Discover traditional secrets like Black Sesame Potato Curry.
- **Regional Blog**: Learn about the culture and heritage of the Eight States.

---

## 🚀 Getting Started

> [!NOTE]
> The **localhost** links below only work when you are running the project on your own machine.

### 💻 Local Development
```bash
# Clone the repository
git clone https://github.com/yaswanthhari/northeast-store.git
cd northeast-store

# Install dependencies
npm install

# Setup Environment
echo 'DATABASE_URL="file:./dev.db"' > .env

# Initialize Database (SQLite)
npx prisma generate
npx prisma db push
npx prisma db seed

# Launch Development Server
npm run dev
```
🔗 Once running, visit: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router & Turbopack) |
| **Database** | Neon PostgreSQL (Production) / SQLite (Local) |
| **ORM** | Prisma |
| **Auth** | JWT with Edge Middleware Protection |
| **Styling** | Vanilla CSS Modules + Glassmorphism Design |
| **Icons** | Lucide React |

---

## 🔒 Security & Admin

The store features a robust administrative layer protected by JWT and server-side middleware. To manage the store, users must be granted the `ADMIN` role.

**Admin URL:** [https://northeast-store.vercel.app/admin](https://northeast-store.vercel.app/admin)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Copyright © 2014 - 2026, The NorthEast Store Private Limited.</p>
</div>

