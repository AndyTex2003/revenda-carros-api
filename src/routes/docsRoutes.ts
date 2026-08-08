import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import openApiDocument from '../docs/openApi';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default router;
