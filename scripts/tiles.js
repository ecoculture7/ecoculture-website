/* Picture tiles. Each tile names the image it wants in data-src. If that file
   exists it is shown; if not, the drawn fallback stays and nothing breaks. So
   a generated or shot image goes live by dropping the file in, no markup edit. */
(function () {
  function upgrade(tile, src, cls) {
    var img = new Image();
    img.onload = function () {
      img.className = 'tile__img';
      img.alt = '';
      tile.insertBefore(img, tile.firstChild);
      tile.classList.add(cls || 'tile--photo');
    };
    img.src = src;
  }
  document.querySelectorAll('.tile[data-src]').forEach(function (t) { upgrade(t, t.getAttribute('data-src')); });
  document.querySelectorAll('.loop__node[data-src]').forEach(function (n) {
    var t = n.querySelector('.tile');
    if (t) upgrade(t, n.getAttribute('data-src'));
  });
})();
