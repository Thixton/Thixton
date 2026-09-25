/**
 * Bayer Argentina — Portfolio Profesional de Pasantía
 * Lógica ligera para interacción: descarga de vCard, toast feedback, sincronización de historial y focus trap accesible
 */

let lastFocusedTrigger = null;

/**
 * Descarga la tarjeta de contacto (.vcf) directa al celular
 * Optimizada para importar en iOS y Android con un solo tap tras el escaneo NFC
 */
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:García Thixton;Juan Bautista;;;',
    'FN:Juan Bautista García Thixton',
    'ORG:Bayer Argentina;Crop Protection',
    'TITLE:Pasante de Ingeniería Industrial | Project Management',
    'TEL;type=CELL;type=VOICE;type=pref:+5491158126740',
    'EMAIL;type=INTERNET;type=WORK:juanba2604@gmail.com',
    'URL:https://www.linkedin.com/in/garciathixtonjuan',
    'NOTE:Contacto obtenido en Science Fair Bayer 2026. Automatización de procesos (n8n, Python) y Project Management.',
    'END:VCARD'
  ].join('\r\n');

  try {
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Juan_Bautista_Garcia_Thixton_Bayer.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('✓ Contacto descargado para tu agenda');
  } catch (err) {
    console.warn('Fallback para descarga de vCard:', err);
    try {
      window.location.href = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcardData);
      showToast('✓ Abriendo tarjeta de contacto');
    } catch (innerErr) {
      showToast('Error al descargar contacto');
    }
  }
}

/**
 * Abre chat de WhatsApp protegiendo el número telefónico contra crawlers y scrapers automáticos
 * El endpoint y los dígitos se componen dinámicamente en memoria al hacer clic.
 */
function openWhatsAppChat() {
  const c = String.fromCharCode(53, 52); // "54"
  const a = String.fromCharCode(57, 49, 49); // "911"
  const b = String.fromCharCode(53, 56, 49, 50); // "5812"
  const d = String.fromCharCode(54, 55, 52, 48); // "6740"
  const phone = `${c}${a}${b}${d}`;

  const message = encodeURIComponent('Hola Juan Bautista, vi tu portfolio de la Science Fair de Bayer y me gustaría conversar.');
  const gateway = atob('aHR0cHM6Ly93YS5tZS8=');
  const target = `${gateway}${phone}?text=${message}`;

  window.open(target, '_blank', 'noopener,noreferrer');
}

/**
 * Toast feedback accesible y no invasivo
 * @param {string} message 
 */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

/**
 * Galería de fotos del perfil (accesible al abrir el popup)
 */
const profileGallery = [
  {
    src: 'Media/1000728779.jpg',
    fallback: '1000728779.jpg',
    title: 'Juan Bautista García Thixton',
    sub: 'Bayer Argentina · Pasantía 2025–2027',
    alt: 'Juan Bautista García Thixton con el logo de Bayer'
  },
  {
    src: 'Media/IMG-20260310-WA0072.jpg',
    fallback: 'IMG-20260310-WA0072.jpg',
    title: 'Presencia en ExpoAgro',
    sub: 'Bayer Argentina · Si es Agro, es Bayer',
    alt: 'Juan Bautista García Thixton en ExpoAgro con Bayer'
  },
  {
    src: 'Media/IMG-20260310-WA0143.jpg',
    fallback: 'IMG-20260310-WA0143.jpg',
    title: 'Equipo y Comunidad Técnica',
    sub: 'Bayer Argentina · Crop Protection',
    alt: 'Equipo de pasantes y profesionales de Bayer'
  }
];

let currentGalleryIndex = 0;

