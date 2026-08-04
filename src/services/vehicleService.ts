import { Prisma, type Vehicle } from '@prisma/client';

import { prisma } from '../database/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { VehicleInput } from '../schemas/vehicleSchemas';

export async function createVehicle(data: VehicleInput): Promise<Vehicle> {
  try {
    return await prisma.vehicle.create({ data });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    ) {
      throw new AppError('Placa já cadastrada', 409);
    }

    throw new AppError('Falha ao criar veículo', 500);
  }
}

export async function listVehicles(): Promise<Vehicle[]> {
  return prisma.vehicle.findMany();
}

export async function findVehicleById(id: string): Promise<Vehicle> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    throw new AppError('Veículo não encontrado', 404);
  }

  return vehicle;
}

export async function updateVehicle(id: string, data: VehicleInput): Promise<Vehicle> {
  try {
    return await prisma.vehicle.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    ) {
      throw new AppError('Placa já cadastrada', 409);
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
    ) {
      throw new AppError('Veículo não encontrado', 404);
    }

    throw new AppError('Falha ao atualizar veículo', 500);
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  try {
    await prisma.vehicle.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
    ) {
      throw new AppError('Veículo não encontrado', 404);
    }

    throw new AppError('Falha ao remover veículo', 500);
  }
}
