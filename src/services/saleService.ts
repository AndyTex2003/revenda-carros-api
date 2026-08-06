import { Prisma, type Sale } from '@prisma/client';

import { prisma } from '../database/prisma';
import { AppError } from '../middlewares/errorHandler';
import type {
  SaleInput,
  UpdateSaleInput,
} from '../schemas/saleSchemas';

async function ensureCustomerExists(customerId: string): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new AppError('Cliente não encontrado', 404);
  }
}

async function ensureVehicleAvailable(vehicleId: string): Promise<void> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new AppError('Veículo não encontrado', 404);
  }

  if (vehicle.status !== 'DISPONIVEL') {
    throw new AppError('Veículo não disponível para venda', 409);
  }
}

export async function createSale(data: SaleInput): Promise<Sale> {
  await ensureCustomerExists(data.customerId);
  await ensureVehicleAvailable(data.vehicleId);

  try {
    return await prisma.$transaction(async (transaction) => {
      const sale = await transaction.sale.create({
        data: {
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          salePrice: data.salePrice,
          saleDate: new Date(),
        },
      });

      await transaction.vehicle.update({
        where: { id: data.vehicleId },
        data: {
          status: 'VENDIDO',
        },
      });

      return sale;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError('Veículo já vendido', 409);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Veículo não encontrado', 404);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Falha ao criar venda', 500);
  }
}

export async function listSales(): Promise<Sale[]> {
  return prisma.sale.findMany();
}

export async function findSaleById(id: string): Promise<Sale> {
  const sale = await prisma.sale.findUnique({
    where: { id },
  });

  if (!sale) {
    throw new AppError('Venda não encontrada', 404);
  }

  return sale;
}

export async function updateSale(
  id: string,
  data: UpdateSaleInput,
): Promise<Sale> {
  try {
    return await prisma.sale.update({
      where: { id },
      data: {
        salePrice: data.salePrice,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Venda não encontrada', 404);
    }

    throw new AppError('Falha ao atualizar venda', 500);
  }
}

export async function deleteSale(id: string): Promise<void> {
  try {
    await prisma.sale.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError('Venda não encontrada', 404);
    }

    throw new AppError('Falha ao remover venda', 500);
  }
}