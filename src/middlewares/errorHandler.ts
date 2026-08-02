import type { Response } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: unknown, res: Response): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
