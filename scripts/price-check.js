/* Price drift guard.
   ───────────────────────────────────────────────────────────────────────────
   Prices are written into the HTML so every page works with JavaScript off and
   so search engines see real numbers. That creates a second copy of a figure
   that is supposed to live only in data/prices.js.

   This script reconciles the two on every page load and shouts if they differ.
   It changes nothing on the page — it only reports. A mismatch means someone
   edited a price in markup instead of in data/prices.js, which is the bug this
   exists to catch.

   Markup contract:  <element data-sku="atta" data-price="78">₹78 / kg</element>
*/
(function () {
  if (!window.ECO || !window.ECO.SKUS) return;

  var byKey = {};
  window.ECO.SKUS.forEach(function (s) { byKey[s.k] = s; });

  var nodes = document.querySelectorAll('[data-sku][data-price]');
  var drift = [];

  nodes.forEach(function (el) {
    var k = el.getAttribute('data-sku');
    var shown = Number(el.getAttribute('data-price'));
    var sku = byKey[k];
    if (!sku) { drift.push(k + ': no such SKU in data/prices.js'); return; }
    if (sku.price !== shown) {
      drift.push(k + ': page says ' + shown + ', data/prices.js says ' + sku.price);
    }
  });

  if (drift.length) {
    console.error(
      '%cPRICE DRIFT — the page and data/prices.js disagree\n' + drift.join('\n') +
      '\n\nFix data/prices.js first, then the markup. Never only the markup.',
      'color:#8A6212;font-weight:bold'
    );
  }

  /* Also flag any provisional figure that has reached a page, so a sample MRP
     cannot quietly become a published one. */
  if (window.ECO.MRP && window.ECO.MRP.provisional &&
      document.querySelector('[data-mrp]')) {
    console.warn(
      'This page shows an MRP while data/prices.js still has provisional: true. ' +
      'Only Kalanamak is confirmed. Clear the flag when the CA signs the set off.'
    );
  }
})();
