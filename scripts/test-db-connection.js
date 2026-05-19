import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log('DB connected');
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query result:', res);
  } catch (e) {
    console.error('DB connection error:');
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
