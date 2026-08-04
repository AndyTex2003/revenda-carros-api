import dotenv from 'dotenv';

process.env.NODE_ENV = 'test';
dotenv.config();

if (process.env.DATABASE_TEST_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL;
}
