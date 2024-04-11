import { Router } from 'express';
import { getMessagesController } from '../controllers/chat.controller.js';
import { handlePolicies } from '../middlewares/auth.middleware.js';
import passport from "passport";

const router = Router();

router.get('/', passport.authenticate('current', { session: false }), getMessagesController)

export default router