/* Cookie consent, built for the DPDP Act 2023 and its 2025 Rules.
   ───────────────────────────────────────────────────────────────────────────
   Three groups: necessary (always on), measurement, advertising. Nothing in
   the last two runs until the visitor has made a choice, and a dismissed
   banner counts as a refusal. "Reject all" and "Accept all" are the same
   button, same size, same weight. There are no pre-ticked boxes.

   The choice is kept in a first-party cookie, eco_consent, for 12 months,
   with a timestamp and the policy version it was given against, so the
   business can show that consent was asked for and what was given.

   Withdrawal is one click: the "Manage cookies" link in every footer calls
   ECO.consent.open(). Withdrawing a group deletes that group's cookies and
   stops its tags; a reload does not restore them.

   The tags themselves live in ECO.consent.tags, below, keyed by group.
   Nothing loads unless its group is consented AND its id is set.

   API:  ECO.consent.get()  -> { measurement: bool, advertising: bool, at, version } | null
         ECO.consent.set({ measurement, advertising })
         ECO.consent.open()                                                 */
(function () {
  window.ECO = window.ECO || {};
  var NAME = 'eco_consent', VERSION = '2026-11-06', DAYS = 365;
  var GROUPS = ['measurement', 'advertising'];
  var state = null, dialog = null, loaded = {};

  /* ── Tags, gated on consent. Empty until the tools are chosen (commit 7):
        a group with no id and no loader never loads anything. ── */
  var TAGS = {
    measurement: { id: '', cookies: [], load: function () {}, stop: function () {} },
    advertising: { id: '', cookies: [], load: function () {}, stop: function () {} }
  };

  function script(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  /* ── The cookie ── */
  function read() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + NAME + '=([^;]*)'));
    if (!m) return null;
    try {
      var v = JSON.parse(decodeURIComponent(m[1]));
      if (!v || v.version !== VERSION) return null;   /* a new policy version asks again */
      return v;
    } catch (e) { return null; }
  }
  function write(v) {
    var exp = new Date(Date.now() + DAYS * 86400000).toUTCString();
    document.cookie = NAME + '=' + encodeURIComponent(JSON.stringify(v)) + '; expires=' + exp + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }
  function clearCookies(patterns) {
    document.cookie.split(';').forEach(function (c) {
      var k = c.split('=')[0].trim();
      if (!patterns.some(function (re) { return re.test(k); })) return;
      ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
        document.cookie = k + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  /* ── Apply a choice: load what is allowed, stop and clean what is not ── */
  function apply() {
    GROUPS.forEach(function (g) {
      var tag = TAGS[g], on = !!(state && state[g]);
      if (on && tag.id && !loaded[g]) { loaded[g] = true; tag.load(tag.id); }
      if (!on) { if (loaded[g]) tag.stop(); clearCookies(tag.cookies); }
    });
  }

  function set(choice) {
    state = { measurement: !!choice.measurement, advertising: !!choice.advertising, at: new Date().toISOString(), version: VERSION };
    write(state);
    apply();
    close();
    document.dispatchEvent(new CustomEvent('eco:consent', { detail: state }));
  }

  /* ── The banner ── */
  function build() {
    var d = document.createElement('div');
    d.className = 'consent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'false');
    d.setAttribute('aria-labelledby', 'consent-title');
    d.setAttribute('aria-describedby', 'consent-text');
    d.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text" id="consent-text"><b id="consent-title">Cookies.</b> Some are needed to make this site work. Others let us measure how it is used, and see whether an advertisement worked. Those only run if you say yes, and the site works exactly the same if you say no. <a href="/privacy.html">Privacy</a></p>' +
        '<form class="consent__choose" id="consent-choose" hidden>' +
          '<label class="consent__opt"><input type="checkbox" checked disabled> <span><b>Necessary</b> · always on. Your basket, the form, this choice.</span></label>' +
          '<label class="consent__opt"><input type="checkbox" name="measurement"> <span><b>Measurement</b> · which pages are read, where people stop.</span></label>' +
          '<label class="consent__opt"><input type="checkbox" name="advertising"> <span><b>Advertising</b> · whether an advertisement led to an order.</span></label>' +
        '</form>' +
        '<div class="consent__btns">' +
          '<button type="button" class="btn btn--primary" data-consent="accept">Accept all</button>' +
          '<button type="button" class="btn btn--primary" data-consent="reject">Reject all</button>' +
          '<button type="button" class="btn btn--ghost" data-consent="choose">Choose</button>' +
          '<button type="button" class="btn btn--ghost" data-consent="save" hidden>Save my choice</button>' +
        '</div>' +
        '<button type="button" class="consent__close" aria-label="Close and reject optional cookies" data-consent="reject">×</button>' +
      '</div>';
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var form = d.querySelector('#consent-choose');
      if (b.dataset.consent === 'accept') set({ measurement: true, advertising: true });
      else if (b.dataset.consent === 'reject') set({ measurement: false, advertising: false });
      else if (b.dataset.consent === 'choose') {
        form.hidden = false;
        d.querySelector('[data-consent="choose"]').hidden = true;
        d.querySelector('[data-consent="save"]').hidden = false;
        if (state) GROUPS.forEach(function (g) { form.elements[g].checked = !!state[g]; });
      } else if (b.dataset.consent === 'save') {
        set({ measurement: form.elements.measurement.checked, advertising: form.elements.advertising.checked });
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dialog && dialog.parentNode) set({ measurement: false, advertising: false }); });
    return d;
  }
  function open() {
    if (!dialog) dialog = build();
    if (!dialog.parentNode) document.body.appendChild(dialog);
    dialog.querySelector('[data-consent="accept"]').focus();
  }
  function close() { if (dialog && dialog.parentNode) dialog.parentNode.removeChild(dialog); }

  window.ECO.consent = {
    get: function () { return state ? { measurement: state.measurement, advertising: state.advertising, at: state.at, version: state.version } : null; },
    set: set,
    open: open,
    tags: TAGS,
    version: VERSION
  };

  /* ── Start: a stored choice is applied silently; otherwise ask ── */
  state = read();
  if (state) apply(); else open();
  document.querySelectorAll('[data-consent-open]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
})();
