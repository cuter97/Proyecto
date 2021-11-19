document.addEventListener("DOMContentLoaded", () =>{
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

const fetchData = async () => {
    try {
        const res = await fetch('https://my-json-server.typicode.com/cuter97/API/productos');
        const data = await res.json();
        pintarProductos(data);
        detectarBotones(data);
        //console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const contenedorProductos = document.querySelector('#contenedor-productos');


 // uso de jquery
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content;
    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        template.querySelector('img').setAttribute('src',item.imagen);
        template.querySelector('h5').textContent = item.producto;
        template.querySelector('.info-producto').textContent = item.info;
        template.querySelector('.card-text').textContent = 'Precio: $' + item.precio;
        
        //  colocamos el id correspondiente de cada producto en el boton
        template.querySelector('.boton-comprar').dataset.id = item.id;
        template.querySelector('.boton-info').setAttribute('data-bs-target', `#collapse${item.id}`);
        template.querySelector('.boton-info').setAttribute('aria-controls', `collapse${item.id}`);
        template.querySelector('.info-producto').setAttribute('id', `collapse${item.id}`);
        
        const clone = template.cloneNode(true);
        fragment.append(clone);
    });
    contenedorProductos.appendChild(fragment);
}
    
let carrito = {}

const detectarBotones = (data) => {
    // buscamos dentro de .card los botones y los almacenamos 
    const botones = document.querySelectorAll('.card .boton-comprar');

    botones.forEach(btn =>{
        btn.addEventListener('click', () => {
            const prod = data.find(item => item.id === parseInt(btn.dataset.id));
            prod.cantidad = 1;
            if (carrito.hasOwnProperty(prod.id)) {
                prod.cantidad = carrito[prod.id].cantidad + 1 ;
            }
            carrito[prod.id] = { ...prod }
            pintarCarrito();
        });
    });
}


const pintarCarrito = () => {
    $('#items').empty();
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
    $('#items').append(fragment);

    botonX();
    pintarFooter();
    accionBotones();

    localStorage.setItem('carrito', JSON.stringify(carrito))
}


const pintarFooter = () => {
    $('#footer-carrito').empty();
    
     if (Object.keys(carrito).length === 0) {
        $('#footer-carrito').append( `<th scope="row" colspan="5">Carrito vacío</th>`)
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

    $('#footer-carrito').append(fragment)

    // boton de vaciar carrito
    $('#vaciar-carrito').on('click', () => {
        carrito = {}
        pintarCarrito();
        $('#num-carrito').empty();
        localStorage.clear();
    });

    $('#num-carrito').text(nCantidad); 

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

$("#pills-home-tab").on('click', () => {
    document.querySelector('#pills-home').style.display = "block";
    document.querySelector('#pills-tabContent').style.display = "none";
});

$("#pills-profile-tab").on('click', () => {
    document.querySelector('#pills-home').style.display = "none";
    document.querySelector('#pills-tabContent').style.display = "block";
});

