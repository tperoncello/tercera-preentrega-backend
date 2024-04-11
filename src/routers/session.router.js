import { Router } from "express";
import passport from "passport";
import { registerController, failRegisterController, loginController, failLoginController, logoutController, githubController, githubCallBackController, verifyTokenController, resetPasswordController } from "../controllers/session.controller.js";
import { forgetPasswordController } from "../controllers/user.controller.js";


const router = Router()


router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failRegister'}), registerController)

router.get('/failRegister', failRegisterController)

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), loginController)

router.get('/failLogin', failLoginController)

router.get('/logout', passport.authenticate('current', { session: false }), logoutController);

router.get('/github', passport.authenticate('github', { scope: ['user: email']}), githubController)

router.get('/githubcallback', passport.authenticate('github' , { failureRedirect: '/login'}), githubCallBackController)

router.post('/forget-password', forgetPasswordController)

router.get('/verify-token/:token', verifyTokenController)

router.post('/reset-password/:user', resetPasswordController)

export default router