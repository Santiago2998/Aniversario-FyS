// ============================================
// Tú y yo — interacciones corregidas para Web e iPad
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initFloatingPetals();
  initLanterns();
  initEnvelope();
  initRose();
  initPetalModalClose();
  initScratchReveal();
  initLightbox();
  initTogetherCounter();
});

/* ---------- Pétalos flotando de fondo ---------- */
function initFloatingPetals() {
  const container = document.getElementById('floatingPetals');
  if (!container) return;

  const TOTAL = 16;
  for (let i = 0; i < TOTAL; i++) {
    const petal = document.createElement('div');
    const isSpark = Math.random() < 0.35;
    petal.className = isSpark ? 'drift drift--spark' : 'drift';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${10 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 12}s`;
    petal.style.opacity = (0.3 + Math.random() * 0.4).toFixed(2);
    petal.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    container.appendChild(petal);
  }
}

/* ---------- Faroles flotando (escena Rapunzel) ---------- */
function initLanterns() {
  const container = document.getElementById('lanterns');
  if (!container) return;

  const TOTAL = 10;
  for (let i = 0; i < TOTAL; i++) {
    const lantern = document.createElement('div');
    lantern.className = 'lantern';
    lantern.style.left = `${5 + Math.random() * 90}%`;
    lantern.style.animationDuration = `${6 + Math.random() * 5}s`;
    lantern.style.animationDelay = `${Math.random() * 8}s`;
    container.appendChild(lantern);
  }
}

/* ---------- Sobre animado: la carta sale al abrirlo ---------- */
function initEnvelope() {
  const wrap = document.getElementById('envelopeWrap');
  const hint = document.getElementById('envelopeHint');
  if (!wrap) return;

  wrap.setAttribute('tabindex', '0');
  wrap.setAttribute('role', 'button');
  wrap.setAttribute('aria-label', 'Toca el sobre para abrir la carta');

  const SETTLE_DELAY = 1250;

  const open = () => {
    if (wrap.classList.contains('opened')) return;
    wrap.classList.add('opened');
    hint?.classList.add('hidden');

    setTimeout(() => {
      wrap.classList.add('settled');
    }, SETTLE_DELAY);
  };

  wrap.addEventListener('click', open);
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

/* ---------- Rosa interactiva ---------- */
function initRose() {
  const scene = document.getElementById('roseScene');
  const counter = document.getElementById('petalCount');
  if (!scene) return;

  const PETAL_MESSAGES = {
    1: 'Te amo con todo mi ser, eres mi alegría en días tristes, y mi inspiración día tras día.',
    2: 'Este pétalo guarda cada cosa que aprendí contigo, pedir perdón, amar, relajarse, ser felíz. Gracias por quedarte a enseñarme a amarte cada vez más.',
    3: 'Este pétalo guarda todo lo que nos falta por vivir juntos, todavía nos falta mucho por vivir. Te elijo hoy y siempre mi amor.'
  };

  const petals = scene.querySelectorAll('.petal-outer');

  petals.forEach((petal) => {
    petal.setAttribute('tabindex', '0');
    petal.setAttribute('role', 'button');
    petal.setAttribute('aria-label', 'Pétalo mágico, tócalo para ver un mensaje');

    const trigger = () => {
      if (petal.classList.contains('falling')) return;

      petal.classList.add('falling');
      const vein = petal.parentElement?.querySelector('.petal-vein');
      vein?.classList.add('falling');
      showPetalMessage(PETAL_MESSAGES[petal.dataset.msg]);

      if (counter) {
        const stillUp = scene.querySelectorAll('.petal-outer:not(.falling)').length;
        counter.textContent = stillUp;
      }
    };

    petal.addEventListener('click', trigger);
    petal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });
}

function showPetalMessage(text) {
  const modal = document.getElementById('messageModal');
  const modalText = document.getElementById('messageModalText');
  if (!modal || !modalText) return;

  modalText.textContent = text;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function initPetalModalClose() {
  const modal = document.getElementById('messageModal');
  const closeBtn = document.getElementById('messageModalClose');
  if (!modal || !closeBtn) return;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Foto de Rapunzel: efecto de raspar ---------- */
function initScratchReveal() {
  const wrap = document.getElementById('scratchWrap');
  const canvas = document.getElementById('scratchCanvas');
  const img = document.getElementById('rapunzelImg');
  if (!wrap || !canvas || !img) return;

  const ctx = canvas.getContext('2d');
  let scratching = false;
  let revealed = false;

  function sizeCanvas() {
    // Forzamos un pequeño delay para asegurar que el navegador ya renderizó las dimensiones de la imagen
    setTimeout(() => {
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawOverlay();
    }, 200);
  }

  function drawOverlay() {
    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#f0cf8a');
    grad.addColorStop(0.5, '#d4af6a');
    grad.addColorStop(1, '#a97c3d');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.4 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = '600 16px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(58, 26, 10, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('Raspa para revelar ✨', w / 2, h / 2);
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2); // Aumentado a 28 para raspar más fácil en pantallas táctiles
    ctx.fill();
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function checkRevealPercent() {
    if (revealed || canvas.width === 0) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    const step = 80;

    for (let i = 3; i < data.length; i += step) {
      total++;
      if (data[i] < 40) cleared++;
    }

    if (total && cleared / total > 0.45) { // Bajado a 45% para evitar frustración en móviles
      revealed = true;
      wrap.classList.add('revealed');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (revealed) return;
    scratching = true;
    wrap.classList.add('scratching');
    canvas.setPointerCapture(e.pointerId);
    const p = getPos(e);
    scratchAt(p.x, p.y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!scratching || revealed) return;
    const p = getPos(e);
    scratchAt(p.x, p.y);
  });

  const stopScratching = (e) => {
    if (scratching) {
      scratching = false;
      wrap.classList.remove('scratching');
      try { canvas.releasePointerCapture(e.pointerId); } catch(err) {}
      checkRevealPercent();
    }
  };

  ['pointerup', 'pointerleave', 'pointercancel'].forEach((evt) => {
    canvas.addEventListener(evt, stopScratching);
  });

  if (img.complete) {
    sizeCanvas();
  } else {
    img.addEventListener('load', sizeCanvas);
  }
  
  window.addEventListener('resize', () => {
    if (!revealed) sizeCanvas();
  });
}

/* ---------- Mosaico + lightbox ---------- */
function initLightbox() {
  const grid = document.getElementById('mosaicGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  if (!grid || !lightbox || !lightboxImg || !closeBtn) return;

  grid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });

  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Contador de días juntos ---------- */
function initTogetherCounter() {
  const el = document.getElementById('togetherCounter');
  if (!el) return;

  // CORREGIDO: Cambiado a 2024 para coincidir con tu historia de otoño
  const START_DATE = new Date('2024-07-05T00:00:00');

  const today = new Date();
  const diffMs = today - START_DATE;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days >= 0) {
    el.textContent = `${days.toLocaleString('es-MX')} días juntos y contando`;
  }
}
