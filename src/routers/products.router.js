import { Router } from 'express';
import { getProductPaginatedController, getProductController, getProductByIdController, addProductController, updateProductController, deleteProductController} from '../controllers/products.controller.js';
import { handlePolicies, publicRoutes } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();


router.get('/', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getProductPaginatedController);

router.get('/noPaginate', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getProductController);

router.get('/:pid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getProductByIdController);

router.post('/', passport.authenticate('current', { session: false }), handlePolicies(['ADMIN', 'PREMIUM']), addProductController);



router.put('/:pid', passport.authenticate('current', { session: false }), handlePolicies(['ADMIN', 'PREMIUM']), updateProductController);

router.delete('/:pid', passport.authenticate('current', { session: false }), handlePolicies(['ADMIN', 'PREMIUM']), deleteProductController);

export default router