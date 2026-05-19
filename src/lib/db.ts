import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // ✅ Fix 8: only log errors in production
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Auth Helpers
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export async function createUser(name: string, email: string, password: string) {
  return await prisma.user.create({
    data: {
      name,
      email: email.trim().toLowerCase(),
      password, // ✅ Fix 2: removed misleading comment — password is already hashed by caller
    },
  });
}

export async function updateLastActive(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastActive: new Date() },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { lastActive: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      lastActive: true,
      createdAt: true,
    },
  });
}

export async function updateUserRole(userId: string, role: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

// Compatibility Aliases for existing routes
export const findMockUserByEmail = findUserByEmail;
export const saveMockUser = async (user: { name: string; email: string; password: string }) => {
  return await createUser(user.name, user.email, user.password);
};
