document.addEventListener('DOMContentLoaded', () => {

  // ===== Header scroll effect =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

  // ===== Mobile menu =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close menu on link click
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // ===== Gallery filter =====
  const filtros = document.querySelectorAll('.filtro');
  const trabajos = document.querySelectorAll('.trabajo');

  filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
      const categoria = filtro.dataset.filtro;

      filtros.forEach(f => f.classList.remove('filtro--activo'));
      filtro.classList.add('filtro--activo');

      trabajos.forEach(trabajo => {
        if (categoria === 'todos' || trabajo.dataset.categoria === categoria) {
          trabajo.classList.remove('oculto');
        } else {
          trabajo.classList.add('oculto');
        }
      });
    });
  });

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let currentImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return Array.from(document.querySelectorAll('.trabajo:not(.oculto) img'));
  }

  function openLightbox(index) {
    currentImages = getVisibleImages();
    currentIndex = index;
    lightboxImg.src = currentImages[currentIndex].src;
    lightbox.classList.add('activo');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
  }

  trabajos.forEach(trabajo => {
    trabajo.addEventListener('click', () => {
      const visibleImages = getVisibleImages();
      const img = trabajo.querySelector('img');
      const index = visibleImages.indexOf(img);
      if (index !== -1) openLightbox(index);
    });
  });

  document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox__prev').addEventListener('click', () => navigate(-1));
  document.querySelector('.lightbox__next').addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('activo')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // ===== Counter animation =====
  const counters = document.querySelectorAll('.stat__numero');
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  // ===== Scroll animations =====
  const fadeElements = document.querySelectorAll('.section__title, .section__subtitle, .trabajo, .nosotros__contenido, .nosotros__imagen, .contacto__form, .contacto__info');
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation when stats section is visible
        if (!countersAnimated && entry.target.closest('.nosotros')) {
          countersAnimated = true;
          animateCounters();
        }
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => observer.observe(el));

  // ===== Contact form =====
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const nombre = data.get('nombre');

    // Build WhatsApp message
    const mensaje = `Hola, soy ${nombre}. ${data.get('mensaje')}`;
    const telefono = '+5493416014515'; // Replace with actual number
    const waUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(waUrl, '_blank');
    form.reset();
  });

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.header__link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--color-2)';
        } else {
          link.style.color = '';
        }
      }
    });
  });
});
