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

/* The WhatsApp button opens a chat with the page named, so the reply can be
   specific. The number lives in the markup; this only adds the text. */
(function () {
  var wa = document.querySelector('.wa-fab');
  if (!wa) return;
  var page = document.title.replace(/\s*[—-]\s*Ecoculture\s*$/, '').trim();
  wa.href = 'https://wa.me/918178030060?text=' + encodeURIComponent('Hi Ecoculture, I have a question about: ' + page);
})();
