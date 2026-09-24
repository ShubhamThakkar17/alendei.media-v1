import '@fontsource-variable/oswald';
import '@fontsource-variable/inter';
import './styles/base.css';
import './styles/sections.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CASES } from './cases.js';

gsap.registerPlugin(ScrollTrigger);
window.__alendeiReady = true;

// Set to a form endpoint (e.g. Formspree) to POST enquiries; empty = open the visitor's email app.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'care@alendei.com';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
if (reduce) root.classList.add('no-motion');

/* ---------------------------------------------------------
   Smooth scroll
   --------------------------------------------------------- */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, force: true });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
}

/* ---------------------------------------------------------
   Text splitting
   --------------------------------------------------------- */
function splitText(el, { chars = true } = {}) {
  if (el.dataset.split) return $$(chars ? '.c' : '.w', el);
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          if (chars) {
            [...part].forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'c';
              c.textContent = ch;
              w.appendChild(c);
            });
          } else {
            w.textContent = part;
          }
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'BR') {
        walk(n);
      }
    });
  };
  walk(el);
  el.dataset.split = '1';
  return $$(chars ? '.c' : '.w', el);
}

/* ---------------------------------------------------------
   Nav + menu
   --------------------------------------------------------- */
const nav = $('[data-nav]');
const menu = $('[data-menu]');
const menuToggle = $('[data-menu-toggle]');
let lastY = 0;
function onScroll(y) {
  nav.classList.toggle('is-scrolled', y > 40);
  if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 500);
  lastY = y;
}
if (lenis) lenis.on('scroll', (e) => onScroll(e.scroll));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

const menuTl = gsap
  .timeline({ paused: true })
  .set(menu, { visibility: 'visible' })
  .fromTo(menu, { clipPath: 'circle(0% at calc(100% - 60px) 32px)' }, { clipPath: 'circle(150% at calc(100% - 60px) 32px)', duration: reduce ? 0.01 : 0.85, ease: 'power3.inOut' })
  .from('.menu__links a', { y: 70, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  .from('.menu__side > *', { y: 24, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'power3.out' }, '<');

function openMenu() {
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menu.setAttribute('aria-hidden', 'false');
  nav.classList.remove('is-hidden');
  lenis?.stop();
  menuTl.timeScale(1).play();
}
function closeMenu() {
  if (!document.body.classList.contains('menu-open')) return;
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  lenis?.start();
  menuTl.timeScale(1.8).reverse();
}
menuToggle.addEventListener('click', () => (document.body.classList.contains('menu-open') ? closeMenu() : openMenu()));
addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

// In-page links
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (a.dataset.prefill) {
      const msg = $('[data-contact-form] textarea[name="message"]');
      if (msg && !msg.value) msg.value = `Interested in: ${a.dataset.prefill}\n\n`;
    }
    scrollToTarget(target);
  })
);

/* ---------------------------------------------------------
   Hero: intro + rotating channel words + reel
   --------------------------------------------------------- */
const heroLetters = splitText($('[data-hero-letters]'));
const heroTitleWords = splitText($('[data-hero-title]'), { chars: false });
gsap.set(['.hero__top', '[data-reel-stage]'], { opacity: 1 });

if (!reduce) {
  gsap
    .timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 })
    .from('[data-hero-kicker]', { y: -24, opacity: 0, duration: 0.7 })
    .from(heroLetters, { yPercent: 70, scaleY: 0.2, opacity: 0, duration: 1.1, stagger: 0.065, ease: 'back.out(2.2)' }, '-=0.35')
    .fromTo('.hero__sticker', { '--pop': 0 }, { '--pop': 1, duration: 1.1, stagger: 0.12, ease: 'elastic.out(1, 0.5)' }, '-=0.6')
    .from(heroTitleWords, { y: 36, opacity: 0, rotate: 4, duration: 0.8, stagger: 0.05 }, '-=1.1')
    .from('[data-hero-sub]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('[data-hero-ctas] > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.6')
    .from('[data-reel-stage]', { opacity: 0, duration: 1.2 }, '-=1.2')
    .from('.hero__reel-ui', { y: 80, opacity: 0, duration: 1.2 }, '<0.2');
}

