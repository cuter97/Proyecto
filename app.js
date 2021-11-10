
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
    {id: 1, producto: "IPA 1L", precio: 120},
    {id: 2, producto: "Amber Lager 1L", precio: 100},
    {id: 3, producto: "Red Ipa 1L", precio: 140},
    {id: 4, producto: "Pilsen 1L", precio: 90},
    {id: 5, producto: "Quilmes 1L", precio: 110},
    {id: 6, producto: "Palermo 1L", precio: 20},
    {id: 7, producto: "Schneider 1L", precio: 115},
    {id: 8, producto: "Ander 1L", precio: 190} 
    ];

const contenedorProductos = document.querySelector('#contenedor-productos');

const pintarProductos = () => {
     const template = document.querySelector('#template-productos').content;
     const fragment = document.createDocumentFragment();
     productos.forEach(item => {
        //  template.querySelector('img').setAttribute('src',item.imagen);
         template.querySelector('h5').textContent = item.producto;
         template.querySelector('p').textContent = '$' + item.precio;

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

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

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
        localStorage.clear();
    })
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
                delete carrito[btn.dataset.id];
            } else 
                carrito[btn.dataset.id] = { ...prod }
            
            pintarCarrito();
        })
    })
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