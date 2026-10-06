/* Basket builder.
   ───────────────────────────────────────────────────────────────────────────
   Renders the whole builder into #builder from data/prices.js. There is no
   price, pack size, tier or delivery threshold in this file: change a number
   in data/prices.js and the builder follows.

   Quantities are held as a whole number of packs (`steps`), never as a float,
   so 3 × 0.1 kg can never become 0.30000000000000004 and no quantity the
   builder can produce is unbuyable.

   The category rule is never a blocking error. Emptying a required category
   shows why it matters and says so in the summary; editing carries on.
*/
(function () {
  var ECO = window.ECO;
  var root = document.getElementById('builder');
  if (!ECO || !ECO.SKUS || !ECO.calc || !root) return;

  var D = ECO.DELIVERY;
  var MAX_QTY = 50;   /* kg or L per line: a typo guard, not a business rule */

  var CATS = [
    { k: 'atta',  title: 'Atta',  req: true,  why: 'Every basket needs an atta so we can plan the wheat harvest.' },
    { k: 'rice',  title: 'Rice',  req: false },
    { k: 'dal',   title: 'Dal',   req: true,  why: 'Every basket needs at least one dal so we can plan the pulse harvest.' },
    { k: 'oil',   title: 'Oil',   req: true,  why: 'Every basket needs the mustard oil so we can plan the press.' },
    { k: 'spice', title: 'Spices', req: true, why: 'Every basket needs the spice pack so we can plan the grind.' }
  ];

  var state = { tier: 'M', steps: {}, months: 0 };
  var ui = { tiers: {}, rows: {}, notes: {}, groups: {} };

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function qtyOf(sku) { return Math.round(state.steps[sku.k] * sku.step * 1000) / 1000; }
  /* Half-up per line, which is how the starting-basket totals on /basket are
     reckoned. The epsilon keeps 149.5 from landing on 149. */
  function lineOf(sku) { return ECO.calc.line(sku, qtyOf(sku)); }
  function maxSteps(sku) { return Math.floor(MAX_QTY / sku.step); }

  function fmtQty(sku, q) {
    if (q < 1) return Math.round(q * 1000) + (sku.unit === 'L' ? ' ml' : ' g');
    return q + ' ' + sku.unit;
  }
  function fmtKg(n) { return (Math.round(n * 10) / 10) + ' kg'; }

  function loadTier(t) {
    var q = ECO.TIERS[t].q;
    state.tier = t;
    ECO.SKUS.forEach(function (s) { state.steps[s.k] = Math.round((q[s.k] || 0) / s.step); });
  }

  function deliveryFee(list) {
    if (list >= D.freeFrom) return 0;
    if (list >= D.midFrom) return D.midFee;
    return D.smallFee;
  }

  /* ── Build the page once ──────────────────────────────────────────────── */

  var left = el('div', 'builder__main');
  var side = el('aside', 'builder__side');
  side.id = 'summary';
  side.setAttribute('aria-label', 'Your basket');

  /* Tier choice */
  var tierBox = el('div', 'tiers');
  var tierLabel = el('p', 'tiers__label', 'Start from');
  tierLabel.id = 'tiers-label';
  var tierRow = el('div', 'tiers__row');
  tierRow.setAttribute('role', 'group');
  tierRow.setAttribute('aria-labelledby', 'tiers-label');
  Object.keys(ECO.TIERS).forEach(function (t) {
    var b = el('button', 'tier');
    b.type = 'button';
    b.appendChild(el('span', 'tier__name', ECO.TIERS[t].label));
    b.appendChild(el('span', 'tier__who', ECO.TIERS[t].who));
    b.addEventListener('click', function () { loadTier(t); render('Started from ' + ECO.TIERS[t].label + '.'); });
    ui.tiers[t] = b;
    tierRow.appendChild(b);
  });
  var tierHint = el('p', 'small muted tiers__hint');
  tierBox.appendChild(tierLabel);
  tierBox.appendChild(tierRow);
  tierBox.appendChild(tierHint);
  left.appendChild(tierBox);
  ui.tierHint = tierHint;

  /* Categories and rows */
  CATS.forEach(function (cat) {
    var g = el('section', 'bgroup');
    var head = el('div', 'bgroup__head');
    var h = el('h2', 'bgroup__title', cat.title);
    h.id = 'cat-' + cat.k;
    head.appendChild(h);
    head.appendChild(el('span', 'bgroup__req' + (cat.req ? '' : ' bgroup__req--opt'), cat.req ? 'Pick at least one' : 'Optional'));
    g.setAttribute('aria-labelledby', h.id);
    g.appendChild(head);

    var note = el('p', 'bnote');
    note.hidden = true;
    note.textContent = cat.why || '';
    g.appendChild(note);
    ui.notes[cat.k] = note;
    ui.groups[cat.k] = g;

    ECO.SKUS.filter(function (s) { return s.cat === cat.k; }).forEach(function (sku) {
      var row = el('div', 'brow');
      var info = el('div', 'brow__info');
      info.appendChild(el('span', 'brow__name', sku.name));
      info.appendChild(el('span', 'brow__hi', sku.hi));
      if (sku.note) info.appendChild(el('span', 'brow__note', sku.note));

      var ctl = el('div', 'brow__ctl');
      ctl.appendChild(el('div', 'brow__price', inr(sku.price) + ' / ' + sku.unit));

      var stepper = el('div', 'stepper');
      stepper.setAttribute('role', 'group');
      stepper.setAttribute('aria-label', sku.name + ' quantity');
      var minus = el('button', 'stepper__btn', '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Remove one pack of ' + sku.name);
      var out = el('span', 'stepper__qty');
      var plus = el('button', 'stepper__btn', '+');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Add one pack of ' + sku.name);

      minus.addEventListener('click', function () {
        if (state.steps[sku.k] > 0) { state.steps[sku.k] -= 1; render(); }
      });
      plus.addEventListener('click', function () {
        if (state.steps[sku.k] < maxSteps(sku)) { state.steps[sku.k] += 1; render(); }
      });

      stepper.appendChild(minus);
      stepper.appendChild(out);
      stepper.appendChild(plus);
      ctl.appendChild(stepper);

      row.appendChild(info);
      row.appendChild(ctl);
      g.appendChild(row);
      ui.rows[sku.k] = { row: row, out: out, minus: minus, plus: plus };
    });
    left.appendChild(g);
  });

  /* Summary */
  var doc = el('div', 'card card--document');
  var docHead = el('div', 'doc__head');
  docHead.appendChild(el('span', 'doc__title', 'Your basket'));
  ui.weight = el('span', 'doc__ref');
  docHead.appendChild(ui.weight);
  doc.appendChild(docHead);

  ui.lines = el('div', 'bsum__lines');
  doc.appendChild(ui.lines);

  var totals = el('div', 'bsum__totals');
  function totalRow(label) {
    var r = el('div', 'bsum__row');
    var a = el('span', null, label);
    var b = el('span');
    r.appendChild(a); r.appendChild(b);
    totals.appendChild(r);
    return { row: r, label: a, val: b };
  }
  ui.listRow = totalRow('Basket');
  ui.delRow  = totalRow('Delivery');
  var perMonth = el('div', 'bsum__big');
  perMonth.appendChild(el('span', 'bsum__bigl', 'Each month'));
  ui.perMonth = el('span', 'bsum__bigv');
  perMonth.appendChild(ui.perMonth);
  totals.appendChild(perMonth);
  doc.appendChild(totals);

  /* Progress to free delivery */
  var prog = el('div', 'bprog');
  var progTop = el('div', 'bprog__top');
  ui.progLabel = el('span');
  ui.progState = el('span', 'bprog__state');
  progTop.appendChild(ui.progLabel);
  progTop.appendChild(ui.progState);
  var track = el('div', 'bprog__track');
  ui.progBar = el('div', 'bprog__bar');
  track.appendChild(ui.progBar);
  prog.appendChild(progTop);
  prog.appendChild(track);
  doc.appendChild(prog);

  /* Prepay */
  var fs = el('fieldset', 'prepay');
  fs.appendChild(el('legend', 'prepay__legend', 'Pay ahead?'));
  var opts = [{ months: 0, discount: 0 }].concat(ECO.PREPAY);
  opts.forEach(function (o) {
    var lab = el('label', 'prepay__opt');
    var inp = document.createElement('input');
    inp.type = 'radio';
    inp.name = 'prepay';
    inp.value = String(o.months);
    inp.checked = o.months === state.months;
    inp.addEventListener('change', function () { state.months = o.months; render(); });
    lab.appendChild(inp);
    lab.appendChild(el('span', 'prepay__t', o.months ? o.months + ' months' : 'Month by month'));
    lab.appendChild(el('span', 'prepay__d', o.months ? Math.round(o.discount * 100) + '% off' : 'list price'));
    fs.appendChild(lab);
  });
  doc.appendChild(fs);
  ui.prepayResult = el('p', 'bnote bnote--ok');
  ui.prepayResult.hidden = true;
  doc.appendChild(ui.prepayResult);

  /* Status — the quiet category rule, announced politely */
  ui.status = el('p', 'bstatus');
  ui.status.setAttribute('role', 'status');
  doc.appendChild(ui.status);

  var cta = el('a', 'btn btn--primary bsum__cta', 'Reserve a December trial pack');
  cta.href = 'index.html#reserve';
  doc.appendChild(cta);
  doc.appendChild(el('p', 'small muted bsum__fine', 'No payment now. Delivery is read on the list price, before any prepayment discount.'));

  side.appendChild(doc);

  root.appendChild(left);
  root.appendChild(side);

  /* Compact total bar for phones, where the summary sits far below the list */
  var bar = el('a', 'buildbar');
  bar.href = '#summary';
  ui.barLabel = el('span', 'buildbar__l');
  ui.barTotal = el('span', 'buildbar__t');
  bar.appendChild(ui.barLabel);
  bar.appendChild(ui.barTotal);
  document.body.appendChild(bar);
  document.body.classList.add('has-buildbar');

  /* ── Render ───────────────────────────────────────────────────────────── */

  function render(announce) {
    var list = 0, weight = 0, missing = [];

    ECO.SKUS.forEach(function (sku) {
      var r = ui.rows[sku.k];
      var q = qtyOf(sku);
      list += lineOf(sku);
      weight += q;
      r.out.textContent = q ? fmtQty(sku, q) : 'None';
      r.row.classList.toggle('brow--on', q > 0);
      r.minus.disabled = state.steps[sku.k] <= 0;
      r.plus.disabled = state.steps[sku.k] >= maxSteps(sku);
    });

    CATS.forEach(function (cat) {
      var has = ECO.SKUS.some(function (s) { return s.cat === cat.k && state.steps[s.k] > 0; });
      var gap = cat.req && !has;
      ui.notes[cat.k].hidden = !gap;
      if (gap) missing.push(cat.title.toLowerCase());
    });

    /* Tier chips */
    var edited = false;
    Object.keys(ECO.TIERS).forEach(function (t) {
      var q = ECO.TIERS[t].q;
      var same = ECO.SKUS.every(function (s) { return state.steps[s.k] === Math.round((q[s.k] || 0) / s.step); });
      if (same) { state.tier = t; }
    });
    var tq = ECO.TIERS[state.tier].q;
    edited = !ECO.SKUS.every(function (s) { return state.steps[s.k] === Math.round((tq[s.k] || 0) / s.step); });
    Object.keys(ui.tiers).forEach(function (t) {
      ui.tiers[t].setAttribute('aria-pressed', String(t === state.tier && !edited));
    });
    ui.tierHint.textContent = edited
      ? 'Started from ' + ECO.TIERS[state.tier].label + ', then edited. Tap a size to start again.'
      : 'Every quantity in these baskets is a whole pack, so each can be ordered exactly as shown.';

    /* Lines */
    ui.lines.textContent = '';
    ECO.SKUS.forEach(function (sku) {
      var q = qtyOf(sku);
      if (!q) return;
      var l = el('div', 'doc__line');
      l.appendChild(el('span', null, sku.name));
      l.appendChild(el('span', null, fmtQty(sku, q) + ' · ' + inr(lineOf(sku))));
      ui.lines.appendChild(l);
    });
    if (!ui.lines.firstChild) ui.lines.appendChild(el('p', 'small muted', 'Nothing in the basket yet. Tap a size above, or add items from the list.'));

    ui.weight.textContent = fmtKg(weight).toUpperCase();

    /* Totals */
    var fee = list ? deliveryFee(list) : 0;
    ui.listRow.val.textContent = inr(list);
    ui.delRow.val.textContent = !list ? '—' : (fee ? inr(fee) : 'Free');
    ui.delRow.val.classList.toggle('bsum__free', list > 0 && fee === 0);
    ui.perMonth.textContent = inr(list + fee);

    /* Progress to free delivery, read on the list price */
    var pct = Math.min(100, Math.round((list / D.freeFrom) * 100));
    ui.progBar.style.width = pct + '%';
    ui.progLabel.textContent = 'Free delivery at ' + inr(D.freeFrom);
    ui.progState.textContent = list >= D.freeFrom ? 'Reached' : inr(D.freeFrom - list) + ' to go';
    ui.progState.classList.toggle('bprog__state--on', list >= D.freeFrom);

    /* Prepay */
    var opt = null;
    ECO.PREPAY.forEach(function (o) { if (o.months === state.months) opt = o; });
    if (opt && list) {
      var full = list * opt.months;
      var pay = Math.round(full * (1 - opt.discount));
      ui.prepayResult.textContent = 'Pay ' + inr(pay) + ' now for ' + opt.months + ' months of basket — you keep ' + inr(full - pay) + '. Delivery is charged on each drop.';
      ui.prepayResult.hidden = false;
    } else {
      ui.prepayResult.hidden = true;
    }

    /* Status line */
    var msg;
    if (!list) msg = 'Add something to begin.';
    else if (missing.length) msg = 'To complete the basket, add ' + missing.join(', ') + '.';
    else msg = 'Every required category is covered.';
    ui.status.textContent = msg;
    ui.status.classList.toggle('bstatus--gap', !!(list && missing.length));

    ui.barLabel.textContent = 'Each month';
    ui.barTotal.textContent = inr(list + fee) + ' · review';

    if (announce) ui.status.textContent = announce + ' ' + msg;
  }

  /* build.html#S, #M or #L (from the homepage explorer) starts from that size. */
  var fromHash = (location.hash || '').replace('#', '');
  loadTier(ECO.TIERS[fromHash] ? fromHash : state.tier);
  render();
})();
