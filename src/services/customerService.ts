import { Prisma, type Customer } from '@prisma/client';

import { prisma } from '../database/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { CustomerInput } from '../schemas/customerSchemas';

function handleUniqueConstraintError(error: Prisma.PrismaClientKnownRequestError): AppError {
  const target = Array.isArray(error.meta?.target)
    ? error.meta.target.join(',')
    : String(error.meta?.target ?? '');

  if (target.includes('cpf')) {
    return new AppError('CPF já cadastrado', 409);
  }

  if (target.includes('email')) {
    return new AppError('Email já cadastrado', 409);
  }

  return new AppError('Dados duplicados', 409);
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  try {
    return await prisma.customer.create({ data });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    ) {
      throw handleUniqueConstraintError(error as Prisma.PrismaClientKnownRequestError);
    }

    throw new AppError('Falha ao criar cliente', 500);
  }
}

export async function listCustomers(): Promise<Customer[]> {
  return prisma.customer.findMany();
}

export async function findCustomerById(id: string): Promise<Customer> {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw new AppError('Cliente não encontrado', 404);
  }

  return customer;
}

export async function updateCustomer(id: string, data: CustomerInput): Promise<Customer> {
  try {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    ) {
      throw handleUniqueConstraintError(error as Prisma.PrismaClientKnownRequestError);
    }

    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
    ) {
      throw new AppError('Cliente não encontrado', 404);
    }

    throw new AppError('Falha ao atualizar cliente', 500);
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await prisma.customer.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
    ) {
      throw new AppError('Cliente não encontrado', 404);
    }

    throw new AppError('Falha ao remover cliente', 500);
  }
}
