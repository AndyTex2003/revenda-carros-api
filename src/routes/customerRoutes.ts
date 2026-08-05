import { Router } from 'express';

import {
  createCustomerController,
  deleteCustomerController,
  getCustomerByIdController,
  listCustomersController,
  updateCustomerController,
} from '../controllers/customerController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/customers', authenticate, authorize('ADMIN'), createCustomerController);
router.get('/customers', authenticate, authorize('ADMIN', 'VENDEDOR'), listCustomersController);
router.get('/customers/:id', authenticate, authorize('ADMIN', 'VENDEDOR'), getCustomerByIdController);
router.put('/customers/:id', authenticate, authorize('ADMIN'), updateCustomerController);
router.delete('/customers/:id', authenticate, authorize('ADMIN'), deleteCustomerController);

export default router;
