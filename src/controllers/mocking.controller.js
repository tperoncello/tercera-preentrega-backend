import { genereteProduct } from "../services/mocking/mocking.js";

export const getMockingProductsControler = async (req, res) => {
    const products = []
    for (let index = 0; index < 100; index++) {
        products.push(genereteProduct())
    }
    res.send({status: 'success', payload: products})
}