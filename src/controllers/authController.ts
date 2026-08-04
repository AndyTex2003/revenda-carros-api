import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { authenticateUser, findUserProfile } from '../services/authService';
import { loginSchema } from '../schemas/authSchemas';
import { AppError } from '../middlewares/errorHandler';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authenticateUser(email, password);

    res.status(200).json(result);
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

    next(new AppError('Falha ao processar login', 500));
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const user = await findUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError('Falha ao carregar perfil', 500));
  }
}

export async function adminOnly(_req: Request, res: Response) {
  res.status(200).json({ message: 'Acesso autorizado para ADMIN' });
}
