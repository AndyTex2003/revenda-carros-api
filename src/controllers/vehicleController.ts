import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';

import {
  createVehicle,
  deleteVehicle,
  findVehicleById,
  listVehicles,
  updateVehicle,
} from '../services/vehicleService';
import { vehicleSchema } from '../schemas/vehicleSchemas';
import { AppError } from '../middlewares/errorHandler';

export async function createVehicleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vehicleData = vehicleSchema.parse(req.body);
    const vehicle = await createVehicle(vehicleData);

    res.status(201).json(vehicle);
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

    next(new AppError('Falha ao criar veículo', 500));
  }
}

export async function listVehiclesController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vehicles = await listVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao listar veículos', 500));
  }
}

export async function getVehicleByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const vehicle = await findVehicleById(id);

    res.status(200).json(vehicle);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao buscar veículo', 500));
  }
}

export async function updateVehicleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const vehicleData = vehicleSchema.parse(req.body);
    const vehicle = await updateVehicle(id, vehicleData);

    res.status(200).json(vehicle);
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

    next(new AppError('Falha ao atualizar veículo', 500));
  }
}

export async function deleteVehicleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    await deleteVehicle(id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao remover veículo', 500));
  }
}
