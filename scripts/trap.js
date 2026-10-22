/* The trap, driven by scrolling and by a button.
   ───────────────────────────────────────────────────────────────────────────
   As the diagram travels up the screen the four nodes light one after
   another; once all four are lit and it keeps travelling, the loop turns
   into the way out by itself. The button does the same thing in one tap,
   and once someone has tapped, scrolling stops driving it until the diagram
   has left the screen. Reduced motion: every node lit at once, no auto-flip. */
(function () {
  var fig = document.querySelector('.trap__fig');
  var svg = fig && fig.querySelector('.trap');
  if (!svg) return;

  var nodes = svg.querySelectorAll('.trap__node');
  var centre = svg.querySelector('.trap__c');
  var caption = fig.querySelector('figcaption');
  var btn = document.getElementById('trap-btn');
  var marks = fig.querySelectorAll('.trap__progress span');
  if (!btn || nodes.length !== 4) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var OUT = [
    ['Makes the inputs', 'on the farm'],
    ['Soil recovers,', 'needs less', 'each year'],
    ['Yields steady,', 'no residue'],
    ['Price fixed', 'before sowing,', 'paid at the scale']
  ];
  var orig = [];
  nodes.forEach(function (n) {
    orig.push([].map.call(n.querySelectorAll('text'), function (t) { return t.textContent; }));
  });
  var origCentre = centre.textContent;
  var origCaption = caption.textContent;
  var out = false;
  var manual = false;

  function setLines(node, lines) {
    node.querySelectorAll('text').forEach(function (t, i) { t.textContent = lines[i] || ''; });
  }
  function light(count) {
    nodes.forEach(function (n, i) { n.classList.toggle('is-lit', i < count); });
    marks.forEach(function (m, i) { m.classList.toggle('is-lit', i < count); });
  }
  function setOut(v) {
    out = v;
    svg.classList.toggle('trap--out', out);
    fig.classList.toggle('is-out', out);
    nodes.forEach(function (n, i) { setLines(n, out ? OUT[i] : orig[i]); });
    centre.textContent = out ? 'Way out' : origCentre;
    caption.textContent = out
      ? 'Change only the first step and the loop keeps turning \u2014 the other way. This is what we buy into when we commit to a harvest.'
      : origCaption;
    btn.textContent = out ? 'Show the trap again' : 'Break the loop';
    btn.setAttribute('aria-pressed', String(out));
    if (out) light(4);
  }

  btn.addEventListener('click', function () {
    manual = true;
    setOut(!out);
    if (!out) light(0);
  });

  if (reduce) { light(4); return; }

  /* 0 as the diagram enters at the foot of the screen, 1 as it leaves the top. */
  function progress() {
    var r = svg.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return (h - r.top) / (h + r.height);
  }
  var STEPS = [0.22, 0.34, 0.46, 0.58], FLIP = 0.72;
  function drive() {
    var p = progress();
    if (p < 0 || p > 1) { manual = false; return; }   /* off screen: re-arm */
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
  setInterval(drive, 200);   /* for browsers that deliver no scroll events on programmatic scrolls */
  drive();
})();
