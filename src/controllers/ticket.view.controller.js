import { TicketService } from "../services/repositories/index.js"
import logger from '../logger.js';

export const getTicketViewController = async ( req, res ) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = await TicketService.getById(ticketId);
    
        if (!ticket) {
            return res.render("error", { error: "Ticket not found" });
        }
        res.render("ticket", { ticket });
    } catch (error) {
        logger.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};