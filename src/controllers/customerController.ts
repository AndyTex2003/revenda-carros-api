import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';

import {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  listCustomers,
  updateCustomer,
} from '../services/customerService';
import { customerSchema } from '../schemas/customerSchemas';
import { AppError } from '../middlewares/errorHandler';

export async function createCustomerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerData = customerSchema.parse(req.body);
    const customer = await createCustomer(customerData);

    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Dados inválidos';
      next(new AppError(message, 400));
      return;
    }

    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao criar cliente', 500));
  }
}

export async function listCustomersController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customers = await listCustomers();
    res.status(200).json(customers);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao listar clientes', 500));
  }
}

export async function getCustomerByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const customer = await findCustomerById(id);

    res.status(200).json(customer);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao buscar cliente', 500));
  }
}

export async function updateCustomerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const customerData = customerSchema.parse(req.body);
    const customer = await updateCustomer(id, customerData);

    res.status(200).json(customer);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Dados inválidos';
      next(new AppError(message, 400));
      return;
    }

    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao atualizar cliente', 500));
  }
}

export async function deleteCustomerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    await deleteCustomer(id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao remover cliente', 500));
  }
}
