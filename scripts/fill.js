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
