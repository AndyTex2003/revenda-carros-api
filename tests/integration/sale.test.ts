import bcrypt from 'bcrypt';
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

const adminUser = {
  name: 'Admin Sale',
  email: 'admin.sale@revendacarros.com',
  password: 'Admin@1234',
  profile: 'ADMIN' as const,
};

const sellerUser = {
  name: 'Seller Sale',
  email: 'seller.sale@revendacarros.com',
  password: 'Seller@1234',
  profile: 'VENDEDOR' as const,
};

let adminToken: string;
let sellerToken: string;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.sale.deleteMany();
  await prisma.vehicle.deleteMany();
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
  await prisma.sale.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Sale module', () => {
  it('should create a valid sale', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Carlos',
        cpf: '12345678901',
        email: 'carlos@revendacarros.com',
        phone: '11999999999',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Prata',
        mileage: 0,
        price: 150000,
        plate: 'ABC1234',
        status: 'DISPONIVEL',
      },
    });

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 145000,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      customerId: customer.id,
      vehicleId: vehicle.id,
      salePrice: 145000,
    });
  });

  it('should not create a sale with missing required fields', async () => {
    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: '',
        vehicleId: '',
        salePrice: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should not create a sale for a nonexistent customer', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        color: 'Preto',
        mileage: 10000,
        price: 130000,
        plate: 'XYZ5678',
        status: 'DISPONIVEL',
      },
    });

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: '00000000-0000-0000-0000-000000000000',
        vehicleId: vehicle.id,
        salePrice: 125000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Cliente não encontrado',
    });
  });

  it('should not create a sale for a nonexistent vehicle', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Maria',
        cpf: '22233344455',
        email: 'maria@revendacarros.com',
        phone: '11888888888',
      },
    });

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer.id,
        vehicleId: '00000000-0000-0000-0000-000000000000',
        salePrice: 125000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Veículo não encontrado',
    });
  });

  it('should not sell a vehicle that is already sold', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Pedro',
        cpf: '33344455566',
        email: 'pedro@revendacarros.com',
        phone: '11777777777',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Ford',
        model: 'Ka',
        year: 2022,
        color: 'Azul',
        mileage: 5000,
        price: 70000,
        plate: 'QWE9876',
        status: 'VENDIDO',
      },
    });

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 65000,
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: 'Veículo não disponível para venda',
    });
  });

  it('should list sales for ADMIN and VENDEDOR', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Ana',
        cpf: '44455566677',
        email: 'ana@revendacarros.com',
        phone: '11666666666',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2024,
        color: 'Vermelho',
        mileage: 0,
        price: 140000,
        plate: 'LIST9876',
        status: 'DISPONIVEL',
      },
    });

    await prisma.sale.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 135000,
        saleDate: new Date(),
      },
    });

    const adminList = await request(app)
      .get('/sales')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminList.status).toBe(200);
    expect(adminList.body).toHaveLength(1);

    const sellerList = await request(app)
      .get('/sales')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(sellerList.status).toBe(200);
    expect(sellerList.body).toHaveLength(1);
  });

  it('should get a sale by id', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Bruno',
        cpf: '55566677788',
        email: 'bruno@revendacarros.com',
        phone: '11555555555',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Renault',
        model: 'Sandero',
        year: 2023,
        color: 'Prata',
        mileage: 1000,
        price: 95000,
        plate: 'GET1234',
        status: 'DISPONIVEL',
      },
    });

    const created = await prisma.sale.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 91000,
        saleDate: new Date(),
      },
    });

    const response = await request(app)
      .get(`/sales/${created.id}`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: created.id,
      salePrice: 91000,
    });
  });

  it('should return 404 when the sale does not exist', async () => {
    const response = await request(app)
      .get('/sales/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Venda não encontrada',
    });
  });

  it('should update only the sale price', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Cliente Atualização',
        cpf: '12312312312',
        email: 'cliente.atualizacao@revendacarros.com',
        phone: '11999998888',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Prata',
        mileage: 0,
        price: 150000,
        plate: 'UPD1A23',
        status: 'DISPONIVEL',
      },
    });

    const createResponse = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 145000,
      });

    expect(createResponse.status).toBe(201);

    const updateResponse = await request(app)
      .put(`/sales/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        salePrice: 140000,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      id: createResponse.body.id,
      customerId: customer.id,
      vehicleId: vehicle.id,
      salePrice: 140000,
    });

    const persistedVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicle.id,
      },
    });

    expect(persistedVehicle?.status).toBe('VENDIDO');
  });

  it('should return 404 when updating a nonexistent sale', async () => {
    const response = await request(app)
      .put('/sales/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        salePrice: 100000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Venda não encontrada',
    });
  });

  it('should delete a sale', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Eduardo',
        cpf: '77788899900',
        email: 'eduardo@revendacarros.com',
        phone: '11333333333',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Fiat',
        model: 'Argo',
        year: 2022,
        color: 'Branco',
        mileage: 20000,
        price: 90000,
        plate: 'DEL1234',
        status: 'DISPONIVEL',
      },
    });

    const created = await prisma.sale.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 85000,
        saleDate: new Date(),
      },
    });

    const response = await request(app)
      .delete(`/sales/${created.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(204);
  });

  it('should reject access without token', async () => {
    const response = await request(app).get('/sales');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Token ausente',
    });
  });

  it('should prevent VENDEDOR from creating sales', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Fábio',
        cpf: '88899900011',
        email: 'fabio@revendacarros.com',
        phone: '11222222222',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Peugeot',
        model: '208',
        year: 2024,
        color: 'Cinza',
        mileage: 0,
        price: 110000,
        plate: 'NOADMIN2',
        status: 'DISPONIVEL',
      },
    });

    const response = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 100000,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Usuário sem permissão',
    });
  });

  it('should allow VENDEDOR to list and fetch sales', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Helena',
        cpf: '99900011122',
        email: 'helena@revendacarros.com',
        phone: '11111111111',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Nissan',
        model: 'March',
        year: 2023,
        color: 'Branco',
        mileage: 3000,
        price: 80000,
        plate: 'SELL1234',
        status: 'DISPONIVEL',
      },
    });

    const created = await prisma.sale.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        salePrice: 76000,
        saleDate: new Date(),
      },
    });

    const listResponse = await request(app)
      .get('/sales')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const getResponse = await request(app)
      .get(`/sales/${created.id}`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject({
      id: created.id,
    });
  });
});