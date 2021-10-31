const productos = [{id: 1, producto: "IPA 1L", precio: 120},
                {id: 2, producto: "Amber Lager 1L", precio: 100},
                {id: 3, producto: "Red Ipa 1L", precio: 140},
                {id: 4, producto: "Pilsen 1L", precio: 90}];
                
const carrito = [];
// const total = 0;
const DOMitems = document.getElementById("items");
const DOMcarrito = document.getElementById("carrito");
const DOMtotal = document.getElementById("total");


function crearProductos(){
        productos.forEach(info => {
            // nodo principal
            const Nodo = document.createElement('div');

            // body
            const NodoBody = document.createElement('div');

            // nombre birra
            const NodoTitulo = document.createElement('h4');
            NodoTitulo.textContent = info.producto;

            // precio
            const NodoPrecio = document.createElement('p');
            NodoPrecio.textContent = info.precio + '$';

            // boton de agregar al carrito
            const NodoBoton = document.createElement('button');
            NodoBoton.textContent = 'agregar';
            NodoBoton.setAttribute('marcador',info.id);
            NodoBoton.addEventListener('click',agregarProductoCarrito);


            // agregamos items
            NodoBody.appendChild(NodoTitulo);
            NodoBody.appendChild(NodoPrecio);
            NodoBody.appendChild(NodoBoton);
            Nodo.appendChild(NodoBody);
            DOMitems.appendChild(Nodo);
            
        });
    }

    function agregarProductoCarrito(evento){
        // agregamos el nodo al carrito
        let aux = evento.target.getAttribute('marcador');
        carrito.push(aux);
        // calculamos el total
        calcularTotal();
        // actualizamos el carrito
        imprimirCarrito();
    }
    
    // imprimimos todos los productos guardados en el carrito
    function imprimirCarrito(){
        // vaciamos el carrito
        DOMcarrito.textContent = ' ';

        // El objeto Set permite almacenar valores únicos de cualquier tipo con esto evitamos los valores repetidos
        let carritoSinDuplicados = [...new Set(carrito)];

        carritoSinDuplicados.forEach(item => {

            // Obtenemos el item que necesitamos de la variable base de datos
            let miItem = productos.filter(itemProductos => {
            return itemProductos.id === parseInt(item);
            });

            // Cuenta el número de veces que se repite el producto
            //El método reduce() ejecuta una función reductora sobre cada elemento de un array, devolviendo como resultado un único valor.
            let contador = carrito.reduce((total, itemId) => {
            // operador ternario
            return itemId === item ? total += 1 : total;
            }, 0);

            // Creamos el nodo del item del carrito
            let miNodo = document.createElement('li');
            miNodo.textContent = `${contador} x ${miItem[0].nombre} - ${miItem[0].precio}$`;
            
            // Boton de borrar
            let miBoton = document.createElement('button');
            miBoton.textContent = 'X';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }

    function borrarItemCarrito(evento){
        // Obtenemos el producto ID que hay en el boton pulsado
        let id = evento.target.dataset.item;

        // buscamos la pocision en que se encuentra y la eliminamos
        let aux = carrito.indexOf(id);
        carrito.splice(aux,1);

        // volvemos a imprimir
        imprimirCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
    }

    function calcularTotal(){
        // Limpiamos precio anterior
        let total = 0;
        // Recorremos el array del carrito
        carrito.forEach(item => {
            // De cada elemento obtenemos su precio
            const miItem = productos.filter((itemProductos) => {
                return itemProductos.id === parseInt(item);
            });
            total = total + miItem[0].precio;
        });
        // Renderizamos el precio en el HTML
        DOMtotal.textContent = total;
    }



// // main

crearProductos();