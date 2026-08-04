import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import app from '../../src/app';
import { prisma } from '../../src/database/prisma';

const userPayload = {
  name: 'Test User',
  email: 'testuser@revendacarros.com',
  password: 'Test@1234',
  profile: 'ADMIN' as const,
};

let token: string;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  const passwordHash = await bcrypt.hash(userPayload.password, 10);

  await prisma.user.create({
    data: {
      name: userPayload.name,
      email: userPayload.email,
      password: passwordHash,
      profile: userPayload.profile,
    },
  });
});

afterEach(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth module', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app).post('/login').send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');

    token = response.body.token;
  });

  it('should not login with invalid password', async () => {
    const response = await request(app).post('/login').send({
      email: userPayload.email,
      password: 'WrongPassword1!',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Email ou senha inválidos' });
  });

  it('should not login with non-existing user', async () => {
    const response = await request(app).post('/login').send({
      email: 'doesnotexist@revendacarros.com',
      password: 'Test@1234',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Email ou senha inválidos' });
  });

  it('should not login with invalid email', async () => {
    const response = await request(app).post('/login').send({
      email: 'invalid-email',
      password: userPayload.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email inválido' });
  });

  it('should not login with empty email', async () => {
    const response = await request(app).post('/login').send({
      email: '',
      password: userPayload.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email obrigatório' });
  });

  it('should not login with empty password', async () => {
    const response = await request(app).post('/login').send({
      email: userPayload.email,
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Senha não pode ser vazia' });
  });

  it('should reject requests without token', async () => {
    const response = await request(app).get('/profile');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token ausente' });
  });

  it('should reject requests with invalid token', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token inválido' });
  });

  it('should reject access to admin route for VENDEDOR profile', async () => {
    await prisma.user.deleteMany({});

    const passwordHash = await bcrypt.hash(userPayload.password, 10);

    const seller = await prisma.user.create({
      data: {
        name: 'Seller User',
        email: 'seller@revendacarros.com',
        password: passwordHash,
        profile: 'VENDEDOR',
      },
    });

    const loginResponse = await request(app).post('/login').send({
      email: seller.email,
      password: userPayload.password,
    });

    const sellerToken = loginResponse.body.token;

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Usuário sem permissão' });
  });

  it('should reject request with expired token', async () => {
    const user = await prisma.user.findUnique({
      where: { email: userPayload.email },
    });

    expect(user).toBeTruthy();

    const expiredToken = sign(
      { userId: user!.id, profile: user!.profile },
      process.env.JWT_SECRET ?? 'development-secret',
      {
        expiresIn: '-1h',
      },
    );

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token expirado' });
  });
});
