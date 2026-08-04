import { Router } from 'express';

import { login, profile, adminOnly } from '../controllers/authController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/login', login);
router.get('/profile', authenticate, profile);
router.get('/admin', authenticate, authorize('ADMIN'), adminOnly);

export default router;
