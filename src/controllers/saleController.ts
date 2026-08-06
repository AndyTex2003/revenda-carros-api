import {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { ZodError } from 'zod';

import {
  createSale,
  deleteSale,
  findSaleById,
  listSales,
  updateSale,
} from '../services/saleService';
import {
  saleSchema,
  updateSaleSchema,
} from '../schemas/saleSchemas';
import { AppError } from '../middlewares/errorHandler';

function handleControllerError(
  error: unknown,
  next: NextFunction,
  fallbackMessage: string,
): void {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Dados inválidos';
    next(new AppError(message, 400));
    return;
  }

  if (error instanceof AppError) {
    next(error);
    return;
  }

  next(new AppError(fallbackMessage, 500));
}

export async function createSaleController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const saleData = saleSchema.parse(req.body);
    const sale = await createSale(saleData);

    res.status(201).json(sale);
  } catch (error) {
    handleControllerError(error, next, 'Falha ao criar venda');
  }
}

export async function listSalesController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sales = await listSales();

    res.status(200).json(sales);
  } catch (error) {
    handleControllerError(error, next, 'Falha ao listar vendas');
  }
}

export async function getSaleByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const sale = await findSaleById(id);

    res.status(200).json(sale);
  } catch (error) {
    handleControllerError(error, next, 'Falha ao buscar venda');
  }
}

export async function updateSaleController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const saleData = updateSaleSchema.parse(req.body);
    const sale = await updateSale(id, saleData);

    res.status(200).json(sale);
  } catch (error) {
    handleControllerError(error, next, 'Falha ao atualizar venda');
  }
}

export async function deleteSaleController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    await deleteSale(id);

    res.status(204).send();
  } catch (error) {
    handleControllerError(error, next, 'Falha ao remover venda');
  }
}