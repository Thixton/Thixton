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
