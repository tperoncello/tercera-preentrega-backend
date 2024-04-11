import { getProductFromCart } from '../controllers/carts.controller.js';
import logger from '../logger.js';

export const viewCartController = async (req, res) => {
    console.log("se consulto cart");
    const result = await getProductFromCart(req, res);
    console.log(result);
    if (result && result.response.status === 'success') {
        const { payload: { products } } = result.response;

        const simplifiedProducts = products.map(p => ({ ...p.product.toObject(), quantity: p.quantity }));

        // Calcular el total del monto
        const totalAmount = simplifiedProducts.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);

        console.log("Total Amount:", totalAmount);

        res.render('productsFromCart', { cart: simplifiedProducts, totalAmount });
    } else {
        logger.error("viewCart: ", result.response.error);
        res.status(result.statusCode).json({ status: 'error', error: result.response.error });
    }
}