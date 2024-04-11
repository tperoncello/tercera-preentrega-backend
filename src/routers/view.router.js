import { Router } from 'express';
import passport from "passport";
import { viewProductsController, realTimeProductsController} from '../controllers/view.router.controller.js';
import { publicRoutes, handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router();

router.get('/' , publicRoutes, handlePolicies(['USER', 'ADMIN', 'PREMIUM']),passport.authenticate('current', { session: false }), viewProductsController)

router.get('/realTimeProducts', handlePolicies(['USER', 'ADMIN', 'PREMIUM']), realTimeProductsController)


export default router