const rotItems = $$('[data-rotator] > span');
gsap.set(rotItems, { y: 0, yPercent: 105 });
gsap.set(rotItems[0], { yPercent: 0 });
if (!reduce) {
  let rot = 0;
  setInterval(() => {
    const cur = rotItems[rot];
    rot = (rot + 1) % rotItems.length;
    gsap.to(cur, { yPercent: -105, duration: 0.65, ease: 'power3.inOut' });
    gsap.fromTo(rotItems[rot], { yPercent: 105 }, { yPercent: 0, duration: 0.65, ease: 'power3.inOut' });
  }, 1700);
}

const heroVideo = $('[data-reel-video]');
if (reduce) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
} else {
  new IntersectionObserver(([en]) => (en.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause())).observe(heroVideo);
}

const mm = gsap.matchMedia();

if (!reduce) {
  // Circle grows into a full-bleed showreel while the stage is pinned (Agenius hero ring effect)
  const circle = $('[data-reel-circle]');
  const isSmall = () => innerWidth <= 760;
  const startR = () => (isSmall() ? Math.min(innerWidth * 0.42, innerHeight * 0.3) : Math.min(innerWidth * 0.31, innerHeight * 0.38));
  gsap
    .timeline({
      scrollTrigger: { trigger: '[data-reel-stage]', start: 'top top', end: '+=110%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    })
    .fromTo(circle, { '--r': () => `${startR()}px` }, { '--r': () => `${Math.hypot(innerWidth, innerHeight) / 2 + 10}px`, ease: 'power2.inOut', duration: 1 }, 0)
    .to('[data-rings]', { scale: 1.7, opacity: 0, ease: 'power1.in', duration: 0.8 }, 0)
    .to('.hero__reel-ui', { scale: 1.12, duration: 1 }, 0)
    .fromTo('.hero__reel-chip', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.6);
}

/* ---------------------------------------------------------
   Why Alendei exists — five vendors collapse into one roof
   --------------------------------------------------------- */
const vendors = $$('[data-vendor]');
const oneRoof = $('[data-one-roof]');
gsap.set(oneRoof, { xPercent: -50, yPercent: -50, scale: 0 });
if (reduce) {
  gsap.set(vendors, { opacity: 0 });
  gsap.set(oneRoof, { scale: 1 });
  gsap.set('[data-exists-resolve]', { opacity: 1 });
  gsap.set('[data-exists-line] span', { '--strike': '100%' });
} else {
  gsap
    .timeline({ scrollTrigger: { trigger: '[data-exists-pin]', start: 'top top', end: '+=160%', scrub: 1, pin: true, anticipatePin: 1 } })
    .from(vendors, { '--s': 0, opacity: 0, stagger: 0.08, duration: 0.35, ease: 'back.out(2)' })
    .to('[data-exists-line] span', { '--strike': '100%', duration: 0.3 }, '+=0.1')
    .to(vendors, { '--px': 0, '--py': 0, '--rot': '0deg', '--s': 0.35, duration: 0.6, stagger: 0.04, ease: 'power2.in' }, '+=0.1')
    .to(vendors, { opacity: 0, duration: 0.12 }, '-=0.12')
    .to(oneRoof, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.7)', startAt: { rotate: -120 } }, '-=0.1')
    .fromTo('[data-exists-resolve]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
    .to({}, { duration: 0.25 });
}

/* ---------------------------------------------------------
   Process — pinned step-through on desktop, tabs everywhere
   --------------------------------------------------------- */
const steps = $$('[data-step]');
const stepArts = $$('[data-step-art]');
const stepTabs = $$('[data-step-tab]');
const stepBar = $('[data-process-bar]');
let stepIdx = 0;
function setStep(i) {
  if (i === stepIdx) return;
  stepIdx = i;
  steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
  stepArts.forEach((s, k) => s.classList.toggle('is-active', k === i));
  stepTabs.forEach((t, k) => {
    t.classList.toggle('is-active', k === i);
    t.setAttribute('aria-selected', String(k === i));
  });
  stepBar.style.width = `${(i + 1) * 25}%`;
}
let processST = null;
stepTabs.forEach((tab, i) =>
  tab.addEventListener('click', () => {
    if (processST) scrollToTarget(processST.start + (processST.end - processST.start) * (i / 4 + 0.1));
    else setStep(i);
  })
);
if (!reduce) {
  mm.add('(min-width: 761px)', () => {
    processST = ScrollTrigger.create({
      trigger: '.process__card',
      start: 'center center',
      end: '+=220%',
      pin: '[data-process-pin]',
      anticipatePin: 1,
      onUpdate: (self) => setStep(Math.min(3, Math.floor(self.progress * 4))),
    });
    return () => (processST = null);
  });
  mm.add('(max-width: 760px)', () => {
    const id = setInterval(() => {
      const r = $('.process__card').getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) setStep((stepIdx + 1) % 4);
    }, 3600);
    return () => clearInterval(id);
  });
}

/* ---------------------------------------------------------
   Scroll reveals
   --------------------------------------------------------- */
$$('[data-reveal="chars"]').forEach((el) => {
  const chars = splitText(el);
  gsap.set(el, { visibility: 'visible' });
  if (reduce) return;
  gsap.from(chars, {
    y: '0.35em',
    scale: 0.3,
    rotate: () => gsap.utils.random(-28, 28),
    opacity: 0,
    duration: 0.9,
    ease: 'back.out(2)',
    stagger: 0.022,
    scrollTrigger: { trigger: el, start: 'top 86%' },
  });
});

if (reduce) {
  gsap.set('[data-reveal="up"]', { opacity: 1 });
} else {
  gsap.set('[data-reveal="up"]', { y: 60, opacity: 0 });
  ScrollTrigger.batch('[data-reveal="up"]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', overwrite: true, clearProps: 'transform' }),
  });

  $$('.sticker:not(.hero__sticker)').forEach((s) =>
    gsap.fromTo(s, { '--pop': 0 }, { '--pop': 1, duration: 1.1, delay: 0.25, ease: 'elastic.out(1, 0.45)', scrollTrigger: { trigger: s, start: 'top 92%' } })
  );

  $$('[data-vs-list]').forEach((ul, k) =>
    gsap.from(ul.children, { x: k ? 50 : -50, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: ul, start: 'top 80%' } })
  );

  $$('[data-speed]').forEach((el) =>
    gsap.to(el, { yPercent: () => parseFloat(el.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  );

  // Leadership quote lights up word by word
  const quote = $('[data-scrub-words]');
  gsap.fromTo(splitText(quote, { chars: false }), { opacity: 0.13 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: quote, start: 'top 82%', end: 'bottom 50%', scrub: true } });

  // Footer wordmark rises letter by letter
  const fw = $('[data-footer-word]');
  const fwChars = splitText(fw);
  fw.classList.add('is-split');
  gsap.from(fwChars, { yPercent: 70, opacity: 0, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: fw, start: 'top bottom', end: 'bottom 95%', scrub: 1 } });
}

