import cartModel from "../dao/models/ticket.model.js"
import ticketModel from "../dao/models/ticket.model.js"
import { ProductService } from '../services/repositories/index.js'
import { CartService } from '../services/repositories/index.js'
import shortid from "shortid"
import mongoose from "mongoose";
import logger from "../logger.js";

export const getProductFromCart = async (req, res) =>{
    try{
        const id = req.params.cid
        const result = await CartService.getCartById(id)
        if(result === null){
            return{
                statusCode: 404,
                response:{ status: 'error', error: "Carrito no encontrado"}
            }
        }
        console.log("getproducts: ", result)
        return{
            statusCode: 200,
            response:{ status: 'success', payload: result}
        }
    }catch(err){
        logger.error("getProductFromCart: ", err.message)
    }
}

export const createCartController = async( req, res) =>{
    try{
        const cart = await CartService.createCart()
        res.status(200).json({ status: 'success', payload: cart })
    }catch(err){
        logger.error("createCart: ", err.message)
        res.status(500).json({status: 'error', error: err.message});
    }
}

export const getCartByIdController = async (req, res) => {
    const cartId = await getProductFromCart(req, res);
    if(!cartId){
        logger.error("getCartById: ", err.message)
        res.status(404).json({status: 'error', error: 'No Se Encontro El Producto'});
    }else{
        res.status(200).json({status: 'success', payload: cartId});
    }
}

