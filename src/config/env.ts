import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.DATABASE_TEST_URL ?? process.env.DATABASE_URL
    : process.env.DATABASE_URL;

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: databaseUrl ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  aiApiKey: process.env.AI_API_KEY ?? '',
};
