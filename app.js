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
 * Control del Modal de Foto Completa con sincronización de historial y focus trap
 */
function openPhotoModal(src = 'Media/1000728779.jpg', title = 'Juan Bautista García Thixton', sub = 'Bayer Argentina · Pasantía 2025–2027') {
  lastFocusedTrigger = document.activeElement;
  const modal = document.getElementById('photoModal');
  if (modal) {
    const img = modal.querySelector('.full-photo-img');
    const capTitle = modal.querySelector('.photo-caption-title');
    const capSub = modal.querySelector('.photo-caption-sub');
    const closeBtn = modal.querySelector('.photo-modal-close');

    if (img) img.src = src;
    if (capTitle) capTitle.textContent = title;
    if (capSub) capSub.textContent = sub;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

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
  const imgEl = cardElement.querySelector('.project-thumb-img');

  const numEl = document.getElementById('modalProjectNum');
  const areaEl = document.getElementById('modalProjectArea');
  const titleEl = document.getElementById('modalProjectTitle');
  const tagsEl = document.getElementById('modalProjectTags');
  const descEl = document.getElementById('modalProjectDesc');
  const mediaContainer = document.getElementById('modalProjectMedia');
  const modalImg = document.getElementById('modalProjectImg');
  const closeBtn = modal.querySelector('.project-modal-close');

  if (numEl) numEl.textContent = num;
  if (areaEl) areaEl.textContent = area;
  if (titleEl) titleEl.textContent = title;
  if (tagsEl) tagsEl.innerHTML = tagsHtml;
  if (descEl) descEl.innerHTML = descHtml;

  if (imgEl && imgEl.src && mediaContainer && modalImg) {
    modalImg.src = imgEl.src;
    modalImg.alt = imgEl.alt || title;
    mediaContainer.style.display = 'block';
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
  }
});

// Soporte de accesibilidad para presionar Enter o Barra espaciadora en las cards
document.addEventListener('DOMContentLoaded', () => {
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