function renderGalleryPhoto(index, transition = false) {
  if (index < 0) index = profileGallery.length - 1;
  if (index >= profileGallery.length) index = 0;
  currentGalleryIndex = index;

  const item = profileGallery[currentGalleryIndex];
  const img = document.getElementById('galleryMainImg');
  const capTitle = document.getElementById('photoCaptionTitle');
  const capSub = document.getElementById('photoCaptionSub');
  const counter = document.getElementById('galleryCounter');
  const dots = document.querySelectorAll('.gallery-dot');

  if (transition && img) {
    img.style.opacity = '0.35';
    img.style.transform = 'scale(0.97)';
    setTimeout(() => {
      img.src = item.src;
      img.alt = item.alt;
      img.onerror = () => { img.onerror = null; img.src = item.fallback; };
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 120);
  } else if (img) {
    img.src = item.src;
    img.alt = item.alt;
    img.onerror = () => { img.onerror = null; img.src = item.fallback; };
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }

  if (capTitle) capTitle.textContent = item.title;
  if (capSub) capSub.textContent = item.sub;
  if (counter) counter.textContent = `${currentGalleryIndex + 1} / ${profileGallery.length}`;

  dots.forEach((dot, i) => {
    const isActive = i === currentGalleryIndex;
    if (isActive) {
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');
    } else {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    }
  });
}

function nextGalleryPhoto() {
  renderGalleryPhoto(currentGalleryIndex + 1, true);
}

function prevGalleryPhoto() {
  renderGalleryPhoto(currentGalleryIndex - 1, true);
}

function goToGalleryPhoto(index) {
  renderGalleryPhoto(index, true);
}

/**
 * Control del Modal de Foto Completa con sincronización de historial y focus trap
 */
function openPhotoModal(index = 0) {
  lastFocusedTrigger = document.activeElement;
  const modal = document.getElementById('photoModal');
  if (modal) {
    renderGalleryPhoto(index, false);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.photo-modal-close');
    if (closeBtn) closeBtn.focus();

    if (!history.state || history.state.modal !== 'photo') {
      history.pushState({ modal: 'photo' }, '', '#foto-perfil');
    }
  }
}

function closePhotoModal(fromPopState = false) {
  const modal = document.getElementById('photoModal');
  if (modal && modal.classList.contains('open')) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (!fromPopState && history.state && history.state.modal === 'photo') {
      history.back();
    }
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }
}

/**
 * Galería de imágenes para el Modal de Proyectos
 */
let currentProjectImages = [];
let currentProjectImageIndex = 0;

function renderProjectPhoto(index, transition = false) {
  if (!currentProjectImages || currentProjectImages.length === 0) return;
  if (index < 0) index = currentProjectImages.length - 1;
  if (index >= currentProjectImages.length) index = 0;
  currentProjectImageIndex = index;

  const item = currentProjectImages[currentProjectImageIndex];
  const img = document.getElementById('modalProjectImg');
  const capTitle = document.getElementById('projectCaptionTitle');
  const capSub = document.getElementById('projectCaptionSub');
  const counter = document.getElementById('projectGalleryCounter');
  const dotsContainer = document.getElementById('projectGalleryDots');

  if (transition && img) {
    img.style.opacity = '0.35';
    img.style.transform = 'scale(0.98)';
    setTimeout(() => {
      img.src = item.src;
      img.alt = item.alt || item.title || 'Fotografía del proyecto';
      img.onerror = () => { img.onerror = null; if (item.fallback) img.src = item.fallback; };
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 120);
  } else if (img) {
    img.src = item.src;
    img.alt = item.alt || item.title || 'Fotografía del proyecto';
    img.onerror = () => { img.onerror = null; if (item.fallback) img.src = item.fallback; };
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }

  if (capTitle) capTitle.textContent = item.title || '';
  if (capSub) capSub.textContent = item.caption || '';
  if (counter) counter.textContent = `${currentProjectImageIndex + 1} / ${currentProjectImages.length}`;

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, i) => {
      const isActive = i === currentProjectImageIndex;
      if (isActive) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }
}

function nextProjectPhoto() {
  if (currentProjectImages.length > 1) {
    renderProjectPhoto(currentProjectImageIndex + 1, true);
  }
}

