/* Carousel: native scroll-snap plus previous / next buttons.

   No auto-advance, ever. Moving content under someone's eyes fails people who
   read slowly or use a screen reader. The track is keyboard-scrollable, the
   buttons appear only when there is something to scroll to, and with
   JavaScript off it is still a horizontally scrollable row.

   Markup:
   <div class="carousel" data-carousel aria-label="Farmer profiles">
     <div class="carousel__track"> …cards… </div>
   </div>                                                                 */
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    if (!track) return;

    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    track.tabIndex = 0;

    var ctl = document.createElement('div');
    ctl.className = 'carousel__ctl';

    function mk(dir, label, icon) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__btn';
      b.setAttribute('aria-label', label);
      b.innerHTML = '<svg class="icon" aria-hidden="true"><use href="assets/icons.v1.svg#' + icon + '"/></svg>';
      b.addEventListener('click', function () {
        var card = track.children[0];
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        var step = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
      });
      return b;
    }

    var prev = mk(-1, 'Previous', 'i-chevron-left');
    var next = mk(1, 'Next', 'i-chevron-right');
    var count = document.createElement('span');
    count.className = 'carousel__count small muted';
    count.setAttribute('aria-live', 'polite');
    ctl.appendChild(prev); ctl.appendChild(next); ctl.appendChild(count);
    root.appendChild(ctl);

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      ctl.hidden = max <= 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      var card = track.children[0];
      if (card && max > 2) {
        var w = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
        count.textContent = (Math.min(track.children.length, Math.round(track.scrollLeft / w) + 1)) + ' of ' + track.children.length;
      }
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    });
    window.addEventListener('resize', update);
    update();
  });
})();
