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

// Compatibility Aliases for existing routes
export const findMockUserByEmail = findUserByEmail;
export const saveMockUser = async (user: any) => {
  return await createUser(user.name, user.email, user.password);
};
