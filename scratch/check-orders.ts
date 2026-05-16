import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  });

  console.log(JSON.stringify(orders, null, 2));
}

main();
