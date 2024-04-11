import { Router } from "express";
import { 
    updateUserView,
    deleteUser } 
from "../controllers/users.view.controller.js";
import passport from "passport";


const router = Router();

router.get("/", passport.authenticate('current', { session: false }), (req, res ) => {
    const cart = req.user.user.cart
    return res.render("userControls", {cart: cart})
});

router.post("/", updateUserView)

router.post("/delete", deleteUser)

export default router;