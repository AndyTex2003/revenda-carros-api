import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const secret: Secret = env.jwtSecret;
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as unknown as StringValue,
  };

  const token = jwt.sign(
    { userId: user.id, profile: user.profile },
    secret,
    options,
  );

  return { token };
}

export async function findUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
}
