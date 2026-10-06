/* The only JavaScript on the marketing pages: the mobile menu disclosure.
   Kept in a file rather than inline so the Content-Security-Policy in
   customHttp.yml can stay at script-src 'self' with no 'unsafe-inline'.
   Every page works with JavaScript switched off. */
(function () {
  var btn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  });

  /* Escape closes it, and focus goes back to the button. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
      menu.setAttribute('data-open', 'false');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
      btn.focus();
    }
  });
})();
