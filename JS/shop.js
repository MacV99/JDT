// Selección de elementos del DOM importantes para la interacción con el carrito de compras
let listProductHTML = document.querySelector('.listProduct'); // Contenedor de la lista de productos
let listCartHTML = document.querySelector('.listCart'); // Contenedor de la lista del carrito
let iconCart = document.querySelector('.icon-cart'); // Ícono del carrito
let iconCartSpan = document.querySelector('.icon-cart span'); // Elemento para mostrar la cantidad de productos
let body = document.querySelector('body'); // Elemento body para manipular clases
let closeCart = document.querySelector('.close'); // Botón para cerrar el carrito
let $cleanCart = document.querySelector('.clean'); // Botón para limpiar el carrito
let $btnBuy = document.querySelector('.buy'); // Botón para realizar el pedido 

// Arreglos para almacenar productos y carrito
let products = []; // Almacena la lista de productos cargados
let cart = []; // Almacena los productos añadidos al carrito

/**
 * Limpia y normaliza las rutas de imagen 
 * @param {string} path - Ruta de imagen original
 * @returns {string} Ruta de imagen limpia o cadena vacía
 */
const cleanImagePath = (path) => {
  return path ? path.trim() : '';
}

// Evento para mostrar/ocultar el carrito al hacer clic en el ícono del carrito
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
})

// INFINITY SLIDER
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const images = Array.from(track.children);
  let currentIndex = 0;

  function createInfiniteCarousel() {
    // Clonar el primer elemento al final
    const firstImageClone = images[0].cloneNode(true);
    track.appendChild(firstImageClone);
  }

  function moveCarousel() {
    currentIndex++;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Cuando llegue a la última imagen (incluyendo la clonada)
    if (currentIndex >= images.length) {
      setTimeout(() => {
        // Desactivar transición para un cambio instantáneo
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        currentIndex = 0;

        // Restaurar transición después del reset
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease';
        }, 50);
      }, 500);
    }
  }

  // Crear el efecto infinito
  createInfiniteCarousel();

  // Cambiar imagen cada 3 segundos
  setInterval(moveCarousel, 3000);
});

// Evento para cerrar el carrito
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
})

/**
 * Renderiza los productos en el HTML
 * Limpia el contenedor de productos y añade nuevos elementos
 */
const addDataToHTML = () => {
  // Limpiar contenido existente del contenedor de productos
  listProductHTML.innerHTML = `
                            <div class="arrows flex-row">
                                <i class="bi bi-arrow-left-circle-fill flex-row"></i>
                                <i class="bi bi-arrow-right-circle-fill flex-row"></i>
                            </div>`;

  // Añadir nuevos productos si existen
  if (products.length > 0) {
    // Usar fragment para mejor rendimiento
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
      // Crear elemento de producto
      let newProduct = document.createElement('div');
      newProduct.dataset.id = product.id;
      newProduct.classList.add('item', 'flex-column');

      // Estructura HTML para cada producto
      newProduct.innerHTML = `
                <img src=".${cleanImagePath(product.image)}" alt="${product.name}">
                <h5 class="product-name">${product.name}</h5>

                <div class="flex-row">
                    <button class="addCart">Agregar</button>
                    <i class="bi bi-info flex-row"></i>
                </div>
            `;

      // Seleccionar el ícono de información recién creado
      const $infoIcon = newProduct.querySelector('.bi-info');

      // Añadir event listener para mostrar detalles del producto
      $infoIcon.addEventListener('click', () => {
        showProductDetails(product.id);
      });

      fragment.appendChild(newProduct);
    });

    listProductHTML.appendChild(fragment);
  }
}

// Función para mostrar los detalles del producto seleccionado
function showProductDetails(productId) {
  const product = products.find(p => p.id == productId); // Buscar el producto en el array

  if (product) {
    const $vProduct = document.getElementById('v-product'); // Contenedor de la vista del producto

    // Actualizar contenido con los detalles del producto
    $vProduct.querySelector('img').src = `.${product.image}`;
    $vProduct.querySelector('.product-name').textContent = product.name;
    $vProduct.querySelector('p').textContent = product.details;

    // Mostrar la vista del producto
    $vProduct.style.display = 'flex';

    // Agregar evento para cerrar la vista
    const closeBtn = document.getElementById('close-pro');
    closeBtn.onclick = () => {
      $vProduct.style.display = 'none';
    };
  } else {
    console.error("Producto no encontrado");
  }
}

// Evento de delegación para añadir productos al carrito
listProductHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('addCart')) {
    let product_id = positionClick.closest('.item').dataset.id;
    addToCart(product_id);
  }
})

