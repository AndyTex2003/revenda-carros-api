import { Router } from 'express';

import {
  createVehicleController,
  deleteVehicleController,
  getVehicleByIdController,
  listVehiclesController,
  updateVehicleController,
} from '../controllers/vehicleController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post(
  '/vehicles',
  authenticate,
  authorize('ADMIN'),
  createVehicleController,
);
router.get('/vehicles', authenticate, authorize('ADMIN', 'VENDEDOR'), listVehiclesController);
router.get('/vehicles/:id', authenticate, authorize('ADMIN', 'VENDEDOR'), getVehicleByIdController);
router.put('/vehicles/:id', authenticate, authorize('ADMIN'), updateVehicleController);
router.delete('/vehicles/:id', authenticate, authorize('ADMIN'), deleteVehicleController);

export default router;
