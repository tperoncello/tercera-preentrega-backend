import { Router } from 'express';
import { createSession, successController } from '../controllers/payments.controller.js'
import passport from 'passport';

const router = Router();

router.post('/create-checkout-session', passport.authenticate('current', { session: false }), createSession);
router.get('/success', passport.authenticate('current', { session: false }), successController);
router.get('/cancel', (req, res) => res.send('cancel'));

export default router