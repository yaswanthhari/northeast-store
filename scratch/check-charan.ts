import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    where: { 
      user: { 
        email: 'charantejathalluri@gmail.com' 
      } 
    },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
  console.log(JSON.stringify(order, null, 2));
}

main();
