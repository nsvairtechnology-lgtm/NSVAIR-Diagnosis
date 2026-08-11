import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Ensure local db directory exists
try {
  const dbDir = path.join(process.cwd(), 'db')
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
} catch {
  // Ignore in restricted environments
}

// Fallback DATABASE_URL if pointing to /home/z/ or empty
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('/home/z/')) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'db', 'custom.db')}`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db