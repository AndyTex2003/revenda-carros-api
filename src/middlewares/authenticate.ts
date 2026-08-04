import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { env } from '../config/env';

type Profile = 'ADMIN' | 'VENDEDOR';

interface JwtPayload {
  userId: string;
  profile: Profile;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new AppError('Token ausente', 401);
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Token inválido', 401);
  }

  try {
    const payload = verify(token, env.jwtSecret) as JwtPayload;

    req.user = {
      id: payload.userId,
      profile: payload.profile,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expirado', 401);
    }

    throw new AppError('Token inválido', 401);
  }
}
