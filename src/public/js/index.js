
const socket = io();
const table = document.getElementById('realTimeProducts');
console.log('recibe datos');

document.getElementById('createBtn').addEventListener('click', async () => {
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: ["sin imagen"],
        status: true,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    };

    console.log(body);

    try {
        const response = await fetch('/api/products', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();
        console.log(result)

        if (result.status === 'error') {
            throw new Error(result.error);
        }

        const productListResponse = await fetch('/api/products/noPaginate');
        console.log(productListResponse)
        const productListResult = await productListResponse.json();
        console.log('Respuesta de /api/products/noPaginate:', productListResult);

        if (productListResult.status === 'error') {
            throw new Error(productListResult.error);
        }

        socket.emit('productList', productListResult);

        alert('Ok. Todo salió bien! :)\nEl producto se ha agregado con éxito!\n\nVista actualizada!');
        
        // Limpiar campos después de agregar el producto
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
        document.getElementById('code').value = '';
        document.getElementById('stock').value = '';
        document.getElementById('category').value = '';

    } catch (err) {
        console.error('Error:', err);
        alert(`Hubo un error al procesar la solicitud. Detalles: ${err.message}`);
    }
});

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'delete',
    })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') throw new Error(result.error)
            socket.emit('productList', result.payload)
            alert(`Ok. Todo salió bien! :)\nEl producto eliminado con éxito!`)
        })
        .catch(err => alert(`Ocurrió un error :(\n${err}`))
}

socket.on('updateProducts', (data) => {
    console.log("data updateproducts cliente: ", data);
    const realTimeProducts = document.getElementById('realTimeProducts');

    if (data !== null && Array.isArray(data)) {
        // Limpiar el contenido actual
        realTimeProducts.innerHTML = '';

        for (const product of data) {
            let cardItem = document.createElement('div');
            cardItem.className = 'card-item'; // Agrega la clase card

            cardItem.innerHTML = `
                    <img src="${product.thumbnails[0]}" alt="${product.title}" class="card-image">
                <div class="card-content">
                    <h2>${product.title}</h2>
                    <p class="description">${product.description}</p>
                    <p class="price">$ ${product.price}</p>
                    <p class="category">${product.category}</p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>`;

            realTimeProducts.appendChild(cardItem);
        }
    } else {
        console.log('Los datos recibidos no son un iterable válido o son nulos:', data);
    }
});