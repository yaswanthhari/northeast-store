import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
  console.log(JSON.stringify(order, null, 2));
}

main();
