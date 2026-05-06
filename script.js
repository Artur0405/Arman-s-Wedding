/* =========================================================
   ARMAN & ELEN — Moonshine clone behaviors
   ========================================================= */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* -------------------- COVER OPEN -------------------- */
  const cover     = $('#cover');
  const coverCard = $('#coverCard');
  const body      = document.body;

  /* -------------------- BACKGROUND MUSIC --------------------
     Audio instance is created up-front (preload='auto') so the file is
     buffered while the user looks at the cover. Playback is started
     inside openCover() — that runs synchronously inside the click /
     keydown / scroll user-gesture handlers, which satisfies mobile
     autoplay policies. Loop + ~50% volume per spec. */
  const bgm = new Audio('assets/music/music.mp3');
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.preload = 'auto';
  // Some mobile browsers respect this hint to keep playback non-disruptive
  bgm.setAttribute('playsinline', '');

  function openCover() {
    if (!cover || cover.classList.contains('is-open')) return;
    cover.classList.add('is-open');
    body.classList.remove('locked');
    // Start music in lockstep with the zoom animation. .play() returns a
    // Promise that may reject if no user gesture is in scope (e.g. when
    // openCover is invoked from the ?open / ?seeall / ?qa dev helpers);
    // we swallow that rejection so it never throws.
    if (bgm.paused) {
      const p = bgm.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }

  if (coverCard) {
    coverCard.addEventListener('click', openCover);
    coverCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCover(); }
    });
  }

  // dev helper: ?open auto-opens (used for visual verification)
  if (location.search.includes('open')) {
    setTimeout(openCover, 200);
  }
  // dev helper: ?seeall force-reveals all elements + opens cover
  if (location.search.includes('seeall')) {
    setTimeout(() => {
      openCover();
      $$('.reveal-parent, .reveal').forEach((el) => el.classList.add('is-in'));
    }, 300);
  }
  // dev helper: ?qa — "seeall" + force the cover to its intrinsic 700px so
  // a tall headless viewport can capture every section below it in one shot.
  if (location.search.includes('qa')) {
    document.documentElement.classList.add('qa-mode');
    setTimeout(() => {
      openCover();
      $$('.reveal-parent, .reveal').forEach((el) => el.classList.add('is-in'));
    }, 200);
  }

  // Safety fallback: if user scrolls before clicking, also open.
  let scrollOnce = false;
  window.addEventListener('wheel', () => {
    if (scrollOnce) return;
    scrollOnce = true;
    openCover();
  }, { passive: true, once: true });
  window.addEventListener('touchmove', () => {
    if (scrollOnce) return;
    scrollOnce = true;
    openCover();
  }, { passive: true, once: true });


  /* -------------------- LETTER SPLIT (RSVP heading) --------------------
     Wrap each character of .rsvp__head in a <span class="letter"> with a
     CSS custom property --i so the stylesheet can stagger per-letter
     fade-in. Pure animation enhancement; no layout/visual change.       */
  $$('.rsvp__head').forEach((el) => {
    if (el.dataset.split === '1') return;
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.setProperty('--i', i);
      // preserve spaces visually (non-breaking) so inline-block doesn't collapse
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      // a11y: keep the original word readable to screen readers
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    });
    el.setAttribute('aria-label', text);
    el.dataset.split = '1';
  });


  /* -------------------- REVEAL ON SCROLL -------------------- */
  // Two patterns: parents (.reveal-parent) reveal all .reveal children;
  // standalone .reveal elements reveal individually.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.18 });

  $$('.reveal-parent, .reveal').forEach((el) => io.observe(el));


  /* -------------------- COUNTDOWN -------------------- */
  // Wedding date: 23 July 2026, 14:00 Yerevan time (UTC+4)
  const TARGET = new Date('2026-07-23T14:00:00+04:00').getTime();

  const cd = {
    d: $('[data-cd="d"]'),
    h: $('[data-cd="h"]'),
    m: $('[data-cd="m"]'),
    s: $('[data-cd="s"]'),
  };

  function pad(n, len) { return String(Math.max(0, Math.floor(n))).padStart(len, '0'); }

  function tickCountdown() {
    const now = Date.now();
    let diff = TARGET - now;
    if (diff < 0) diff = 0;

    const day = Math.floor(diff / 86400000);
    const hr  = Math.floor(diff / 3600000)  % 24;
    const mi  = Math.floor(diff / 60000)    % 60;
    const se  = Math.floor(diff / 1000)     % 60;

    if (cd.d) cd.d.textContent = pad(day, 3);
    if (cd.h) cd.h.textContent = pad(hr, 2);
    if (cd.m) cd.m.textContent = pad(mi, 2);
    if (cd.s) cd.s.textContent = pad(se, 2);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);


  /* -------------------- RSVP FORM -------------------- */
  const form = document.querySelector('#rsvpForm');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-CrNw1YggkOqEbPdML8VBooAkHwOuQbTGND8EaGL9MC19MKjlJdHMh7VrQRnf1POA/exec';

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]');
    const count = form.querySelector('input[name="count"]');
    const attend = form.querySelector('input[name="attend"]:checked');

    const sides = [...form.querySelectorAll('input[name="side"]:checked')]
      .map(item => item.value)
      .join(', ');

    if (!name.value.trim()) {
      name.focus();
      name.style.borderColor = '#ffb89c';
      setTimeout(() => name.style.borderColor = '', 1400);
      return;
    }

    if (!count.value.trim() || Number(count.value) < 1) {
      count.focus();
      count.style.borderColor = '#ffb89c';
      setTimeout(() => count.style.borderColor = '', 1400);
      return;
    }

    if (!attend) {
      alert('Խնդրում ենք ընտրել՝ կկարողանա՞ք ներկա գտնվել');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.value.trim());
    formData.append('count', count.value.trim());
    formData.append('attend', attend.value);
    formData.append('side', sides || 'Չի նշվել');

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    form.classList.add('is-sent');

    [...form.elements].forEach((el) => {
      el.disabled = true;
    });
  });
}
})();
