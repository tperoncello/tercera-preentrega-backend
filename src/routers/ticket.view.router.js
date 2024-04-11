import { Router } from "express";
import passport from "passport";
import { getTicketViewController } from "../controllers/ticket.view.controller.js"

const router = Router();

router.get("/:ticketId", passport.authenticate('current', { session: false }), getTicketViewController);

export default router;