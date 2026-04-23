// ===== Md Sohanur Rahman — Site Interactions =====

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ========== Typewriter ==========
const phrases = [
  'PhD Candidate · Computer Science @ UTSA',
  'LLM Trustworthiness · Hallucination Mitigation',
  'Medical NLP · Explainable AI · Multi-Agent Systems',
  'Researcher + 3 yrs Software Engineer',
  'Building AI that you can actually trust.'
];
const tw = document.getElementById('typewriter');
let pIdx = 0, cIdx = 0, deleting = false;

function tick() {
  const current = phrases[pIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(tick, 2200);
      return;
    }
  } else {
    tw.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(tick, deleting ? 32 : 55);
}
tick();

// ========== Nav: scroll state + mobile toggle ==========
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ========== Reveal on scroll ==========
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ========== Neural Network Canvas ==========
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');
let width, height, nodes = [];
const NODE_COUNT = window.innerWidth < 760 ? 45 : 90;
const MAX_DIST = 150;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => {
  resize();
  initNodes();
});

function initNodes() {
  nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6
    });
  }
}
initNodes();

const mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = -9999; mouse.y = -9999;
});

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;

    const dx = n.x - mouse.x, dy = n.y - mouse.y;
    const md = Math.sqrt(dx*dx + dy*dy);
    if (md < 120) {
      n.x += dx / md * 0.6;
      n.y += dy / md * 0.6;
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(124, 92, 255, 0.55)';
    ctx.fill();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < MAX_DIST) {
        const alpha = (1 - d / MAX_DIST) * 0.25;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(124, 92, 255, ${alpha})`);
        grad.addColorStop(0.5, `rgba(0, 212, 255, ${alpha})`);
        grad.addColorStop(1, `rgba(255, 92, 172, ${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();

// ========== Active nav link on scroll ==========
const sections = document.querySelectorAll('section[id]');
const linkMap = {};
navLinks.querySelectorAll('a').forEach(a => {
  const id = a.getAttribute('href').replace('#', '');
  linkMap[id] = a;
});

window.addEventListener('scroll', () => {
  const y = window.scrollY + 140;
  let active = null;
  sections.forEach(s => {
    if (s.offsetTop <= y) active = s.id;
  });
  Object.values(linkMap).forEach(a => a.style.color = '');
  if (active && linkMap[active]) {
    linkMap[active].style.color = 'var(--text)';
  }
}, { passive: true });
