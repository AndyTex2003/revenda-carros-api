import bcrypt from 'bcrypt';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../../src/app';
import { prisma } from '../../src/database/prisma';

const adminUser = {
  name: 'Admin Customer',
  email: 'admin.customer@revendacarros.com',
  password: 'Admin@1234',
  profile: 'ADMIN' as const,
};

const sellerUser = {
  name: 'Seller Customer',
  email: 'seller.customer@revendacarros.com',
  password: 'Seller@1234',
  profile: 'VENDEDOR' as const,
};

let adminToken: string;
let sellerToken: string;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash(adminUser.password, 10);
  const sellerHash = await bcrypt.hash(sellerUser.password, 10);

  await prisma.user.createMany({
    data: [
      { ...adminUser, password: adminHash },
      { ...sellerUser, password: sellerHash },
    ],
  });

  const adminResponse = await request(app).post('/login').send({
    email: adminUser.email,
    password: adminUser.password,
  });

  adminToken = adminResponse.body.token;

  const sellerResponse = await request(app).post('/login').send({
    email: sellerUser.email,
    password: sellerUser.password,
  });

  sellerToken = sellerResponse.body.token;
});

afterEach(async () => {
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Customer module', () => {
  it('should create a valid customer', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'João da Silva',
        cpf: '12345678909',
        email: 'joao@revendacarros.com',
        phone: '11999999999',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'João da Silva',
      cpf: '12345678909',
      email: 'joao@revendacarros.com',
      phone: '11999999999',
    });
  });

  it('should not create a customer with missing required fields', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '',
        cpf: '',
        email: '',
        phone: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should not create a customer with duplicated cpf', async () => {
    await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Maria',
        cpf: '11144477735',
        email: 'maria@revendacarros.com',
        phone: '11888888888',
      });

    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Pedro',
        cpf: '11144477735',
        email: 'pedro@revendacarros.com',
        phone: '11777777777',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'CPF já cadastrado' });
  });

  it('should not create a customer with invalid cpf', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Ana',
        cpf: '1234567890',
        email: 'ana@revendacarros.com',
        phone: '11666666666',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'CPF inválido' });
  });

  it('should not create a customer with duplicated email', async () => {
    await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Carlos',
        cpf: '98765432100',
        email: 'carlos@revendacarros.com',
        phone: '11555555555',
      });

    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Clara',
        cpf: '11122233344',
        email: 'carlos@revendacarros.com',
        phone: '11444444444',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Email já cadastrado' });
  });

  it('should not create a customer with invalid email', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Beatriz',
        cpf: '55566677788',
        email: 'email-invalido',
        phone: '11333333333',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email inválido' });
  });

  it('should list customers for ADMIN and VENDEDOR', async () => {
    await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Lucas',
        cpf: '22233344455',
        email: 'lucas@revendacarros.com',
        phone: '11222222222',
      });

    const adminList = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminList.status).toBe(200);
    expect(adminList.body).toHaveLength(1);

    const sellerList = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(sellerList.status).toBe(200);
    expect(sellerList.body).toHaveLength(1);
  });

  it('should get customer by id and return 404 if not found', async () => {
    const createResponse = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rafael',
        cpf: '33344455566',
        email: 'rafael@revendacarros.com',
        phone: '11111111111',
      });

    const response = await request(app)
      .get(`/customers/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: createResponse.body.id, cpf: '33344455566' });

    const notFoundResponse = await request(app)
      .get('/customers/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(notFoundResponse.status).toBe(404);
    expect(notFoundResponse.body).toEqual({ message: 'Cliente não encontrado' });
  });

  it('should update a customer', async () => {
    const createResponse = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Fernanda',
        cpf: '44455566677',
        email: 'fernanda@revendacarros.com',
        phone: '11000000000',
      });

    const updateResponse = await request(app)
      .put(`/customers/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Fernanda Souza',
        cpf: '44455566677',
        email: 'fernanda.souza@revendacarros.com',
        phone: '11987654321',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      name: 'Fernanda Souza',
      email: 'fernanda.souza@revendacarros.com',
      phone: '11987654321',
    });
  });

  it('should delete a customer', async () => {
    const createResponse = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gabriel',
        cpf: '66677788899',
        email: 'gabriel@revendacarros.com',
        phone: '11876543210',
      });

    const deleteResponse = await request(app)
      .delete(`/customers/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(204);
  });

  it('should reject access without token', async () => {
    const response = await request(app).get('/customers');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token ausente' });
  });

  it('should reject access to protected routes for VENDEDOR when required ADMIN', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'Vendedor',
        cpf: '77788899900',
        email: 'vendedor@revendacarros.com',
        phone: '11765432100',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Usuário sem permissão' });
  });
});
