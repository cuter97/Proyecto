document.addEventListener("DOMContentLoaded", () =>{
    // con esto nos aseguramos que nuestro archivo se cargo
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

const fetchData = async () => {
    try {
        /*esta api la cree en jsonserver, es una api de pruebas */
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
//  funcion para pintar los productos de carrito
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content; /*capturamos el template con el id template-productos */
    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        template.querySelector('img').setAttribute('src',item.imagen); /*si el src no esta creado lo crea, pero si ya esta creado lo utiliza */
        template.querySelector('h5').textContent = item.producto;
        template.querySelector('.info-producto').textContent = item.info;
        template.querySelector('.card-text').textContent = 'Precio: $' + item.precio;
        
        //  colocamos el id correspondiente de cada producto en el boton
        template.querySelector('.boton-comprar').dataset.id = item.id;
        template.querySelector('.boton-info').setAttribute('data-bs-target', `#collapse${item.id}`);
        template.querySelector('.boton-info').setAttribute('aria-controls', `collapse${item.id}`);
        template.querySelector('.info-producto').setAttribute('id', `collapse${item.id}`);
        
        const clone = template.cloneNode(true);/*una vez que tenemos el template lo clonamos para cada producto*/
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
            if (carrito.hasOwnProperty(prod.id)) { /*si existe el producto entra al if*/
                prod.cantidad = carrito[prod.id].cantidad + 1 ; /*aumentamos la cantidad ya que el boton se apreto otra vez */
            }
            carrito[prod.id] = { ...prod } /*spread operator lo que hacemos es remplazar el elemnto cuando se haga click y nos evitamos hacer mas calculos con javascript*/
            pintarCarrito();
        });
    });
}

/*pintamos el carrito */
/*utilizamos otra vez fragments y templates */
const pintarCarrito = () => {
    $('#items').empty();
    const template = document.querySelector('#template-carrito').content;
    const fragment = document.createDocumentFragment();

    // transformamos el objeto carrito en un array para recorrerolo con un foreach
    Object.values(carrito).forEach(item2 => {
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

/*pintamos el footer del carrito */
const pintarFooter = () => {
    $('#footer-carrito').empty();/*limpiamos el carrito */
    
    /*si no hay productos en el carrito pintamos el mensaje de carrito vacio */
     if (Object.keys(carrito).length === 0) {
        $('#footer-carrito').append( `<th scope="row" colspan="5">Carrito vacío</th>`)
         return
     }

    const template = document.querySelector('#template-footer').content;
    const fragment = document.createDocumentFragment();  
    /*sumamos la cantidad de productos y el total */
    /*utilizamos la funcion reduce y como solo funciona si es un array transformamos el objeto carrito */
    const nCantidad = Object.values(carrito).reduce((acum, { cantidad }) => acum + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acum, {cantidad, precio}) => acum + cantidad * precio ,0);  

    template.querySelector('span').textContent = nPrecio;
    template.querySelectorAll('td')[0].textContent = nCantidad;

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

    //usamos un poco de jquery
    $('#num-carrito').text(nCantidad);
    
    $('#btn-compra').on('click', () => {
        $('#btn-compra').text('PROXIMAMENTE');
    });
    
}

// accion de los botones + y -
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

// boton que elimina el elemento entero del carrito
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

