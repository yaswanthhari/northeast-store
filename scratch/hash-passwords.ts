import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users.`);

  for (const user of users) {
    // Check if password is already hashed (bcrypt hashes start with $2)
    if (!user.password.startsWith('$2')) {
      console.log(`Hashing password for user: ${user.email}`);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } else {
      console.log(`Password for user ${user.email} is already hashed.`);
    }
  }

  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
