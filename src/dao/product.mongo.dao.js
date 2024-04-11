import productModel from "./models/product.model.js";
import { PORT } from "../app.js"
import logger from "../logger.js";

export default class ProductMongoDAO {
    getAllProducts = async() => await productModel.find().lean().exec()
    getProductById = async(id) => await productModel.findById(id).lean().exec()
    getAllPaginatedProducts = async(req) => {
        try{
            const limit = req.query.limit || 10 // Obtener el valor de "limit" de la consulta
            const page = req.query.page || 1   // Obtener el valor de "page" de la consulta
    
            const filterOptions = {}
    
            if(req.query.stock) filterOptions.stock = req.query.stock
            if(req.query.category) filterOptions.category = req.query.category
    
            const paginateOptions = { lean: true, limit, page };
            if(req.query.sort === 'asc') filterOptions.sort = { price: 1}
            if(req.query.sort === 'desc') filterOptions.sort = { price: -1}
    
            const result = await productModel.paginate( filterOptions, paginateOptions )
    
            const basePageURL = `http://${req.hostname}:${PORT}/products`;

        //prevLink
            let prevLink;
            if (result.hasPrevPage) {
                prevLink = `${basePageURL}?page=${result.prevPage}`;
            } else {
                prevLink = null; // No hay página anterior
            }

        //nextLink
            let nextLink;
            if (result.hasNextPage) {
                nextLink = `${basePageURL}?page=${result.nextPage}`;
            } else {
                nextLink = null; // No hay página siguiente
            }
    
            return {
                statuscode: 200,
                response: {
                    status: 'succes',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? prevLink : null,
                    nextLink: result.hasNextPage ? nextLink : null,
                }
            }

        } catch(err) {
            logger.error("getAllPaginatedProducts: ", err.message)
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message }
            }
        }
    }
    createProduct = async(data) => await productModel.create(data)
    updateProduct = async(id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    deleteProduct = async(id) => await productModel.findByIdAndDelete(id)
}