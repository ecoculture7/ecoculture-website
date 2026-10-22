/* The loop, driven by scrolling and by a button.
   Four picture-cards run clockwise. As they travel up the screen they light
   one after another; past three-quarters of the way the loop turns into the
   way out by itself: captions change, and pictures too where an out-* image
   exists. The button does the same in one tap; after a tap, scrolling stops
   driving it until the loop has left the screen. */
(function () {
  var fig = document.querySelector('.trap__fig');
  var loop = document.getElementById('loop');
  if (!fig || !loop) return;

  var nodes = loop.querySelectorAll('.loop__node');
  var label = document.getElementById('trap-label');
  var caption = fig.querySelector('figcaption');
  var btn = document.getElementById('trap-btn');
  var marks = fig.querySelectorAll('.trap__progress span');
  if (!btn || !label || nodes.length !== 4) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var origLabel = label.textContent, origCaption = caption.textContent;
  var out = false, manual = false;

  /* each node remembers both captions and, if available, both pictures */
  var state = [].map.call(nodes, function (n) {
    var s = { cap: n.querySelector('.loop__cap'), trapText: '', outText: n.getAttribute('data-out'), outSrc: n.getAttribute('data-out-src'), outOk: false };
    s.trapText = s.cap.textContent;
    if (s.outSrc) { var probe = new Image(); probe.onload = function () { s.outOk = true; }; probe.src = s.outSrc; }
    return s;
  });

  function light(count) {
    nodes.forEach(function (n, i) { n.classList.toggle('is-lit', i < count); });
    marks.forEach(function (m, i) { m.classList.toggle('is-lit', i < count); });
  }
  function setOut(v) {
    out = v;
    loop.classList.toggle('loop--out', out);
    fig.classList.toggle('is-out', out);
    state.forEach(function (s, i) {
      s.cap.textContent = out ? s.outText : s.trapText;
      var img = nodes[i].querySelector('.tile__img');
      if (img && s.outOk) img.src = out ? s.outSrc : nodes[i].getAttribute('data-src');
    });
    label.textContent = out ? 'The way out \u00B7 the same four steps, turned' : origLabel;
    label.classList.toggle('is-out', out);
    caption.textContent = out
      ? 'Change only step 1 and the loop keeps turning \u2014 the other way. This is what we buy into when we commit to a harvest.'
      : origCaption;
    btn.querySelector('span').textContent = out ? 'Show the trap again' : 'Break the loop';
    var hint = fig.querySelector('.trap__hint');
    if (hint) hint.hidden = out;
    btn.setAttribute('aria-pressed', String(out));
    if (out) light(4);
  }

  btn.addEventListener('click', function () {
    manual = true;
    setOut(!out);
    if (!out) light(0);
  });

  if (reduce) { light(4); return; }

  function progress() {
    var r = loop.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return (h - r.top) / (h + r.height);
  }
  var STEPS = [0.22, 0.34, 0.46, 0.58], FLIP = 0.72;
  function drive() {
    var p = progress();
    if (p < 0 || p > 1) { manual = false; return; }
    if (manual) return;
    var lit = 0;
    STEPS.forEach(function (s) { if (p >= s) lit += 1; });
    if (p >= FLIP) { if (!out) setOut(true); }
    else { if (out) setOut(false); light(lit); }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { drive(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  setInterval(drive, 200);
  drive();
})();
