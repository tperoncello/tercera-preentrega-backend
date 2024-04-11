import { expect } from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker'
import _ from 'mongoose-paginate-v2';

const requester = supertest('http://localhost:8080');

describe('Testing Adoptme', () => {
    describe('Test /api/products', () => {

        it('El endpoint GET /api/products debe devolver una lista de productos', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.get('/api/products')
                .set('Cookie', `myCookie=${token}`)
            const { status } = response;
            expect(status).to.equal(200);
        });

        it('El endpoint GET /api/products/:pid debe devolver un producto', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.get('/api/products/658d9088679e66ea6518ff1e')
                .set('Cookie', `myCookie=${token}`)
            const { status } = response;
            expect(status).to.equal(200);
        });

        it('El endpoint POST /api/products debe registrar un producto', async () => {
            const productMock = {
                id: 11111,
                title: 'vino',
                description: 'producto de prueba test',
                price: 1,
                thumbnails: [],
                status: true,
                code: 'Test111',
                stock: 1,
                category: 'test'
            };

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.post('/api/products')
                .set('Cookie', `myCookie=${token}`)
                .send(productMock);

            const { status, ok, _body } = response;
            expect(_body.payload).to.have.property('_id');
        });

        it('El endpoint POST /api/products NO debe registrar un producto con datos vacíos', async () => {
            const productMock = {};

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.post('/api/products')
                .set('Cookie', `myCookie=${token}`)
                .send(productMock);

            const { status, ok, _body } = response
            expect(ok).to.be.eq(false)
        });

        it('El endpoint PUT /api/products/:pid debe actualizar un producto existente', async () => {

            const updatedProductData = {
                title: 'vino1',
                price: 29.99,
            }
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.put('/api/products/659eb14ef888970c59a19848')
                .set('Cookie', `myCookie=${token}`)
                .send(updatedProductData);
            const { status } = response;
            expect(status).to.equal(200);
        });
    });

    describe('Test /api/cart', () => {

        it('El endpoint POST /api/cart debe crear un carrito', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.post('/api/cart')
                .set('Cookie', `myCookie=${token}`)
            const { status } = response;
            expect(status).to.equal(200);
        });

        it('El endpoint GET /api/cart/:cid debe devolver un carrito', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.get('/api/cart/655a84b831deae5fce43d26a')
                .set('Cookie',`myCookie=${token}`)
            const { status } = response;
            expect(status).to.equal(200);
        });

        it('El endpoint POST /api/cart/:cid/product/:pid debe añadir un producto al carrito', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.post('/api/cart/655a84b831deae5fce43d26a/product/659eb14ef888970c59a19848')
                .set('Cookie', `myCookie=${token}`)

            const { status } = response;
            expect(status).to.equal(200);
        });

        it('El endpoint PUT /api/carts/:cid debe agregar uno o mas productos al carrito', async () => {

            const products = [{
                product: '658d9088679e66ea6518ff17',
                quantity: 3,
            }];
            const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.put('/api/cart/655a84b831deae5fce43d26a')
                .set('Cookie', `myCookie=${token1}`)
                .send(products);
            const { status, ok, _body } = response;
            console.log(status)

        });

        it('El endpoint PUT /api/carts/:cid/product/:pid debe actualizar un producto del carrito', async () => {
            const updatedProductData = {
                quantity: 2,
            };
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.put('/api/cart/655b62834b1b1f7e676d82d3/product/659eb14ef888970c59a19848')
                .set('Cookie', `myCookie=${token}`)
                .send(updatedProductData);
            const { status } = response;
            console.log(status)
        });

        it('El endpoint GET /api/cart/:cid/purchase debe devolver el comprobante de un carrito', async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1OTcyMGE5MWE0NzYzZTFhNzM3NDNlMiIsImZpcnN0TmFtZSI6IkNvZGVyIiwibGFzdE5hbWUiOiJDb2RlciIsImVtYWlsIjoiYWRtaW5Db2RlckBjb2Rlci5jb20iLCJhZ2UiOjIyLCJwYXNzd29yZCI6IiQyYiQxMCRNUnA3T3hacHVLM0pPdUpDbk1wYkwuc3NyVC5hb043eW11aDR0bng4UXpXZHpKaFVGN2VQYSIsImNhcnQiOiI2NTk3MjBhOTFhNDc2M2UxYTczNzQzZTAiLCJyb2xlIjoiYWRtaW4iLCJfX3YiOjB9LCJpYXQiOjE3MDQ5ODA3NzMsImV4cCI6MTcwNTA2NzE3M30.MinutKVCgGxXixh3mRHmvMhz3lDdJ7Y_fTG6k8Tdc4w';
            const response = await requester.get('/api/cart/655a84b831deae5fce43d26a/purchase')
                .set('Cookie', `myCookie=${token}`)
            const { status, ok, _body } = response;
            expect(status).to.equal(200);
        });
    });

    describe('Test /api/sessions', () => {

        const mockUser = {
            firstName: 'Jose',
            lastName: 'Brito',
            email: faker.internet.email(),
            age: 22,
            password: 'secret'
        }
        console.log(mockUser)

        it('El endpoint POST /api/sessions debe registrar un usuario', async () => {
            const response = await requester.post('/api/sessions/register').send(mockUser)
            console.log(response)
            //expect(_body.payload).to.be.ok
        });
    });
});





