import { Router } from 'express';
import { getMockingProductsControler } from '../controllers/mocking.controller.js';

const router = Router();

router.get('/', getMockingProductsControler)

export default router