import 'dotenv/config';
import { prisma } from './prisma.js';

try {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  console.log('Database connection test succeeded.');
} finally {
  await prisma.$disconnect();
}
