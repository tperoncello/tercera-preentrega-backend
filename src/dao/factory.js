import config from '../config/config.js';
import ProductMongoDAO from './product.mongo.dao.js';
import CartMongoDAO from './cart.mongo.dao.js';
import TicketMongoDao from './ticket.mongo.dao.js'
import UserMongoDAO from './user.mongo.dao.js';

const persistenceType = config.app.persistence;

export const createMongoDAOs = () => {
    if (persistenceType === 'MONGO') {
        return {
            productDAO: new ProductMongoDAO(),
            cartDAO: new CartMongoDAO(),
            ticketDAO: new TicketMongoDao(),
            userDAO: new UserMongoDAO()
        };
    }
    throw new Error('Tipo de persistencia no válido');
};