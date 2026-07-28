import { PrismaClient } from '@prisma/client';

// Automatically map Vercel Postgres/Supabase environment variables if DATABASE_URL is not set directly
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.STORAGE_POSTGRES_PRISMA_URL ||
    process.env.STORAGE_POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    '';
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.STORAGE_POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL;
}

// Singleton pattern — ALWAYS cache on globalThis (both dev & prod)
// This prevents connection pool exhaustion in Vercel serverless functions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? {
          db: {
            url: process.env.DATABASE_URL,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Cache on globalThis in ALL environments (critical for serverless)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
