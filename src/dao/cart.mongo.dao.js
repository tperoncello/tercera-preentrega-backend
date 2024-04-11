import cartModel from "./models/cart.model.js";

export default class CartMongoDao {
	getAllCarts = async () => await cartModel.find().lean().exec();
	createCart = async (data) => {
		return await cartModel.create(data);
	};
	getCartById = async (id) => {
		const result = await cartModel
			.findById(id)
			.populate("products.product")
		return result;
	};

	updateCart = async (data) => {
		console.log("from update", data);
		return await cartModel.findByIdAndUpdate(data._id, data, { new: true });
	};

	clearCart = async (cartId) => {
		try {
			console.log("cartId in clearCart: ", cartId);
			const existingCart = await cartModel.findById(cartId);

			if (!existingCart) {
				console.error('Carrito no encontrado.');
				return;
			}
	
			const updatedCart = await cartModel.findByIdAndUpdate(
				cartId,
				{ $set: { products: [] } },
				{ new: true }
			);

			console.log('Resultado de findByIdAndUpdate:', updatedCart);
	
			if (updatedCart) {
				console.log('Carrito limpiado correctamente.');
			} else {
				console.error('Error al limpiar el carrito.');
			}
		} catch (error) {
			console.error('Error al limpiar el carrito:', error);
			throw error;
		}
	};	

	purchaseCart = async () => await this.dao.purchaseCart();
	deleteCart = async (email) => {
		return await cartModel.findOneAndDelete({ userEmail: email });
	};
}