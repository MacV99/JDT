let $floatWhatsapp = document.querySelector('.float-whatsapp');

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
      }, 500)
    }
  }

  // Crear el efecto infinito
  createInfiniteCarousel();

  // Cambiar imagen cada 3 segundos
  setInterval(moveCarousel, 3000);
});

// CLICK EN FLOAT-WHATSAPP
$floatWhatsapp.addEventListener('click', function () {
  const urlWhatsApp = `https://wa.me/573125430356?text=Hola JDT`;
  window.open(urlWhatsApp, "_blank");
});


// CLICK EN BOTON DE MENU
const $burguerNav = document.getElementById('bar');
$burguerNav.addEventListener('click', function () {
  const $navMobile = document.getElementById('mobile');
  $navMobile.style.display = 'flex';
});