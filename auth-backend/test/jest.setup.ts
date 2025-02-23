import { PrismaClient } from '@prisma/client';

beforeAll(async () => {
  // Validate that we're using a test database
  const prisma = new PrismaClient();
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    if (!databaseUrl.includes('test')) {
      throw new Error(
        'Must use a test database for e2e tests. Database URL must include "test"',
      );
    }

    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to test database');
  } catch (error) {
    console.error('Database validation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});

afterAll(async () => {
  // Clean up any test data if needed
  const prisma = new PrismaClient();
  try {
    // Clean up all tables before tests
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  } finally {
    await prisma.$disconnect();
  }
});
