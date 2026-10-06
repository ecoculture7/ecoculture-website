/* Homepage household explorer: three tabs (Small / Medium / Large), each showing
   the starting basket, what it costs and where the money goes by category.
   Everything is computed from data/prices.js through ECO.calc. */
(function () {
  var ECO = window.ECO;
  var root = document.getElementById('explorer');
  if (!ECO || !ECO.calc || !root) return;

  var CAT_ORDER = ['atta', 'rice', 'dal', 'oil', 'spice'];
  var tiers = Object.keys(ECO.TIERS);
  var current = 'M';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  var tabs = el('div', 'tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Household size');
  var panel = el('div', 'explorer__panel');
  panel.setAttribute('role', 'tabpanel');
  panel.id = 'explorer-panel';
  panel.tabIndex = 0;

  var btns = {};
  tiers.forEach(function (t) {
    var b = el('button', 'tab');
    b.type = 'button';
    b.id = 'tab-' + t;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'explorer-panel');
    b.appendChild(el('span', 'tab__name', ECO.TIERS[t].label));
    b.appendChild(el('span', 'tab__who', ECO.TIERS[t].who));
    b.addEventListener('click', function () { select(t, false); });
    b.addEventListener('keydown', function (e) {
      var i = tiers.indexOf(t), n = null;
      if (e.key === 'ArrowRight') n = tiers[(i + 1) % tiers.length];
      if (e.key === 'ArrowLeft') n = tiers[(i + tiers.length - 1) % tiers.length];
      if (n) { e.preventDefault(); select(n, true); }
    });
    btns[t] = b;
    tabs.appendChild(b);
  });

  root.appendChild(tabs);
  root.appendChild(panel);

  function select(t, focus) {
    current = t;
    tiers.forEach(function (k) {
      btns[k].setAttribute('aria-selected', String(k === t));
      btns[k].tabIndex = k === t ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', 'tab-' + t);
    if (focus) btns[t].focus();
    draw(ECO.calc.tier(t), t);
  }

  function draw(d, t) {
    panel.textContent = '';

    var left = el('div', 'explorer__list');
    d.lines.forEach(function (l) {
      var row = el('div', 'doc__line');
      row.appendChild(el('span', null, l.sku.name));
      row.appendChild(el('span', null, ECO.calc.fmtQty(l.sku, l.qty) + ' · ' + inr(l.amount)));
      left.appendChild(row);
    });

    var right = el('div', 'explorer__side');
    var total = el('div', 'explorer__total');
    total.appendChild(el('span', 'explorer__totall', 'Each month'));
    total.appendChild(el('span', 'explorer__totalv', inr(d.total + d.fee)));
    right.appendChild(total);
    right.appendChild(el('p', 'small muted', Math.round(d.weight * 10) / 10 + ' kg of staples · ' +
      (d.fee ? inr(d.fee) + ' delivery' : 'free delivery')));

    /* Where the money goes: one stacked bar, a legend with the numbers beside it. */
    right.appendChild(el('p', 'explorer__cap', 'Where it goes'));
    var bar = el('div', 'stackbar');
    bar.setAttribute('role', 'img');
    var legend = el('ul', 'legend');
    var desc = [];
    CAT_ORDER.forEach(function (c) {
      if (!d.byCat[c]) return;
      var pct = Math.round(d.byCat[c] / d.total * 100);
      var seg = el('span', 'stackbar__seg stackbar__seg--' + c);
      seg.style.width = (d.byCat[c] / d.total * 100) + '%';
      bar.appendChild(seg);
      var li = el('li', 'legend__row');
      li.appendChild(el('span', 'legend__key stackbar__seg--' + c));
      li.appendChild(el('span', 'legend__name', ECO.calc.catTitles[c]));
      li.appendChild(el('span', 'legend__val', pct + '%'));
      legend.appendChild(li);
      desc.push(ECO.calc.catTitles[c] + ' ' + pct + '%');
    });
    bar.setAttribute('aria-label', 'Share of the basket by category: ' + desc.join(', '));
    right.appendChild(bar);
    right.appendChild(legend);

    var cta = el('a', 'btn btn--primary', 'Edit this basket in the builder');
    cta.href = '/build.html#' + t;
    right.appendChild(cta);
    right.appendChild(el('p', 'small muted', 'This is a preview. Add, remove or change any line in the builder.'));

    panel.appendChild(left);
    panel.appendChild(right);
  }

  select(current, false);
})();
