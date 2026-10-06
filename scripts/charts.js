/* Data-driven infographics. Both read data/prices.js, so a changed fee or
   discount redraws itself and a chart can never disagree with the copy.

   #delivery-chart   what a delivery costs at each order value
   #ladder-chart     the prepayment discount by months prepaid            */
(function () {
  var ECO = window.ECO;
  if (!ECO) return;

  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  /* ── Delivery cost by order value ───────────────────────────────────── */
  var dc = document.getElementById('delivery-chart');
  if (dc && ECO.DELIVERY) {
    var D = ECO.DELIVERY;
    var W = 640, H = 330, L = 84, R = 16, T = 20, B = 70;
    var xMax = Math.ceil((D.freeFrom * 1.25) / 500) * 500;
    var yMax = Math.ceil((D.smallFee * 1.15) / 50) * 50;
    var x = function (v) { return L + (v / xMax) * (W - L - R); };
    var y = function (v) { return T + (1 - v / yMax) * (H - T - B); };

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img' });
    svg.setAttribute('aria-label',
      'Delivery fee by order value: ' + inr(D.smallFee) + ' under ' + inr(D.midFrom) + ', ' +
      inr(D.midFee) + ' from ' + inr(D.midFrom) + ', free from ' + inr(D.freeFrom) + '.');

    /* gridlines and y labels */
    [0, D.midFee, D.smallFee].forEach(function (v) {
      svg.appendChild(s('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'chart__grid' }));
      svg.appendChild(s('text', { x: L - 8, y: y(v) + 4, class: 'chart__tick chart__tick--end' }, v ? inr(v) : 'Free'));
    });

    /* the step line */
    var pts = [[0, D.smallFee], [D.midFrom, D.smallFee], [D.midFrom, D.midFee], [D.freeFrom, D.midFee], [D.freeFrom, 0], [xMax, 0]];
    svg.appendChild(s('polyline', {
      points: pts.map(function (p) { return x(p[0]) + ',' + y(p[1]); }).join(' '),
      class: 'chart__line'
    }));

    /* thresholds */
    [D.midFrom, D.freeFrom].forEach(function (v) {
      svg.appendChild(s('line', { x1: x(v), x2: x(v), y1: y(yMax), y2: y(0) + 6, class: 'chart__thresh' }));
      svg.appendChild(s('text', { x: x(v), y: H - B + 28, class: 'chart__tick chart__tick--mid' }, inr(v)));
    });
    svg.appendChild(s('circle', { cx: x(D.freeFrom), cy: y(0), r: 5, class: 'chart__dot' }));
    svg.appendChild(s('text', { x: (x(D.freeFrom) + W - R) / 2, y: y(0) - 12, class: 'chart__label chart__label--ok chart__tick--mid' }, 'Free'));
    svg.appendChild(s('text', { x: (L + W - R) / 2, y: H - 8, class: 'chart__axis chart__tick--mid' }, 'Order value, before any discount'));

    dc.appendChild(svg);
  }

  /* ── Prepayment ladder ──────────────────────────────────────────────── */
  var lc = document.getElementById('ladder-chart');
  if (lc && ECO.PREPAY) {
    var rows = [{ months: 0, discount: 0 }].concat(ECO.PREPAY);
    var top = ECO.PREPAY[ECO.PREPAY.length - 1].discount;
    var list = document.createElement('div');
    list.className = 'bars';
    rows.forEach(function (r) {
      var row = document.createElement('div');
      row.className = 'bars__row';
      var name = document.createElement('span');
      name.className = 'bars__name';
      name.textContent = r.months ? r.months + ' months' : 'Month by month';
      var track = document.createElement('span');
      track.className = 'bars__track';
      var bar = document.createElement('span');
      bar.className = 'bars__bar';
      bar.style.width = (r.discount / top * 100) + '%';
      track.appendChild(bar);
      var val = document.createElement('span');
      val.className = 'bars__val';
      val.textContent = r.discount ? Math.round(r.discount * 100) + '% off' : 'list price';
      row.appendChild(name); row.appendChild(track); row.appendChild(val);
      list.appendChild(row);
    });
    lc.appendChild(list);
  }
})();
