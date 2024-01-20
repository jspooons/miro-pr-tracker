import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient;
  }

// Initialize PrismaClient and export it
if (process.env.NODE_ENV === 'production') {
    global.prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
  }
  

export default global.prisma