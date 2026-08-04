import { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';

type Profile = 'ADMIN' | 'VENDEDOR';

export function authorize(...allowedProfiles: Profile[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!allowedProfiles.includes(req.user.profile)) {
      throw new AppError('Usuário sem permissão', 403);
    }

    next();
  };
}
