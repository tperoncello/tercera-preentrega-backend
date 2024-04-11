import { faker } from '@faker-js/faker';

export const genereteProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }),
        thumbnails: [],
        stock: 10,
        category: faker.commerce.product(),
    }
}