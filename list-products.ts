import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}

check();
