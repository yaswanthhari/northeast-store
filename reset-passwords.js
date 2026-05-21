const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Yaswanth@1881@', 10);
  const emails = [
    'yaswanthharitaluru@gmail.com',
    'yaswanthharit@gmail.com',
    'yaswanth@gmail.com',
    'parimigayatri5@gmail.com',
    '23051003@kiit.ac.in',
    'yugayatra@gmail.com'
  ];

  for (const email of emails) {
    try {
      const user = await prisma.user.update({
        where: { email },
        data: { password }
      });
      console.log(`Successfully reset password for ${user.email} (Role: ${user.role}) to 'Yaswanth@1881@'`);
    } catch (e) {
      console.log(`Could not find or update user with email ${email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