function prevProjectPhoto() {
  if (currentProjectImages.length > 1) {
    renderProjectPhoto(currentProjectImageIndex - 1, true);
  }
}

function goToProjectPhoto(index) {
  renderProjectPhoto(index, true);
}

/**
 * Control del Modal de Detalle de Proyecto con sincronización de historial y focus trap
 */
function openProjectModal(cardElement) {
  lastFocusedTrigger = cardElement || document.activeElement;
  const modal = document.getElementById('projectModal');
  if (!modal || !cardElement) return;

  const num = cardElement.querySelector('.project-num')?.textContent || '';
  const area = cardElement.querySelector('.project-area')?.textContent || '';
  const title = cardElement.querySelector('.project-title')?.textContent || '';
  const tagsHtml = cardElement.querySelector('.project-tags')?.innerHTML || '';
  const descHtml = cardElement.querySelector('.project-desc')?.innerHTML || '';

  const numEl = document.getElementById('modalProjectNum');
  const areaEl = document.getElementById('modalProjectArea');
  const titleEl = document.getElementById('modalProjectTitle');
  const tagsEl = document.getElementById('modalProjectTags');
  const descEl = document.getElementById('modalProjectDesc');
  const mediaContainer = document.getElementById('modalProjectMedia');
  const closeBtn = modal.querySelector('.project-modal-close');

  if (numEl) numEl.textContent = num;
  if (areaEl) areaEl.textContent = area;
  if (titleEl) titleEl.textContent = title;
  if (tagsEl) tagsEl.innerHTML = tagsHtml;
  if (descEl) descEl.innerHTML = descHtml;

  // Carga de imágenes (galería múltiple o imagen individual)
  let images = [];
  const imagesData = cardElement.getAttribute('data-images');
  if (imagesData) {
    try {
      images = JSON.parse(imagesData);
    } catch (e) {
      console.warn('Error al parsear data-images del proyecto:', e);
    }
  }

  if (images.length === 0) {
    const singleThumb = cardElement.querySelector('.project-thumb-img');
    if (singleThumb && singleThumb.src) {
      images = [{
        src: singleThumb.src,
        fallback: singleThumb.getAttribute('src') || '',
        alt: singleThumb.alt || title,
        title: title,
        caption: area
      }];
    }
  }

  currentProjectImages = images;
  currentProjectImageIndex = 0;

  const prevBtn = document.getElementById('projectSliderPrevBtn');
  const nextBtn = document.getElementById('projectSliderNextBtn');
  const sliderFooter = document.getElementById('projectSliderFooter');
  const dotsContainer = document.getElementById('projectGalleryDots');

  if (images.length > 0 && mediaContainer) {
    mediaContainer.style.display = 'block';

    if (images.length > 1) {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
      if (sliderFooter) sliderFooter.style.display = 'flex';

      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        images.forEach((item, idx) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `gallery-dot ${idx === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Imagen ${idx + 1}: ${item.title || title}`);
          dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
          dot.setAttribute('role', 'tab');
          dot.addEventListener('click', () => goToProjectPhoto(idx));
          dotsContainer.appendChild(dot);
        });
      }
    } else {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (sliderFooter) {
        if (images[0].caption || images[0].title) {
          sliderFooter.style.display = 'flex';
          const capTitle = document.getElementById('projectCaptionTitle');
          const capSub = document.getElementById('projectCaptionSub');
          const counter = document.getElementById('projectGalleryCounter');
          if (capTitle) capTitle.textContent = images[0].title || '';
          if (capSub) capSub.textContent = images[0].caption || '';
          if (counter) counter.textContent = '1 / 1';
          if (dotsContainer) dotsContainer.innerHTML = '';
        } else {
          sliderFooter.style.display = 'none';
        }
      }
    }

    renderProjectPhoto(0, false);
  } else if (mediaContainer) {
    mediaContainer.style.display = 'none';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (closeBtn) closeBtn.focus();

  if (!history.state || history.state.modal !== 'project') {
    history.pushState({ modal: 'project' }, '', '#proyecto');
  }
}

