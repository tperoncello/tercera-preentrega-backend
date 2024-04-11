import logger from "./../../logger.js";

export default class ProductReposiroty {
    constructor (dao) {
        this.dao = dao
        logger.info({ message: 'Tipo de dao:', daoType: dao.constructor.name });
    }

    getAllProducts = async() => {
        try {
            return await this.dao.getAllProducts();
        } catch (error) {
            logger.error('Error al obtener todos los productos: ', error);
            throw error;
        }
    }
    getProductById = async(id) => {
        try {
            return await this.dao.getProductById(id);
        } catch (error) {
            logger.error('Error al obtener el producto: ', error);
            throw error;
        }
    }
    getAllPaginatedProducts = async(req) => {
        try {
            const paginatedProducts = await this.dao.getAllPaginatedProducts(req);
            return paginatedProducts;
        } catch (error) {
            logger.error('Error al obtener todos los productos: ', error);
            throw error;
        }
    }
    createProduct = async(data) => {
        try {
            return await this.dao.createProduct(data);
        } catch (error) {
            logger.error('Error al crear el Producto: ', error);
            throw error;
        }
    }
    updateProduct = async (id, data) => {
        try {
            return await this.dao.updateProduct(id, data);
        } catch (error) {
            console.error('Error al actualizar el Producto: ', error);
            throw error;
        }
    }
    
    deleteProduct = async (id) => {
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            logger.error('Error al eliminar el Producto: ', error);
            throw error;
        }
    }
}