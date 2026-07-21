import { PrismaClient } from "@prisma/client";

// Singleton no dev/hot-reload — evita esgotar o pool de conexões do Neon a
// cada recarregamento do Next.js. Ver .harness/patterns/troubleshooting.md.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
