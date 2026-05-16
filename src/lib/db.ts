import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Auth Helpers
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(name: string, email: string, password: string) {
  return await prisma.user.create({
    data: {
      name,
      email,
      password, // Note: In production, always hash passwords!
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
export const saveMockUser = async (user: any) => {
  return await createUser(user.name, user.email, user.password);
};
