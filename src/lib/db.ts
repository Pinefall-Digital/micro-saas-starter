/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// Use Neon's serverless driver as the Prisma adapter.
// This enables Prisma to work over HTTP on serverless platforms (Vercel Edge, etc.)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter } as any);
}

export const db = globalForPrisma.prisma ?? createClient();

// Prevent hot-reload from creating new connections in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
