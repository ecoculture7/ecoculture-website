/* The one place basket arithmetic lives, so the builder and the homepage
   explorer cannot disagree about a total. Reads data/prices.js only.

   Quantities for a tier are whole numbers of packs. A line is
   price × quantity, rounded half-up to the rupee; that is how the starting
   baskets on /basket are reckoned. */
(function () {
  var ECO = window.ECO;
  if (!ECO || !ECO.SKUS) return;

  var CAT_TITLES = { atta: 'Atta', rice: 'Rice', dal: 'Dal', oil: 'Oil', spice: 'Spices' };

  function line(sku, qty) { return Math.round(sku.price * qty + 1e-9); }

  function fmtQty(sku, q) {
    if (q < 1) return Math.round(q * 1000) + (sku.unit === 'L' ? ' ml' : ' g');
    return q + ' ' + sku.unit;
  }

  /* The delivery band, read on the LIST price. A member (any prepaid term)
     uses ECO.DELIVERY.member. */
  function fee(list, member) {
    var D = member && ECO.DELIVERY.member ? ECO.DELIVERY.member : ECO.DELIVERY;
    if (list >= D.freeFrom) return 0;
    if (list >= D.midFrom) return D.midFee;
    return D.smallFee;
  }

  /* Everything a tier shows: lines, total, weight, delivery and spend by category. */
  function tier(t) {
    var def = ECO.TIERS[t];
    var lines = [], total = 0, weight = 0, byCat = {};
    ECO.SKUS.forEach(function (sku) {
      var steps = Math.round((def.q[sku.k] || 0) / sku.step);
      var qty = Math.round(steps * sku.step * 1000) / 1000;
      if (!qty) return;
      var amount = line(sku, qty);
      lines.push({ sku: sku, qty: qty, amount: amount });
      total += amount;
      weight += qty;
      byCat[sku.cat] = (byCat[sku.cat] || 0) + amount;
    });
    return { label: def.label, who: def.who, lines: lines, total: total, weight: weight, byCat: byCat, fee: fee(total), memberFee: fee(total, true) };
  }

  /* The trial pack as lines, from ECO.TRIAL. */
  function trial() {
    var T = ECO.TRIAL, lines = [], total = 0;
    if (!T) return { lines: lines, total: 0 };
    T.items.forEach(function (it) {
      var sku = ECO.SKUS.filter(function (s) { return s.k === it.k; })[0];
      if (!sku) return;
      var amount = line(sku, it.pack);
      lines.push({ sku: sku, qty: it.pack, amount: amount });
      total += amount;
    });
    return { lines: lines, total: total };
  }

  /* What a prepaid term costs, in the fixed order:
     list → prepay discount → trial credit. Delivery is NOT in here: it is read
     on the list price per drop, by fee(). */
  function prepay(list, months, withCredit) {
    var opt = null;
    ECO.PREPAY.forEach(function (o) { if (o.months === months) opt = o; });
    if (!opt || !list) return null;
    var full = list * opt.months;
    var discounted = Math.round(full * (1 - opt.discount));
    var credit = withCredit && ECO.TRIAL ? Math.min(ECO.TRIAL.price, discounted) : 0;
    return { months: opt.months, discount: opt.discount, full: full, discounted: discounted, saved: full - discounted, credit: credit, pay: discounted - credit };
  }

  ECO.calc = { line: line, fmtQty: fmtQty, fee: fee, tier: tier, trial: trial, prepay: prepay, catTitles: CAT_TITLES };
})();
