export default class CartRepository {
	constructor(dao) {
		this.dao = dao;
	}

	getAllCarts = async () => {
        try {
            return await this.dao.getAllCarts();
        } catch (error) {
            logger.error('Error al obtener todos los carritos: ', error);
            throw error;
        }
    }
	createCart = async (data) => {
        try {
            return await this.dao.createCart(data);
        } catch (error) {
            logger.error('Error al crear el carrito: ', error);
            throw error;
        }
    }
	getCartById = async (id) => {
        try {
            return await this.dao.getCartById(id);
        } catch (error) {
            logger.error('Error al obtener el carrito: ', error);
            throw error;
        }
    }

	updateCart = async (data) => {
        try {
            return await this.dao.updateCart(data);
        } catch (error) {
            logger.error('Error al actualizar el carrito: ', error);
            throw error;
        }
    }
	deleteCart = async (email) => {
        try {
            return await this.dao.deleteCart(email);
        } catch (error) {
            logger.error('Error al eliminar el carrito: ', error);
            throw error;
        }
    }
	clearCart = async (cartId) => {
        try {
            return await this.dao.clearCart(cartId);
        } catch (error) {
            logger.error('Error al vaciar el carrito: ', error);
            throw error;
        }
    }
	purchaseCart = async () => {
        try {
            return await this.dao.purchaseCart();
        } catch (error) {
            logger.error('Error al al obtener el ticket: ', error);
            throw error;
        }
    }
}
