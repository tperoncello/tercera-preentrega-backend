import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { CartService, TicketService } from '../services/repositories/index.js';
import { generateRandomString } from "../utils.js";

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createSession = async (req, res) => {
    try {
        const userCart = req.user.user.cart;
        const cart = await CartService.getCartById(userCart);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Transformar la información del carrito al formato adecuado para Stripe
        const lineItems = cart.products.map(product => {
            return {
                price_data: {
                    product_data: {
                        name: product.product.title, // Aquí deberías ajustar según la estructura de tu modelo de producto
                        description: product.product.description
                    },
                    currency: 'usd',
                    unit_amount: product.product.price * 100, // Convertir el precio a centavos
                },
                quantity: product.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/pay/success',
            cancel_url: 'http://localhost:8080/pay/cancel'
        });

        return res.json(session);
    } catch (error) {
        console.error("Error al crear la sesión de Stripe:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const successController = async ( req, res ) => {
    try {
        const userEmail = req.user.user.email
        const cartId = req.user.user.cart
        console.log("successController cartId: ", cartId)
        const cart = await CartService.getCartById(cartId)
        console.log("cart: ", cart)
        const ticketData = {
            code: generateRandomString(5),
            products: cart.products.map(product => ({
                product: product.product,
                quantity: product.quantity,
                price: product.product.price,
                subtotal: product.product.price * product.quantity // Subtotal por cada producto
            })),
            amount: cart.products.reduce((total, product) => total + (product.product.price * product.quantity), 0),
            purchaser: userEmail
        };

        const ticket = await TicketService.create(ticketData);
        console.log(ticket)
        const simplifiedCart = {
            code: ticketData.code,
            purchaser: ticketData.purchaser,
            products: cart.products.map(product => ({
                ...product.product.toObject(),
                quantity: product.quantity,
                subtotal: product.product.price * product.quantity
            })),
            amount: ticketData.amount
        };
        
        console.log("simplifiedCart: ", simplifiedCart)
        const cartClear = await CartService.clearCart(cartId)
        res.render('ticket', { ticket ,cart: simplifiedCart, cartId: cartId })
    }  catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
} 
