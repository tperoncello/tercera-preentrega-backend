import { TicketService } from "../services/repositories/index.js";
import logger from '../logger.js';
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from '../config/config.js';

export const getTickets = async (req, res) => {
	try {
		const tickets = await TicketService.getAll();
		res.status(200).json(tickets);
	} catch (error) {
		logger.error("Error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getTicketById = async (req, res) => {
	try {
		const ticketId = req.params.tid;

		const ticket = await TicketService.getById(ticketId);
        console.log(ticket)

		if (!ticket) {
			return res.status(404).json({ error: "Ticket not found." });
		}

		res.status(200).json({ payload: ticket });
	} catch (error) {
		logger.error("Error fetching ticket:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const addTicket = async (req, res) => {
	try {
		const ticketData = req.body;
		const addedTicket = await TicketService.create(ticketData);

		res.status(201).json({
			message: "Ticket added successfully.",
			payload: addedTicket,
		});
	} catch (error) {
		logger.error("Error adding ticket:", error.message);
		res.status(500).json({ error: error.message });
	} finally {
		if (res.statusCode == 201) {
			logger.error("Post completed successfully");
		} else {
			logger.http("Post failed");
		}
	}
};

export const updateTicket = async (req, res) => {
	try {
		const id = req.params.tid;
		const updatedTicketData = req.body;

		const updatedTicket = await TicketService.update(id, updatedTicketData, {
			new: true,
		});

		if (!updatedTicket) {
			return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
		}

		res.status(200).json({
			message: "Ticket updated successfully.",
			ticket: updatedTicket,
		});
	} catch (error) {
		logger.error("Error updating ticket:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteTicket = async (req, res) => {
	let deletedTicket;
	try {
		const id = req.params.tid;
		deletedTicket = await TicketService.delete(id);

		if (!deletedTicket) {
			return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
		}

		res.status(200).json({
			message: "Ticket deleted successfully.",
			ticketDeleted: deletedTicket,
		});
	} catch (error) {
		logger.error("Error deleting ticket:", error.message);
		res.status(500).json({ error: error.message });
	} finally {
		if (deletedTicket) {
			logger.http(`Ticket with ID ${deletedTicket._id} deleted:`);
			logger.warning(deletedTicket);
		}
	}
};

export const sendTicket = async (req, res) => {
	try {
		const purchaseCode = req.params.ticketId; // Use req.params to get the purchase code from the URL parameter

		// Use environment variables for better security
		const mailerConfig = {
			service: 'gmail',
			auth: { user: config.nodemailer.user, pass: config.nodemailer.pass },
			tls: {
				rejectUnauthorized: false
			}
		}
		let transporter = nodemailer.createTransport(mailerConfig)

		let Mailgenerator = new Mailgen({
			theme: "cerberus",
			product: {
				name: "Kame-house",
				link: "http://localhost:8080",
			},
		});
		

		// Retrieve purchase data based on the purchase code
		const ticket = await TicketService.getById(purchaseCode); // Use the appropriate service method to retrieve ticket data
		const ticketPopulate = await TicketService.getTicketPopulate(purchaseCode)


		const userEmail = ticket.purchaser;

		console.log("userEmail: ", userEmail)

		let response = {
			body: {
				intro: `Hello, this is an email confirming your purchase with code: ${purchaseCode}`,
				table: {
					data: ticketPopulate.products.map((product) => ({
						item: product.product.title,
						price: product.product.price,
						quantity: product.quantity.toString(),
						total: (product.product.price * product.quantity).toString(),
					})),
				},
				outro: "Thank you for your purchase!",
			},
		};

		let mail = Mailgenerator.generate(response);

		let message = {
			from: "Kame-House",
			to: userEmail,
			subject: `Order Kame-House - Code: ${purchaseCode}`,
			html: mail,
		};

		// Use async/await for sending emails
		await transporter.sendMail(message);

		res.status(200).json({
			message: "Correo enviado",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error al enviar el correo",
		});
	}
}