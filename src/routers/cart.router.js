import { Router } from 'express';
import { createCartController, getCartByIdController, addProductToCartController, deleteProductToCart, addProductsToCartController, updateProductToCartController, deleteProductsFromCartController, purchaseController} from '../controllers/carts.controller.js';
import { handlePolicies, publicRoutes } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();

router.post('/', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN']), createCartController);

router.get('/:cid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN']), getCartByIdController);

router.post('/:cid/product/:pid', passport.authenticate('current', { session: false }), addProductToCartController);

router.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN']), deleteProductToCart);

router.put('/:cid', passport.authenticate('current', { session: false }), handlePolicies(['USER']), addProductsToCartController);

router.put('/:cid/product/:pid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN']), updateProductToCartController);

router.delete('/:cid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN']), deleteProductsFromCartController);


router.get('/:cid/purchase', passport.authenticate('current', { session: false }), passport.authenticate('jwt', { session: false }), purchaseController);



export default router