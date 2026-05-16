import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'yaswanthharit@gmail.com';
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });
  console.log(`Promoted ${user.email} to ADMIN`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
