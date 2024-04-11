import { Router } from "express";
import passport from "passport";
import { getLoginViewController, getRegisterViewController, getProfileViewController } from "../controllers/session.view.controller.js";

const router = Router()

router.get('/', getLoginViewController)

router.get('/register', getRegisterViewController)

router.get('/profile', passport.authenticate('current', { session: false }), getProfileViewController)

router.get('/forget-password', (req, res) => {
    res.render('sessions/forget_password')
})

router.get('/reset-password/:token', (req, res) => {
    res.redirect(`/api/sessions/verify-token/${req.params.token}`)
})

export default router