import { Router } from 'express';

import {
  createSaleController,
  deleteSaleController,
  getSaleByIdController,
  listSalesController,
  updateSaleController,
} from '../controllers/saleController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/sales', authenticate, authorize('ADMIN'), createSaleController);
router.get('/sales', authenticate, authorize('ADMIN', 'VENDEDOR'), listSalesController);
router.get('/sales/:id', authenticate, authorize('ADMIN', 'VENDEDOR'), getSaleByIdController);
router.put('/sales/:id', authenticate, authorize('ADMIN'), updateSaleController);
router.delete('/sales/:id', authenticate, authorize('ADMIN'), deleteSaleController);

export default router;
