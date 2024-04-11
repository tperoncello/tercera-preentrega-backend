import { Router } from "express";
import {
	getTickets,
	getTicketById,
	addTicket,
	updateTicket,
	deleteTicket,
	sendTicket
} from "../controllers/ticket.controller.js";


const router = Router();

router.get("/", getTickets);

router.get("/:tid", getTicketById);

router.post("/", addTicket);

router.put("/:tid", updateTicket);

router.delete("/:tid", deleteTicket);

router.post('/send-ticket-email/:ticketId', sendTicket);

export default router;