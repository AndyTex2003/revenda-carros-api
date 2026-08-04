import cors from 'cors';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';

import { errorHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(healthRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  errorHandler(err, res);
});

export default app;
