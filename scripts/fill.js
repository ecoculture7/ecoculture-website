/* Fills figures into static copy from data/prices.js, so pages that quote a
   delivery fee or a prepayment discount never hold a second copy of the number.

   Markup:  <span data-eco="DELIVERY.freeFrom" data-fmt="inr">the free-delivery threshold</span>
            <span data-eco="PREPAY.2.discount" data-fmt="pct">the twelve-month discount</span>

   The text inside the span is what a visitor sees with JavaScript off, and it
   deliberately contains no number. */
(function () {
  if (!window.ECO) return;

  function lookup(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, window.ECO);
  }

  document.querySelectorAll('[data-eco]').forEach(function (el) {
    var v = lookup(el.getAttribute('data-eco'));
    if (typeof v !== 'number') return;
    var fmt = el.getAttribute('data-fmt');
    el.textContent = fmt === 'pct'
      ? Math.round(v * 100) + '%'
      : '₹' + v.toLocaleString('en-IN');
  });
  /* MRP, shelf-anchored, per pack (data/prices.js ECO.MRP). The page shows the
     MRP of the unit pack (1 kg / 1 L, else the smallest pack) struck through
     beside the selling price, and a one-line dated note. Nothing shows while
     the set is provisional or the pack is unconfirmed: the line is removed. */
  if (window.ECO.SKUS && window.ECO.MRP) {
    var M = window.ECO.MRP, byKey = {}, packOf = {};
    window.ECO.SKUS.forEach(function (s) { byKey[s.k] = s; });
    M.packs.forEach(function (r) {
      if (!r.confirmed) return;
      var cur = packOf[r.k];
      if (!cur || (cur.pack !== 1 && (r.pack === 1 || r.pack < cur.pack))) packOf[r.k] = r;
    });
    function packLabel(r, unit) {
      return r.pack >= 1 ? r.pack + ' ' + unit : Math.round(r.pack * 1000) + (unit === 'L' ? ' ml' : ' g');
    }
    document.querySelectorAll('[data-mrp-of]').forEach(function (el) {
      var k = el.getAttribute('data-mrp-of'), s = byKey[k], r = packOf[k];
      var line = el.closest('.item__mrp, .ledger__mrp') || el;
      if (!s || !r || M.provisional) { line.remove(); return; }
      el.textContent = '\u20B9' + r.mrp.toLocaleString('en-IN');
      var pk = line.querySelector('[data-mrp-pack]');
      if (pk) pk.textContent = '\u00B7 ' + packLabel(r, s.unit) + (r.pack === 1 ? '' : ' (sells \u20B9' + r.sells.toLocaleString('en-IN') + ')');
      line.classList.add('is-ready');
    });
    document.querySelectorAll('.mrp-note').forEach(function (el) {
      if (M.provisional) { el.remove(); return; }
      el.querySelectorAll('[data-mrp-date]').forEach(function (d) { d.textContent = M.anchoredLabel; });
      el.hidden = false;
    });
  }
  /* Prepayment, in rupees: data-save="M:2" = Medium basket, PREPAY[2]. */
  if (window.ECO.calc && window.ECO.PREPAY) {
    document.querySelectorAll('[data-save]').forEach(function (el) {
      var p = el.getAttribute('data-save').split(':');
      var d = window.ECO.calc.tier(p[0]), o = window.ECO.PREPAY[+p[1]];
      if (!d || !o) return;
      el.textContent = '\u20B9' + Math.round(d.total * o.months * o.discount).toLocaleString('en-IN');
    });
    document.querySelectorAll('[data-months]').forEach(function (el) {
      var p = el.getAttribute('data-months').split(':');
      var o = window.ECO.PREPAY[+p[1]];
      if (!o) return;
      el.textContent = String(Math.round(o.months * o.discount * 10) / 10);
    });
  }
  /* Derived figures for a starting basket: its monthly total and its weight. */
  if (window.ECO.calc) {
    document.querySelectorAll('[data-tier-total]').forEach(function (el) {
      var d = window.ECO.calc.tier(el.getAttribute('data-tier-total'));
      el.textContent = '\u20B9' + d.total.toLocaleString('en-IN');
    });
    document.querySelectorAll('[data-tier-weight]').forEach(function (el) {
      var d = window.ECO.calc.tier(el.getAttribute('data-tier-weight'));
      el.textContent = (Math.round(d.weight * 10) / 10) + ' kg';
    });
  }
})();
