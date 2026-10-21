/* The trap, made clickable.
   One button swaps the loop from the trap to the way out: the same four
   positions, the first one changed, and every other one changed by it.
   That is the whole argument of the site in one tap. */
(function () {
  var fig = document.querySelector('.trap__fig');
  var svg = fig && fig.querySelector('.trap');
  if (!svg) return;

  var nodes = svg.querySelectorAll('.trap__node');
  var centre = svg.querySelector('.trap__c');
  var caption = fig.querySelector('figcaption');
  var btn = document.getElementById('trap-btn');
  if (!btn || nodes.length !== 4) return;

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

  function setLines(node, lines) {
    var ts = node.querySelectorAll('text');
    ts.forEach(function (t, i) { t.textContent = lines[i] || ''; });
  }

  btn.addEventListener('click', function () {
    out = !out;
    svg.classList.toggle('trap--out', out);
    nodes.forEach(function (n, i) { setLines(n, out ? OUT[i] : orig[i]); });
    centre.textContent = out ? 'Way out' : origCentre;
    caption.textContent = out
      ? 'Change only the first step and the loop keeps turning — the other way. This is what we buy into when we commit to a harvest.'
      : origCaption;
    btn.textContent = out ? 'Show the trap again' : 'Break the loop';
    btn.setAttribute('aria-pressed', String(out));
    svg.setAttribute('aria-label', out
      ? 'The way out: the farmer makes the inputs on the farm; the soil recovers and needs less each year; yields steady with no residue; the price is fixed before sowing and paid at the scale.'
      : '');
  });
})();
