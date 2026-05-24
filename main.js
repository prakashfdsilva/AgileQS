import './style.css';

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), 2200);
  // Duplicate marquee rows for seamless loop
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
  fx += (mx - fx) * 0.25; fy += (my - fy) * 0.25;
  if (cursor) cursor.style.transform = `translate(${cx - 10}px,${cy - 10}px)`;
  if (follower) follower.style.transform = `translate(${fx - 4}px,${fy - 4}px)`;
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.service-card,.story-card,.contact-item,.method-step').forEach(el => {
  el.addEventListener('mouseenter', () => { if (cursor) { cursor.style.width = '36px'; cursor.style.height = '36px'; cursor.style.borderColor = '#E8941A'; }});
  el.addEventListener('mouseleave', () => { if (cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.borderColor = '#E8941A'; }});
});

// ── PARTICLES ──
const pEl = document.getElementById('particles');
if (pEl) {
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
    // Mix blue and orange particles
    p.style.background = Math.random() > 0.5 ? '#E8941A' : '#2563EB';
    pEl.appendChild(p);
  }
}

// ── NAVBAR ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  // Parallax hero
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const s = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    s[1].style.opacity = '0';
    s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    s[0].style.transform = 'none'; s[1].style.opacity = '1'; s[2].style.transform = 'none';
  }
});
window.closeMobile = () => {
  mobileMenu?.classList.remove('open');
  const s = hamburger?.querySelectorAll('span');
  if (s) { s[0].style.transform = 'none'; s[1].style.opacity = '1'; s[2].style.transform = 'none'; }
};

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el, suffix) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const inc = target / 50;
  const timer = setInterval(() => {
    current += inc;
    if (current >= target) { current = target; clearInterval(timer); }
    el.innerHTML = Math.floor(current) + `<span>${suffix}</span>`;
  }, 30);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const suffix = e.target.querySelector('span')?.textContent || '';
      animateCounter(e.target, suffix);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target],.eval-percent[data-target]').forEach(el => counterObs.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── METHODOLOGY TABS ──
const methodDescs = [
  'GAP Assessment exercise helps determine the level of controls implemented in the organisation. A report is prepared to identify the area to be analyzed and identify the goals to be accomplished.',
  'Documentation as per standards/compliances help ensure consent and expectations. It helps to tell the narrative for decisions made, and how you or the client responded to different situations.',
  'Implementation is the process of executing a plan or policy so that a concept becomes a reality. To implement a plan properly, organisation should communicate clear goals and expectations, and supply employees with the resources needed to help the company achieve its goals.',
  'The purpose of auditing internally is to provide insight into an organization\'s policies, procedures, and aids board and management oversight by verifying internal controls such as operating effectiveness, risk mitigation and compliance with any relevant laws or regulations.',
  'Corrective action aims to rectify a task, process, product, or even a person\'s behavior when any of these factors produce errors or have deviated from an intended plan. Corrective actions can be thought of as improvements to an organization to eliminate undesirable effects.',
  'A Management Review is a formal, structured meeting which involves top management and takes place at regular intervals throughout the year. The purpose of a Management Review meeting is to review and evaluate the effectiveness of the Management System, helping you to determine its continued suitability and adequacy.',
  'As the name suggests, continuous improvement (CI) is an ongoing effort to improve products, processes, or services by reducing waste or increasing quality. This continuous effort drives a competitive advantage for organizations that get it right but, as with many things in life, consistency is not easy to achieve.'
];
document.querySelectorAll('.method-step').forEach(step => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.method-step').forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    const desc = document.getElementById('methodDesc');
    if (desc) {
      desc.style.opacity = '0';
      setTimeout(() => {
        desc.querySelector('p').textContent = methodDescs[parseInt(step.dataset.step)];
        desc.style.opacity = '1';
      }, 200);
    }
  });
});

// ── TESTIMONIAL SLIDER ──
let testIdx = 0;
const track = document.getElementById('testimonialTrack');
const totalTests = track ? track.children.length : 0;
function slideTest(dir) {
  testIdx = (testIdx + dir + totalTests) % totalTests;
  if (track) track.style.transform = `translateX(-${testIdx * 100}%)`;
}
document.getElementById('prevTest')?.addEventListener('click', () => slideTest(-1));
document.getElementById('nextTest')?.addEventListener('click', () => slideTest(1));
// Auto-slide
setInterval(() => slideTest(1), 5000);

// ── SERVICE FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.service-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn-primary,.btn-secondary,.nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.12}px,${y * 0.12}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// ── TILT ON SERVICE CARDS ──
document.querySelectorAll('.service-card,.story-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
  });
});
