import { ProductService } from '../services/repositories/index.js'
import logger from "../logger.js";
import nodemailer from 'nodemailer';
import Mailgen from "mailgen";
import config from '../config/config.js';

export const getProductPaginatedController = async (req, res) => {
    const result = await ProductService.getAllPaginatedProducts( req );
    console.log("getProductPaginatedController: ", result)
    res.status(result.statuscode).json(result.response)
}

export const getProductController = async (req, res) => {
    const result = await ProductService.getAllProducts( req );
    res.json(result)
}

export const getProductByIdController = async (req, res) => {

    try{
        const id = req.params.pid;
        const productId = await ProductService.getProductById(id)
        if(!productId){
            logger.error("getProductById: No se encontró el producto");
            res.status(404).json({status: 'error', error: 'No Se Encontro El Producto'});
    
        }else{
            res.json({status: 'success', payload: productId});
        }   
        
    }catch(err){
        logger.error("getProductById: ", err.message)
    }
}

export const addProductController = async (req, res) => {
    const product = req.body;

    try {
        product.owner = req.user.user.email;
        const productAdd = await ProductService.createProduct(product)
        await productAdd.save();
        console.log({ status: 'success', payload: productAdd });
        res.json({ status: 'success', payload: productAdd });
    } catch (err) {
        logger.error('Error al guardar el producto:', err);
        res.status(500).json({ status: 'error', error: 'No se pudo agregar el producto' });
    }
};


export const updateProductController = async (req, res) => {
    const id = req.params.pid;
    const productUpdates = req.body;

    try {

        const  role  = req.user.user.role;
        const  email  = req.user.user.email;
		const isProductOwnerOrAdmin =
			role === "admin" || email === productUpdates.owner;

		if (!isProductOwnerOrAdmin) {
			return res.status(403).json({ error: "Permission denied." });
		}

        const updatedProduct = await  ProductService.updateProduct(id, productUpdates)

        if (updatedProduct) {
            res.json({ status: 'success', payload: updatedProduct });
        } else {
            logger.error("updateProduct: No se encontró el producto");
            res.status(404).json({ status: 'error', error: 'No se encontró el producto' });
        }
    } catch (err) {
        logger.error("updateProduct: ", err.message);
        res.status(500).json({ status: 'error', error: 'Error en la actualización del producto' });
    }
}

export const deleteProductController = async (req, res) => {
    const productId = req.params.pid;

    try {
        const role = req.user.user.role;

        console.log("delete product user: ", role)
        const isAdminOrPremium = role === "admin" || role === "premium";

        if (!isAdminOrPremium) {
            return res.status(403).json({ error: "Permission denied." });
        }

        const deletedProduct = await ProductService.deleteProduct(productId);

        if (deletedProduct) {
            const products = await ProductService.getAllProducts();

            const productOwner = deletedProduct.owner;
            console.log("productOwner: ", productOwner)

            if (role === "premium") {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: config.nodemailer.user, pass: config.nodemailer.pass },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });
                let Mailgenerator = new Mailgen({
                    theme: "cerberus",
                    product: {
                        name: "Kame-house",
                        link: "http://localhost:8080",
                    },
                });
                let response = {
                    body: {
                        intro: `Estimado Usuario Premium,\n\nEl producto ${deletedProduct.title} ha sido eliminado.`,
                        outro: "Sincerely,\nKame-house",
                    },
                };
                let mail = Mailgenerator.generate(response);
            
                let message = {
                    from: "Kame-House",
                    to: productOwner,
                    subject: `'Producto Eliminado'`,
                    html: mail,
                };
            
                try {
                    await transporter.sendMail(message);
                    console.log('Correo electrónico enviado con éxito');
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error);
                }
            }

            res.status(200).json({ status: 'success', payload: products });
        } else {
            logger.error("deleteProduct: No se encontró el producto");
            res.status(404).json({ status: 'error', error: 'No se encontró el producto' });
        }
    } catch (err) {
        logger.error("deleteProduct: ", err.message);
        res.status(500).json({ status: 'error', error: 'Error en la Eliminación del producto' });
    }
};