import { JWT_COOKIE_NAME } from "../utils.js";
import CustomError from '../services/errors/custom.error.js'
import { generateErrorInfo} from '../services/errors/info.js'
import EErros from "../services/errors/dictionary.js";
import logger from "../logger.js";
import { UserService } from '../services/repositories/index.js'
import UserPasswordModel from '../dao/models/user_password.model.js'
import { crateHash } from '../utils.js';

export const registerController = async(req, res) => {
    res.redirect('/')
}

export const failRegisterController = (req, res) => res.send({ error: 'Passport register Failed'})

export const loginController = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }
    const id  = req.user._id
    await UserService.updateLastConnection(id)
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
};

export const failLoginController = (req, res) => {
    if (!req.user) {
        const error = CustomError.createError({
            name: "Login  error",
            cause: generateErrorInfo(req.user),
            message: "Error trying to Login",
            code: EErros.LOGIN_ERROR
        });

        return res.status(500).send({ status: 'error', error: error.message });
    }
};


export const logoutController = async (req, res) => {
    const id  = req.user.user._id
    await UserService.updateLastConnection(id)
    res.clearCookie(JWT_COOKIE_NAME).redirect('/');
}

export const githubController = (req, res) => {}

export const githubCallBackController = async (req, res) => {
    try {
        if (req.user && req.user.token) {
            res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
        } else {
            throw new Error('Token not available after GitHub authentication.');
        }
    } catch (error) {
        console.error("Error en githubCallBackController:", error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
};

export const verifyTokenController = async (req, res) => {
    const userPassword = await UserPasswordModel.findOne({ token: req.params.token })
    if (!userPassword) {
        return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado' })
    }
    const user = userPassword.email
    res.render('sessions/reset-password', { user })
}

export const resetPasswordController = async ( req, res ) => {
    try {
        const email = req.params.user;
        console.log("resetPasswordController: ", email)
        const user = await UserService.getByEmail(email)
        await UserService.update(user._id, { password: crateHash(req.body.newPassword) })
        res.render("sessions/passwordCreated")
        await UserPasswordModel.deleteOne({ email: req.params.user })
    } catch(err) {
        res.json({ status: 'error', error: err.message })
    }
}