/**
 * Añade un producto al carrito
 * @param {string} product_id - ID del producto a añadir
 */
const addToCart = (product_id) => {
  // Buscar si el producto ya está en el carrito
  let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

  // Lógica para añadir producto al carrito
  if (cart.length <= 0) {
    // Si el carrito está vacío, añadir primer producto
    cart = [{
      product_id: product_id,
      quantity: 1
    }];
  } else if (positionThisProductInCart < 0) {
    // Si el producto no está en el carrito, añadirlo
    cart.push({
      product_id: product_id,
      quantity: 1
    });
  } else {
    // Si el producto ya está en el carrito, incrementar cantidad
    cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
  }

  // Actualizar visualización y almacenamiento del carrito
  addCartToHTML();
  addCartToMemory();
}

/**
 * Guarda el carrito en el almacenamiento local del navegador
 */
const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Renderiza el carrito en el HTML
 * Muestra productos, cantidades y calcula totales
 */
const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length > 0) {
    // Usar fragment para mejor rendimiento
    const fragment = document.createDocumentFragment();

    cart.forEach(item => {
      // Encontrar detalles del producto en la lista de productos
      let positionProduct = products.findIndex((value) => value.id == item.product_id);

      if (positionProduct !== -1) {
        let info = products[positionProduct];
        let itemTotal = info.price * item.quantity;

        // Calcular totales
        totalQuantity += item.quantity;
        totalPrice += itemTotal;

        // Crear elemento de producto en el carrito
        let newItem = document.createElement('div');
        newItem.classList.add('item', 'flex-row');
        newItem.dataset.id = item.product_id;

        // Estructura HTML para elemento del carrito
        newItem.innerHTML = `
                    <div class="image flex-column">
                        <img src=".${cleanImagePath(info.image)}" alt="${info.name}">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>

                    <div class="quantity flex-row">
                        <span><i class="bi bi-dash minus"></i></span>
                        <span>${item.quantity}</span>
                        <span><i class="bi bi-plus plus"></i></span>
                    </div>
                `;

        fragment.appendChild(newItem);
      }
    });

    listCartHTML.appendChild(fragment);

    // Añadir sección de total del carrito
    let totalSection = document.createElement('div');
    totalSection.classList.add('cart-total');
    totalSection.innerHTML = `
            <strong>✅</strong>
        `;
    listCartHTML.appendChild(totalSection);
  }

  // Actualizar contador de productos en el ícono del carrito
  iconCartSpan.innerText = totalQuantity;
}

// Evento de delegación para cambiar cantidad de productos en el carrito
listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    let product_id = positionClick.closest('.item').dataset.id;
    let type = positionClick.classList.contains('minus') ? 'minus' : 'plus';
    changeQuantityCart(product_id, type);
  }
})

/**
 * Cambia la cantidad de un producto en el carrito
 * @param {string} product_id - ID del producto
 * @param {string} type - Tipo de cambio ('plus' o 'minus')
 */
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

  if (positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        // Incrementar cantidad
        cart[positionItemInCart].quantity++;
        break;
      case 'minus':
        // Decrementar cantidad
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          // Eliminar producto si la cantidad llega a cero
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }

  // Actualizar visualización y almacenamiento
  addCartToHTML();
  addCartToMemory();
}

/**
 * Inicializa la aplicación
 * Carga productos desde JSON y recupera carrito del almacenamiento local
 */
const initApp = () => {
  // Obtener datos de productos desde archivo JSON
  fetch('../JSON/products.json')
    .then(response => response.json())
    .then(data => {
      // Almacenar productos cargados
      products = data;
      // Renderizar productos
      addDataToHTML();

      // Recuperar carrito del almacenamiento local si existe
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
    });
}

//CLEAN CART
// Evento para limpiar el carrito cuando se hace clic en el botón
$cleanCart.addEventListener('click', () => {
  // Reiniciar el arreglo del carrito a vacío
  cart = [];

  // Actualizar visualización del carrito
  addCartToHTML();

  // Eliminar el carrito del almacenamiento local
  localStorage.removeItem('cart');
});

// Botón para hacer el pedido
$btnBuy.addEventListener("click", () => {
  let total = document.querySelector('.cart-total strong').innerText;
  let mensaje = `Hola JDT!, quiero hacer un pedido:\n\n`;

  cart.forEach((item) => {
    // Usar el product_id como índice, no como valor de búsqueda
    mensaje += `- ${products[item.product_id - 1].name} x ${item.quantity}}\n`;
  });
  mensaje += `\n*${total}*`;

  const urlWhatsApp = `https://wa.me/3125430356?text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsApp, "_blank");
});

// Iniciar la aplicación al cargar el script
initApp();