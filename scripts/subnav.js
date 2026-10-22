/* The section bar: measures the masthead so the bar sits under it, shows
   once the hero has been scrolled past, and underlines the section in view. */
(function () {
  var bar = document.getElementById('subnav');
  var head = document.querySelector('.masthead');
  var hero = document.querySelector('.hero');
  if (!bar || !head) return;

  var links = [].slice.call(bar.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var inner = bar.querySelector('.subnav__inner');

  function measure() {
    document.documentElement.style.setProperty('--masthead-h', head.offsetHeight + 'px');
  }

  function update() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var showAt = hero ? hero.offsetTop + hero.offsetHeight - head.offsetHeight - 40 : 200;
    bar.classList.toggle('subnav--on', y > showAt);

    /* active = the last section whose top has passed the line under the bars */
    var line = head.offsetHeight + bar.offsetHeight + 24;
    var active = -1;
    targets.forEach(function (t, i) {
      if (t && t.getBoundingClientRect().top <= line) active = i;
    });
    links.forEach(function (a, i) {
      var on = i === active;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    /* keep the active chip in view on a phone */
    if (active >= 0 && inner.scrollWidth > inner.clientWidth) {
      var a = links[active];
      var left = a.offsetLeft - (inner.clientWidth - a.offsetWidth) / 2;
      if (Math.abs(inner.scrollLeft - left) > 8) inner.scrollTo({ left: left, behavior: 'smooth' });
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  window.addEventListener('load', function () { measure(); update(); });
  setInterval(update, 250);
})();
