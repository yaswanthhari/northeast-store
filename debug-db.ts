import { prisma } from './src/lib/db';

async function main() {
  const users = await prisma.user.findMany({ take: 5 });
  const products = await prisma.product.findMany({ take: 5 });
  console.log('Users:', users.map(u => u.id));
  console.log('Products:', products.map(p => p.id));
}

main();
