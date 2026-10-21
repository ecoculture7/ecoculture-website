/* Motion that carries meaning, nothing decorative.
   ───────────────────────────────────────────────────────────────────────────
   1. Sections and cards rise in as they enter the viewport.
   2. Figures count up from zero the first time they are seen.
   3. The timeline draws itself in.
   4. On the specimen report, tapping a line says why that line exists.

   Everything is visible without JavaScript: the hiding only begins once this
   file has run and added `js` to <html>. Visibility is decided by a plain
   bounding-box check on scroll (not IntersectionObserver, which some
   browsers fire late after a programmatic scroll), and a safety timer makes
   everything visible within three seconds no matter what. Anyone who has
   asked their device for reduced motion gets the end state at once. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Reveal set ───────────────────────────────────────────────────── */
  var groups = [
    'main > section .wrap > *',
    '.items > li', '.grid-3 > *', '.grid-2 > *', '.flow__item', '.tl__item',
    '.compare__row', '.lane', '.rule-note', '.figure'
  ];
  var pending = [];
  groups.forEach(function (sel) {
    var i = 0;
    document.querySelectorAll(sel).forEach(function (el) {
      if (pending.indexOf(el) !== -1 || el.closest('.hero') || el.closest('#reserve form')) return;
      pending.push(el);
      el.classList.add('reveal');
      el.style.setProperty('--d', Math.min(i * 60, 300) + 'ms');
      i += 1;
    });
  });

  /* ── 2. Count up ─────────────────────────────────────────────────────── */
  function countUp(el) {
    var txt = el.textContent.trim();
    var m = txt.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var pre = m[1], post = m[3], raw = m[2];
    var grouped = raw.indexOf(',') !== -1;
    var dec = (raw.split('.')[1] || '').length;
    var target = parseFloat(raw.replace(/,/g, ''));
    if (isNaN(target)) return;
    var t0 = null, dur = 900;
    function fmt(n) {
      var s = n.toFixed(dec);
      if (grouped) s = Number(s).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      return pre + s + post;
    }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }
  var figs = reduce ? [] : [].slice.call(document.querySelectorAll('.figure__n'));
  var tl = document.querySelector('.tl');

  /* ── The one check that drives 1, 2 and 3 ─────────────────────────────── */
  function inView(el, frac) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || root.clientHeight;
    return r.top < h * (1 - frac) && r.bottom > 0;
  }
  function check() {
    for (var i = pending.length - 1; i >= 0; i--) {
      if (inView(pending[i], 0.08)) { pending[i].classList.add('in'); pending.splice(i, 1); }
    }
    for (var j = figs.length - 1; j >= 0; j--) {
      if (inView(figs[j], 0.15)) { countUp(figs[j]); figs.splice(j, 1); }
    }
    if (tl && inView(tl, 0.2)) { tl.classList.add('tl--live'); tl = null; }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { check(); ticking = false; });
  }

  if (reduce) {
    pending.forEach(function (el) { el.classList.add('in'); });
    pending = [];
    if (tl) tl.classList.add('tl--live');
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll);
    check();
    /* Some embedded browsers deliver no scroll events for programmatic
       scrolls, so also poll, lightly, until there is nothing left to reveal. */
    var poll = setInterval(function () {
      check();
      if (!pending.length && !figs.length && !tl) clearInterval(poll);
    }, 200);
    /* Safety: nothing stays hidden, whatever the browser did with the events. */
    setTimeout(function () {
      pending.forEach(function (el) { el.classList.add('in'); });
      pending = [];
      if (tl) { tl.classList.add('tl--live'); tl = null; }
      clearInterval(poll);
    }, 3000);
  }

  /* ── 4. Why this line is on the report ────────────────────────────────── */
  var why = document.getElementById('doc-why');
  var lines = document.querySelectorAll('[data-why]');
  if (why && lines.length) {
    var hint = document.getElementById('doc-why-hint');
    function pick(line) {
      lines.forEach(function (l) { l.classList.toggle('is-active', l === line); l.setAttribute('aria-expanded', String(l === line)); });
      why.textContent = line.getAttribute('data-why');
      why.hidden = false;
      if (hint) hint.hidden = true;
    }
    lines.forEach(function (line) {
      line.setAttribute('role', 'button');
      line.setAttribute('tabindex', '0');
      line.setAttribute('aria-expanded', 'false');
      line.addEventListener('click', function () { pick(line); });
      line.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(line); }
      });
    });
  }
})();
