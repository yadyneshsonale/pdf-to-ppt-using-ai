// Prisma Database Client Singleton
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
