import bcrypt from 'bcrypt';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../../src/app';
import { prisma } from '../../src/database/prisma';

const adminUser = {
  name: 'Admin Vehicle',
  email: 'admin.vehicle@revendacarros.com',
  password: 'Admin@1234',
  profile: 'ADMIN' as const,
};

const sellerUser = {
  name: 'Seller Vehicle',
  email: 'seller.vehicle@revendacarros.com',
  password: 'Seller@1234',
  profile: 'VENDEDOR' as const,
};

let adminToken: string;
let sellerToken: string;
let vehicleId: string;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.vehicle.deleteMany();
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
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Vehicle module', () => {
  it('should create a valid vehicle', async () => {
    const response = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Prata',
        mileage: 0,
        price: 150000,
        plate: 'ABC1234',
        status: 'DISPONIVEL',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2024,
      color: 'Prata',
      mileage: 0,
      price: 150000,
      plate: 'ABC1234',
      status: 'DISPONIVEL',
    });

    vehicleId = response.body.id;
  });

  it('should not create a vehicle with missing required fields', async () => {
    const response = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: '',
        model: '',
        year: 0,
        color: '',
        mileage: -1,
        price: -1000,
        plate: '',
        status: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should not create a vehicle with duplicated plate', async () => {
    await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        color: 'Preto',
        mileage: 10000,
        price: 130000,
        plate: 'DUP1234',
        status: 'DISPONIVEL',
      });

    const response = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Fiat',
        model: 'Argo',
        year: 2022,
        color: 'Branco',
        mileage: 20000,
        price: 90000,
        plate: 'DUP1234',
        status: 'DISPONIVEL',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Placa já cadastrada' });
  });

  it('should list vehicles for ADMIN and VENDEDOR', async () => {
    await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Ford',
        model: 'Ka',
        year: 2022,
        color: 'Azul',
        mileage: 5000,
        price: 70000,
        plate: 'LIST123',
        status: 'DISPONIVEL',
      });

    const adminList = await request(app)
      .get('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminList.status).toBe(200);
    expect(adminList.body).toHaveLength(1);

    const sellerList = await request(app)
      .get('/vehicles')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(sellerList.status).toBe(200);
    expect(sellerList.body).toHaveLength(1);
  });

  it('should get vehicle by id and return 404 if not found', async () => {
    const createResponse = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2024,
        color: 'Vermelho',
        mileage: 0,
        price: 140000,
        plate: 'ID12345',
        status: 'DISPONIVEL',
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .get(`/vehicles/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id, plate: 'ID12345' });

    const notFoundResponse = await request(app)
      .get('/vehicles/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(notFoundResponse.status).toBe(404);
    expect(notFoundResponse.body).toEqual({ message: 'Veículo não encontrado' });
  });

  it('should update a vehicle', async () => {
    const createResponse = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2021,
        color: 'Cinza',
        mileage: 15000,
        price: 120000,
        plate: 'UPD1234',
        status: 'DISPONIVEL',
      });

    const updateResponse = await request(app)
      .put(`/vehicles/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Volkswagen',
        model: 'Golf GTI',
        year: 2021,
        color: 'Cinza',
        mileage: 15000,
        price: 125000,
        plate: 'UPD1234',
        status: 'VENDIDO',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({ model: 'Golf GTI', status: 'VENDIDO' });
  });

  it('should delete a vehicle', async () => {
    const createResponse = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Renault',
        model: 'Sandero',
        year: 2023,
        color: 'Prata',
        mileage: 1000,
        price: 95000,
        plate: 'DEL1234',
        status: 'DISPONIVEL',
      });

    const deleteResponse = await request(app)
      .delete(`/vehicles/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(204);
  });

  it('should reject access without token', async () => {
    const response = await request(app).get('/vehicles');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token ausente' });
  });

  it('should reject access to protected routes for VENDEDOR when required ADMIN', async () => {
    const response = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        brand: 'Jeep',
        model: 'Renegade',
        year: 2024,
        color: 'Preto',
        mileage: 0,
        price: 160000,
        plate: 'NOADMIN1',
        status: 'DISPONIVEL',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Usuário sem permissão' });
  });
});
