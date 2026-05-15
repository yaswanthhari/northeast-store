const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query'],
});

async function test() {
  try {
    const products = await prisma.product.findMany();
    console.log('Products:', products);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
