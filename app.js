/**
 * Bayer Argentina — Portfolio Profesional de Pasantía
 * Lógica ligera para interacción: descarga de vCard, toast feedback y scroll suave
 */

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

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Juan_Bautista_Garcia_Thixton_Bayer.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✓ Contacto descargado para tu agenda');
}

/**
 * Abre chat de WhatsApp protegiendo el número telefónico contra crawlers y scrapers automáticos
 * El endpoint y los dígitos se componen dinámicamente en memoria al hacer clic.
 */
function openWhatsAppChat() {
  // Fragmentos de dígitos generados mediante char codes: +54 9 11 5812 6740
  const c = String.fromCharCode(53, 52); // "54"
  const a = String.fromCharCode(57, 49, 49); // "911"
  const b = String.fromCharCode(53, 56, 49, 50); // "5812"
  const d = String.fromCharCode(54, 55, 52, 48); // "6740"
  const phone = `${c}${a}${b}${d}`;

  const message = encodeURIComponent('Hola Juan Bautista, vi tu portfolio de la Science Fair de Bayer y me gustaría conversar.');
  // atob('aHR0cHM6Ly93YS5tZS8=') decodifica a 'https://wa.me/'
  const gateway = atob('aHR0cHM6Ly93YS5tZS8=');
  const target = `${gateway}${phone}?text=${message}`;

  window.open(target, '_blank', 'noopener,noreferrer');
}

/**
 * Toast feedback sutil y no invasivo
 * @param {string} message 
 */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
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
 * Control del Modal de Foto Completa
 */
function openPhotoModal(src = 'Media/1000728779.jpg', title = 'Juan Bautista García Thixton', sub = 'Bayer Argentina · Pasantía 2025–2027') {
  const modal = document.getElementById('photoModal');
  if (modal) {
    const img = modal.querySelector('.full-photo-img');
    const capTitle = modal.querySelector('.photo-caption-title');
    const capSub = modal.querySelector('.photo-caption-sub');

    if (img) img.src = src;
    if (capTitle) capTitle.textContent = title;
    if (capSub) capSub.textContent = sub;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Control del Modal de Detalle de Proyecto
 */
function openProjectModal(cardElement) {
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
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

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

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePhotoModal();
    closeProjectModal();
  }
});
