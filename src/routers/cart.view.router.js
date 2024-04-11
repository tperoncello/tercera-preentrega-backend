import { Router } from 'express';
import {viewCartController } from "../controllers/viewCart.controller.js"
import { handlePolicies } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();

router.get('/:cid', passport.authenticate('current', { session: false }), handlePolicies(['USER', 'ADMIN', 'PREMIUM']), viewCartController)

export default router