function closeProjectModal(fromPopState = false) {
  const modal = document.getElementById('projectModal');
  if (modal && modal.classList.contains('open')) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (!fromPopState && history.state && history.state.modal === 'project') {
      history.back();
    }
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }
}

// Soporte nativo para el botón 'Atrás' del celular o navegador
window.addEventListener('popstate', () => {
  const photoModal = document.getElementById('photoModal');
  if (photoModal && photoModal.classList.contains('open')) {
    closePhotoModal(true);
  }
  const projectModal = document.getElementById('projectModal');
  if (projectModal && projectModal.classList.contains('open')) {
    closeProjectModal(true);
  }
});

// Focus trap dentro de modales para accesibilidad WCAG por teclado
document.addEventListener('keydown', (e) => {
  const activeModal = document.querySelector('.photo-modal-backdrop.open, .project-modal-backdrop.open');
  if (!activeModal) {
    return;
  }

  if (e.key === 'Escape') {
    closePhotoModal();
    closeProjectModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
    return;
  }

  // Navegación por teclado dentro de la galería de perfil (flechas izquierda / derecha)
  const photoModal = document.getElementById('photoModal');
  if (photoModal && photoModal.classList.contains('open')) {
    if (e.key === 'ArrowRight') {
      nextGalleryPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevGalleryPhoto();
    }
  }

  // Navegación por teclado dentro del modal de proyecto (flechas izquierda / derecha)
  const projectModal = document.getElementById('projectModal');
  if (projectModal && projectModal.classList.contains('open') && currentProjectImages.length > 1) {
    if (e.key === 'ArrowRight') {
      nextProjectPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevProjectPhoto();
    }
  }
});

// Soporte de gestos táctiles (Swipe / deslizar con el dedo) en móvil para la galería de perfil
let touchStartX = 0;
let touchStartY = 0;

function setupGalleryTouchGestures() {
  const container = document.getElementById('photoSliderContainer');
  if (!container) return;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Si el gesto es horizontal y supera 40px de umbral
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextGalleryPhoto(); // Deslizar hacia la izquierda avanza
      } else {
        prevGalleryPhoto(); // Deslizar hacia la derecha retrocede
      }
    }
  }, { passive: true });
}

// Soporte de gestos táctiles (Swipe / deslizar con el dedo) en móvil para el carrusel del proyecto
function setupProjectTouchGestures() {
  const container = document.getElementById('projectSliderWrapper');
  if (!container) return;

  let pTouchStartX = 0;
  let pTouchStartY = 0;

  container.addEventListener('touchstart', (e) => {
    pTouchStartX = e.touches[0].clientX;
    pTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!currentProjectImages || currentProjectImages.length <= 1) return;
    const diffX = e.changedTouches[0].clientX - pTouchStartX;
    const diffY = e.changedTouches[0].clientY - pTouchStartY;

    // Si el gesto es horizontal y supera 35px de umbral
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        nextProjectPhoto(); // Deslizar hacia la izquierda avanza a la siguiente imagen
      } else {
        prevProjectPhoto(); // Deslizar hacia la derecha retrocede a la anterior imagen
      }
    }
  }, { passive: true });
}

// Inicialización de accesibilidad y eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  setupGalleryTouchGestures();
  setupProjectTouchGestures();

  const clickableCards = document.querySelectorAll('.clickable-card');
  clickableCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card);
      }
    });
  });
});

// Resiliencia de red: detección de estado online/offline para el stand
window.addEventListener('offline', () => {
  showToast('Modo sin conexión: visualizando contenido local');
});

window.addEventListener('online', () => {
  showToast('✓ Conexión restablecida');
});