export const addProductToCartController =async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await CartService.getCartById(cartId)
        console.log("cart: ", cart)
        if (!cart) {
            logger.error("addProductToCart: ", `El Carrito con el ID ${cartId} NO SE ENCONTRÓ`)
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await ProductService.getProductById(productId)
        console.log("product: ", product)

        if (!product) {
            logger.error("addProductToCart: ", `El Producto con el ID ${productId} NO SE ENCONTRÓ`)
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const existingProduct = cart.products.find(item => item.product.equals(productId));

        if (existingProduct) {
            existingProduct.quantity = existingProduct.quantity + 1; // O existingProduct.quantity++
        } else {
            cart.products.push({
                product: productId,
                quantity: 1, 
            });
        }




        try {
            console.log("Tipo de cart antes de guardar:", typeof cart);
            await cart.save();
            console.log("Carrito guardado:", cart);

        } catch (saveError) {
            console.error("Error al guardar el carrito:", saveError);
            return res.status(500).json({ status: 'error', error: 'Error al guardar el carrito' });
        }
        return res.status(200).json({ status: 'success', message: 'Producto agregado al carrito', cart });
    } catch (err) {
        logger.error("addProductToCart: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
}

export const deleteProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await CartService.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await ProductService.getProductById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const productindex = cart.products.findIndex(item => item.product == productId)
        if(productindex === -1){
            logger.error(`El producto con ID: ${productId} no se encontro el el carrito con ID: ${cartId}`)
            return res.status(400).json({ status: 'error', error: `El producto con ID: ${productId} no se encontro el el carrito con ID: ${cartId}`})
        }else{
            cart.products = cart.products.filter(item => item.product.toString() !== productId)
        }

        const result = await cartModel.findByIdAndUpdate(cartId, cart, { returnDocument: 'after'})
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        logger.error("deleteProductToCart: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
}

export const addProductsToCartController = async (req, res) => {
    try{
        const id = req.params.cid;
        const cart = await CartService.getCartById(id);
        if(cart === null){
            return res.status(404).json({status: 'error', error: `El Carrito con el ID ${id} NO SE ENCONTRÓ` })
        }
    
        const products = req.body.products
        if(!products){
            return res.status(400).json({status: 'error', error: `El producto no es opcional` })
        }
    
        for( let i = 0; i < products.length; i++){
            if( !products[i].hasOwnProperty('product') || !products[i].hasOwnProperty('quantity')){
                logger.error(`El producto debe tener un ID o una QUANTITY valida`)
                return res.status(400).json({status: 'error', error: `El producto debe tener un ID o una QUANTITY valida` })
            }
            if( typeof products[i].quantity !== 'number'){
                return res.status(400).json({status: 'error', error: `El Quantity debe ser un numero` })
            }
            if( products[i].quantity === 0){
                logger.error(`Debe agregar una Quantity mayor a cero`)
                return res.status(400).json({status: 'error', error: `Debe agregar una Quantity mayor a cero` })
            }
            const productToAdd = await getProductByIdService(products[i].product)
            if( productToAdd === null){
                logger.error(`El Producto con el ID ${id} NO SE ENCONTRÓ`)
                return res.status(400).json({status: 'error', error: `El producto con el ID: ${id} no existe` })
            }
        }
    
        cart.products = products
        const result = await cartModel.findByIdAndUpdate(id, cart, { returnDocument: 'after'})
        res.status(200).json({ status: 'success', payload: result})
    }catch(err){
        logger.error("addProductsToCart: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: err.message });
    }
}

export const updateProductToCartController = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await CartService.getCartById(cartId);
        if (!cart) {
            logger.error(`El Carrito con el ID ${id} NO SE ENCONTRÓ`)
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await ProductService.getProductById(productId);
        if (!product) {
            logger.error(`El Producto con el ID ${productId} NO SE ENCONTRÓ`)
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const quantity = req.body.quantity
        if( typeof quantity !== 'number'){
            return res.status(400).json({status: 'error', error: `El Quantity debe ser un numero` })
        }
        if( quantity === 0){
            return res.status(400).json({status: 'error', error: `Debe agregar una Quantity mayor a cero` })
        }

        const update = {
            $set: { 'products.$[elem].quantity': quantity },
        };
        const options = {
            arrayFilters: [{ 'elem.product': productId }],
            new: true, 
        };

        const result = await cartModel.findByIdAndUpdate(cartId, update, options);
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        logger.error("updateProductToCart: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: err.message });
    }
}

export const deleteProductsFromCartController = async (req, res) => {
    try {
        const id = req.params.cid
        const cart = await CartService.getCartById(id);
        if (!cart) {
            logger.error(`El Carrito con el ID ${id} NO SE ENCONTRÓ`)
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${id} NO SE ENCONTRÓ` });
        }

        cart.products = []

        const result = await cartModel.findByIdAndUpdate(id, cart, { returnDocument: 'after'});
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        logger.error("deleteProductsFromCart: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: err.message });
    }
}

export const purchaseController = async (req, res) => {
    try{
            const cid = req.params.cid
            const shoppingCart = await CartService.getCartById(cid);
            if (!shoppingCart) {
                return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${id} NO SE ENCONTRÓ` });
            }
            const userEmail = req.user.user.email;

            if (!userEmail) {
                return res.status(401).json({ status: 'error', error: 'You are not logged in' });
            }

            let productsToTicket =  []
            let productsAfterPurchase = shoppingCart.products
            let amount = 0

            for (let index = 0; index < shoppingCart.products.length; index++){

                const productToPurchase = await ProductService.getProductById(shoppingCart.products[index].product)

                if (productToPurchase === null) {
                    return res.status(400).json({ status: 'error', error: `El Producto con id: ${shoppingCart.products[index].product} no existe` })
                }

                if (shoppingCart.products[index].quantity <= productToPurchase.stock) {
                    //actualizamos el stock del producto que se está comprando
                    productToPurchase.stock -= shoppingCart.products[index].quantity
                    await ProductService.updateProduct(productToPurchase._id, { stock: productToPurchase.stock })
                    //eliminamos (del carrito) los productos que se han comparado (en memoria)
                    productsAfterPurchase = productsAfterPurchase.filter(item => item.product.toString() !== shoppingCart.products[index].product.toString())
                    //calculamos el amount (total del ticket)
                    amount += (productToPurchase.price * shoppingCart.products[index].quantity)
                    //colocamos el producto en el Ticket (en memoria)
                    productsToTicket.push({ product: productToPurchase._id, price: productToPurchase.price, quantity: shoppingCart.products[index].quantity})
                }
            }
            logger.info("Productos después de la compra:", productsAfterPurchase);
            logger.info('ID del carrito:', cid);
            const validId = mongoose.Types.ObjectId.isValid(cid);
            if (!validId) {
                return res.status(400).json({ status: 'error', error: 'ID de carrito no válido' });
            }
            logger.info("ID del carrito a buscar:", cid);

            const carrito = await getCartByIdServices(cid)
            logger.info("Resultado de la búsqueda del carrito:", carrito);

            if (!carrito) {
                return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cid} NO SE ENCONTRÓ` });
            }

            try {
                logger.info("Productos antes de la actualización:", carrito.products);
                carrito.products = productsAfterPurchase;
                const updatedCart = await carrito.save();
                logger.info("Productos después de la actualización:", updatedCart.products);
            } catch (error) {
                logger.error("Error al actualizar el carrito:", error);
                return res.status(500).json({ status: 'error', error: 'Error al actualizar el carrito' });
            }

            const result = await ticketModel.create({
                code: shortid.generate(),
                products: productsToTicket,
                amount,
                purchaser: userEmail
            })
        return res.status(200).json({ status: 'success', payload: result })
    }catch(err){
        logger.error("purchase: Error interno del servidor", err.message);
        return res.status(500).json({ status: 'error', error: err.message })
    }
}
