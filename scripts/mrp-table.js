/* /mrp.html: the pack-by-pack MRP table, built from data/prices.js so no
   rupee figure lives in the markup. Unconfirmed packs are listed without a
   figure; a provisional set shows a notice instead of the table. */
(function () {
  if (!window.ECO || !window.ECO.SKUS || !window.ECO.MRP) return;
  var M = window.ECO.MRP, byKey = {};
  window.ECO.SKUS.forEach(function (s) { byKey[s.k] = s; });
  var run = document.querySelector('[data-mrp-run]');
  if (run) run.textContent = M.anchoredLabel;
  var table = document.getElementById('mrp-table'), note = document.getElementById('mrp-provisional');
  if (!table) return;
  if (M.provisional) { table.closest('.table-scroll').hidden = true; if (note) note.hidden = false; return; }
  var inr = function (n) { return '\u20B9' + n.toLocaleString('en-IN'); };
  var body = table.querySelector('tbody');
  M.packs.forEach(function (r) {
    var s = byKey[r.k]; if (!s) return;
    var pack = r.pack >= 1 ? r.pack + ' ' + s.unit : Math.round(r.pack * 1000) + (s.unit === 'L' ? ' ml' : ' g');
    var tr = document.createElement('tr');
    var cells = r.confirmed
      ? [s.name, pack, '<s>' + inr(r.mrp) + '</s>', '<b>' + inr(r.sells) + '</b>', Math.round((1 - r.sells / r.mrp) * 100) + '%', '<span class="anchor">' + r.anchor + '</span>']
      : [s.name, pack, '—', '—', '—', '<span class="anchor">price being set; no MRP yet</span>'];
    cells.forEach(function (html, n) {
      var td = document.createElement('td');
      if (n >= 2 && n <= 4) td.className = 'num';
      td.innerHTML = html;
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
})();
