import { createMongoDAOs } from '../../dao/factory.js';
import ProductRepository from './product.repository.js';
import CartRepository from "./cart.repository.js";
import TicketRepository from './ticket.repository.js';
import UserRepository from './user.repository.js';

const { productDAO, cartDAO, ticketDAO, userDAO } = createMongoDAOs();
export const ProductService = new ProductRepository(productDAO);
export const CartService = new CartRepository(cartDAO); 
export const TicketService = new TicketRepository(ticketDAO);
export const UserService = new UserRepository(userDAO);