$$('[data-float]').forEach((el, i) => el.style.setProperty('--fd', `${-i * 0.9}s`));

/* ---------------------------------------------------------
   Counters
   --------------------------------------------------------- */
$$('[data-count]').forEach((el) => {
  const end = Number(el.dataset.count);
  const fmt = (v) => Math.round(v).toLocaleString('en-IN');
  if (reduce) return (el.textContent = fmt(end));
  const obj = { v: 0 };
  el.textContent = '0';
  gsap.to(obj, { v: end, duration: 2.2, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(obj.v)), scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
});

/* ---------------------------------------------------------
   Sector tiles riding a sine wave (Agenius brand marquee)
   --------------------------------------------------------- */
(function wave() {
  const wrap = $('[data-wave]');
  const track = $('[data-wave-track]');
  const base = $$('.wave__tile', track);
  let tiles = base;
  let W, H, spacing, total, amp;
  const layout = () => {
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    spacing = base[0].offsetWidth + (W < 700 ? 14 : 26);
    while (spacing * tiles.length < W + spacing * 2) {
      base.forEach((t) => track.appendChild(t.cloneNode(true)));
      tiles = $$('.wave__tile', track);
    }
    total = spacing * tiles.length;
    amp = H * 0.2;
  };
  let offset = 0;
  let visible = true;
  const draw = () => {
    const k = (Math.PI * 2) / Math.max(W, 900);
    tiles.forEach((tile, i) => {
      let x = (((i * spacing - offset) % total) + total) % total - spacing;
      const cx = x + spacing / 2;
      const y = Math.sin(cx * k * 1.2) * amp;
      const slope = Math.cos(cx * k * 1.2) * amp * k * 1.2;
      tile.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.atan(slope) * 45}deg)`;
    });
  };
  layout();
  draw();
  addEventListener('resize', () => {
    layout();
    draw();
  });
  if (reduce) return;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(wrap);
  gsap.ticker.add((_, dt) => {
    if (!visible) return;
    const boost = lenis ? Math.min(Math.abs(lenis.velocity) * 0.08, 4) : 0;
    offset = (offset + dt * 0.07 * (1 + boost)) % total;
    draw();
  });
})();

/* ---------------------------------------------------------
   Marquees (ticker bands + testimonial rail): duplicate for seamless loops
   --------------------------------------------------------- */
[...$$('[data-band]'), $('.quotes__track')].forEach((track) => {
  track.innerHTML += track.innerHTML;
  [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true'));
});

/* ---------------------------------------------------------
   Media network radar
   --------------------------------------------------------- */
(function radar() {
  const svg = $('[data-radar-svg]');
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    parent.appendChild(n);
    return n;
  };
  const C = 250;
  const rings = [
    { r: 72, label: 'METRO', n: 4, off: 0.4 },
    { r: 126, label: 'TIER 1', n: 6, off: 0.1 },
    { r: 180, label: 'TIER 2', n: 8, off: 0.55 },
    { r: 234, label: 'TIER 3', n: 11, off: 0.2 },
  ];
  const ringEls = [];
  const nodes = [];
  rings.forEach(({ r, label, n, off }, ri) => {
    ringEls.push(el('circle', { cx: C, cy: C, r, class: 'radar__ring' }));
    el('text', { x: C, y: C - r + 15, 'text-anchor': 'middle', class: 'radar__label' }).textContent = label;
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2 + off + Math.sin(j * 7.3 + ri) * 0.18;
      // keep the label area at the top of each ring clear
      const fromTop = (a + Math.PI / 2 + Math.PI * 4) % (Math.PI * 2);
      if (Math.min(fromTop, Math.PI * 2 - fromTop) < 0.22) continue;
      nodes.push({ x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, ri, hot: (j + ri) % 3 === 0 });
    }
  });
  const arcs = [];
  const arcG = el('g', {});
  nodes
    .filter((nd) => nd.ri >= 1 && nd.hot)
    .forEach((nd, i) => {
      const mx = (C + nd.x) / 2;
      const my = (C + nd.y) / 2;
      const dx = nd.x - C;
      const dy = nd.y - C;
      const bend = i % 2 ? 0.28 : -0.28;
      const d = `M${C},${C} Q${mx - dy * bend},${my + dx * bend} ${nd.x},${nd.y}`;
      const p = el('path', { d, class: 'radar__arc' }, arcG);
      arcs.push(p);
      if (!reduce && i % 2 === 0) {
        const dot = el('circle', { r: 3, class: 'radar__signal' }, arcG);
        el('animateMotion', { dur: `${2.2 + (i % 3) * 0.6}s`, repeatCount: 'indefinite', path: d, begin: `${i * 0.35}s` }, dot);
      }
    });
  const nodeEls = [];
  nodes.forEach((nd, i) => {
    const g = el('g', {});
    if (nd.hot) {
      const pulse = el('circle', { cx: nd.x, cy: nd.y, r: 5, class: 'radar__pulse' }, g);
      pulse.style.animationDelay = `${(i % 7) * 0.37}s`;
    }
    el('circle', { cx: nd.x, cy: nd.y, r: nd.hot ? 5 : 3.2, class: `radar__node${nd.hot ? ' radar__node--hot' : ''}` }, g);
    nodeEls.push(g);
  });
  if (reduce) return;
  arcs.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  gsap
    .timeline({ scrollTrigger: { trigger: '[data-radar]', start: 'top 75%' } })
    .from(ringEls, { scale: 0, transformOrigin: '50% 50%', opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out' })
    .from('.radar__hq', { scale: 0, duration: 0.8, ease: 'back.out(2)' }, 0.1)
    .from(nodeEls, { scale: 0, transformOrigin: '50% 50%', opacity: 0, duration: 0.5, stagger: 0.025, ease: 'back.out(3)' }, 0.4)
    .to(arcs, { strokeDashoffset: 0, duration: 1.2, stagger: 0.06, ease: 'power2.inOut' }, 0.7);
})();

/* ---------------------------------------------------------
   Accordions (services + FAQ)
   --------------------------------------------------------- */
$$('[data-accordion]').forEach((acc) => {
  const items = [...acc.children];
  items.forEach((item) => {
    const btn = $('button[aria-expanded]', item);
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach((it) => {
        it.classList.remove('is-open');
        $('button[aria-expanded]', it).setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
      setTimeout(() => ScrollTrigger.refresh(), 620);
    });
  });
});

/* ---------------------------------------------------------
   Dialogs: showreel + case studies
   --------------------------------------------------------- */
const reelDlg = $('[data-reel-dialog]');
const reelFull = $('[data-reel-full]');
function openDialog(dlg) {
  dlg.showModal();
  lenis?.stop();
}
$$('dialog').forEach((dlg) => {
  dlg.addEventListener('close', () => {
    lenis?.start();
    if (dlg === reelDlg) reelFull.pause();
  });
  dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
});
$$('[data-close-dialog]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
$$('[data-open-reel]').forEach((b) =>
  b.addEventListener('click', () => {
    openDialog(reelDlg);
    reelFull.currentTime = 0;
    reelFull.play().catch(() => {});
  })
);

const caseDlg = $('[data-case-dialog]');
function openCase(key) {
  const c = CASES[key];
  if (!c) return;
  const img = $('[data-casebox-img]', caseDlg);
  img.src = c.img;
  img.alt = c.alt;
  $('[data-casebox-tag]', caseDlg).textContent = c.tag;
  $('[data-casebox-title]', caseDlg).textContent = c.title;
  const dl = $('[data-casebox-list]', caseDlg);
  dl.replaceChildren(
    ...c.rows.flatMap(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      return [dt, dd];
    })
  );
  openDialog(caseDlg);
}
$$('[data-open-case]').forEach((b) => b.addEventListener('click', () => openCase(b.dataset.openCase)));
$$('.case__media').forEach((m) => m.addEventListener('click', () => openCase(m.closest('[data-case]').dataset.case)));

/* ---------------------------------------------------------
   Custom "View" cursor over portfolio images
   --------------------------------------------------------- */
if (finePointer && !reduce) {
  const cur = $('[data-cursor-dot]');
  const label = $('span', cur);
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
  addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  $$('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      label.textContent = el.dataset.cursor;
      cur.classList.add('is-on');
    });
    el.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  });
}

/* ---------------------------------------------------------
   Contact form
   --------------------------------------------------------- */
const form = $('[data-contact-form]');
const status = $('[data-form-status]');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  $$('.field', form).forEach((f) => {
    const input = $('input, textarea', f);
    const bad = (input.required && !input.value.trim()) || (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    f.classList.toggle('is-invalid', bad);
    if (bad) ok = false;
  });
  status.className = 'form__status';
  if (!ok) {
    status.textContent = 'Please add your name, a valid email and a short message.';
    status.classList.add('is-err');
    return;
  }
  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(res.statusText);
      status.textContent = `Thanks ${data.name.split(' ')[0]} — our media planners will be in touch shortly.`;
      status.classList.add('is-ok');
      form.reset();
    } catch {
      status.textContent = `Something went wrong. Please email us at ${CONTACT_EMAIL}.`;
      status.classList.add('is-err');
    }
    return;
  }
  const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\n\n${data.message}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`New enquiry — ${data.name}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = `Thanks ${data.name.split(' ')[0]} — your email app should open with your brief. If not, write to ${CONTACT_EMAIL}.`;
  status.classList.add('is-ok');
});

/* ---------------------------------------------------------
   Keep trigger positions accurate once fonts/images settle
   --------------------------------------------------------- */
ScrollTrigger.sort();
document.fonts?.ready.then(() => ScrollTrigger.refresh());
addEventListener('load', () => ScrollTrigger.refresh());
