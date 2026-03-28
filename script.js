document.addEventListener('DOMContentLoaded', () => {

  // ===== Hero carousel =====
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove('hero__slide--active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('hero__slide--active');
    }, 4000);
  }

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
  const fadeElements = document.querySelectorAll('.section__title, .section__subtitle, .nosotros__contenido, .nosotros__imagen, .contacto__form, .contacto__info');
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

        // Trigger counter and video animation when nosotros section is visible
        if (entry.target.closest('.nosotros')) {
          if (!countersAnimated) {
            countersAnimated = true;
            animateCounters();
          }
          const video = document.getElementById('logoVideo');
          if (video && video.paused && !video.dataset.played) {
            video.dataset.played = 'true';
            video.play();
          }
        }
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  // ===== Contact form =====
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const nombre = data.get('nombre');
    const email = data.get('email');
    const telefono = data.get('telefono');
    const servicio = data.get('servicio');
    const mensaje = data.get('mensaje');

    let texto = `Hola! Soy *${nombre}*.\n`;
    if (email) texto += `Email: ${email}\n`;
    if (telefono) texto += `Tel: ${telefono}\n`;
    if (servicio) texto += `Servicio: ${servicio}\n`;
    texto += `\n${mensaje}`;

    const waUrl = `https://wa.me/5493416014515?text=${encodeURIComponent(texto)}`;
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

      if (link && !link.classList.contains('header__link--cta')) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--color-2)';
        } else {
          link.style.color = '';
        }
      }
    });
  });
});
