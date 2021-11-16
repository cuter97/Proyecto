
// para despues usar una api xd
// document.addEventListener("DOMContentLoaded", () =>{
//     fetchData();
// });

// const fetchData = async () => {
//     try {
//         const res = await fetch('https://my-json-server.typicode.com/cuter97/API/productos');
//         const data = await res.json();
//         pintarProductos(data);
//         //console.log(data);
//     } catch (error) {
//         console.log(error);
//     }
// }

const productos = [
    {id: 1, producto: "IPA 1L", precio: 120, imagen: 'https://picsum.photos/id/110/200'},
    {id: 2, producto: "Amber Lager 1L", precio: 100, imagen: 'https://picsum.photos/id/111/200'},
    {id: 3, producto: "Red Ipa 1L", precio: 140, imagen: 'https://picsum.photos/id/112/200'},
    {id: 4, producto: "Pilsen 1L", precio: 90, imagen: 'https://picsum.photos/id/113/200'},
    {id: 5, producto: "Quilmes 1L", precio: 110, imagen: 'https://picsum.photos/id/114/200'},
    {id: 6, producto: "Palermo 1L", precio: 20, imagen: 'https://picsum.photos/id/115/200'},
    {id: 7, producto: "Schneider 1L", precio: 115, imagen: 'https://picsum.photos/id/116/200'},
    {id: 8, producto: "Doble IPA", precio: 300, imagen: 'https://picsum.photos/id/128/200'},
    {id: 9, producto: "Ander 1L", precio: 190, imagen: 'https://picsum.photos/id/120/200'} 
    ];

const contenedorProductos = document.querySelector('#contenedor-productos');

const pintarProductos = () => {
     const template = document.querySelector('#template-productos').content;
     const fragment = document.createDocumentFragment();
     productos.forEach(item => {
         template.querySelector('img').setAttribute('src',item.imagen);
         template.querySelector('h5').textContent = item.producto;
         template.querySelector('p').textContent = 'Precio: $' + item.precio;

        //  colocamos el id correspondiente de cada producto en el boton
        template.querySelector('button').dataset.id = item.id;

         const clone = template.cloneNode(true);
         fragment.appendChild(clone);
     });
     contenedorProductos.appendChild(fragment);
}


let carrito = {}

const detectarBotones = () => {
    // buscamos dentro de .card los botones y los almacenamos 
    const botones = document.querySelectorAll('.card button');

    botones.forEach(btn =>{
        btn.addEventListener('click', () => {
            const prod = productos.find(item => item.id === parseInt(btn.dataset.id));
            prod.cantidad = 1;
            if (carrito.hasOwnProperty(prod.id)) {
                prod.cantidad = carrito[prod.id].cantidad + 1 ;
            }
            carrito[prod.id] = { ...prod }
            pintarCarrito();
        });
    });
}

const items = document.querySelector('#items');

const pintarCarrito = () => {
    items.innerHTML = '';
    const template = document.querySelector('#template-carrito').content;
    const fragment = document.createDocumentFragment();

    // transformamos el objeto carrito en un array para recorrerolo con un foreach
    Object.values(carrito).forEach(item2 => {
        template.querySelector('th').textContent = item2.id;
        template.querySelectorAll('td')[0].textContent = item2.producto;
        template.querySelectorAll('td')[1].textContent = item2.cantidad;
        template.querySelector('span').textContent = item2.precio * item2.cantidad;


        // botones
        template.querySelector('.btn-info').dataset.id = item2.id;
        template.querySelector('.btn-danger').dataset.id = item2.id;
        template.querySelector('.btn-close').dataset.id = item2.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    botonX();
    pintarFooter();
    accionBotones();

    localStorage.setItem('carrito', JSON.stringify(carrito))
}


const footer = document.querySelector('#footer-carrito'); 

const pintarFooter = () => {
    footer.innerHTML = '';
    
     if (Object.keys(carrito).length === 0) {
         footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`
         return
     }

    const template = document.querySelector('#template-footer').content;
    const fragment = document.createDocumentFragment();  
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0);  

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    // boton de vaciar carrito
    const boton = document.querySelector('#vaciar-carrito');
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito();
        numCar.textContent = '';
        localStorage.clear();
    });

    const numCar = document.querySelector('#num-carrito');
    numCar.textContent = nCantidad;  

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info');
    const botonesEliminar = document.querySelectorAll('#items .btn-danger');

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = carrito[btn.dataset.id];
            prod.cantidad ++ ;
            carrito[btn.dataset.id] = { ...prod }
            pintarCarrito();
        });
    });

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = carrito[btn.dataset.id];
            prod.cantidad -- ;
            if (prod.cantidad === 0) {
                const numCar = document.querySelector('#num-carrito');
                delete carrito[btn.dataset.id];
                numCar.textContent = '';
            } else 
                carrito[btn.dataset.id] = { ...prod }
            
            pintarCarrito();
        })
    })
}

const botonX = () => {
    const btnX = document.querySelectorAll('#items .btn-close');
    
    btnX.forEach(btn => {
         btn.addEventListener('click', () => {

            delete carrito[btn.dataset.id];
            if (Object.values(carrito).length === 0) {
                const numCar = document.querySelector('#num-carrito');
                numCar.textContent = '';
            }

            pintarCarrito();
        });
    });
}

const cargarLocalStorage = () => {
    // si existe un carrito cargado lo imprimimos
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }
}
//main
cargarLocalStorage();
pintarProductos();
detectarBotones();
pintarCarrito();
pintarFooter();

document.querySelector("#pills-home-tab").addEventListener('click', () => {
    document.querySelector('#pills-home').style.display = "block";
    document.querySelector('#pills-tabContent').style.display = "none";
});

document.querySelector("#pills-profile-tab").addEventListener('click', () => {
    document.querySelector('#pills-home').style.display = "none";
    document.querySelector('#pills-tabContent').style.display = "block";
});