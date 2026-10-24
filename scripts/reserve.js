/* Reserve form. With a Function URL in data-endpoint it posts there; without
   one it hands the visitor a pre-filled WhatsApp message and email to send.

   The one rule: "thank you" appears only after the server says the signup was
   stored and emailed. If the endpoint is blank, unreachable or errors, the
   visitor is told plainly and given another way in. A form that thanks people
   for something it lost is how five months of signups can disappear. */
(function () {
  var form = document.getElementById('reserve-form');
  var status = document.getElementById('reserve-status');
  if (!form || !status) return;

  var btn = form.querySelector('button[type="submit"]');
  var label = btn.textContent;

  function show(html, kind) {
    status.innerHTML = html;
    status.className = 'small form-status form-status--' + kind;
    status.hidden = false;
  }

  var FALLBACK = 'You can email <a href="mailto:admin@ecoculture.in">admin@ecoculture.in</a> or message us on <a href="https://wa.me/918178030060">WhatsApp</a> instead.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.hidden = true;

    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    /* Without a backend the visitor sends the message themselves, with the
       details filled in: WhatsApp on a phone, email anywhere. Nothing is
       stored on this site, so nothing can be lost on it. */
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      var text = [
        'Trial pack reservation',
        'Name: ' + data.name,
        'Email: ' + data.email,
        'WhatsApp: ' + (data.phone || '-'),
        'Area: ' + data.area,
        'Household: ' + data.household
      ].join('\n');
      var wa = 'https://wa.me/918178030060?text=' + encodeURIComponent(text);
      var mail = 'mailto:admin@ecoculture.in?subject=' + encodeURIComponent('Trial pack reservation') + '&body=' + encodeURIComponent(text);
      show('<b>One more tap.</b> Send this to us on WhatsApp or by email; it arrives with your details already filled in.' +
        '<span class="form-status__row"><a class="btn btn--primary btn--sm" href="' + wa + '" target="_blank" rel="noopener">Send on WhatsApp</a>' +
        '<a class="btn btn--ghost btn--sm" href="' + mail + '">Send by email</a></span>', 'ok');
      btn.textContent = 'Details ready';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; });
    }).then(function (r) {
      if (r.res.ok && r.body.ok) {
        form.reset();
        show('<b>You’re on the list.</b> We’ll write once when prices are set, and once more when your pack ships.', 'ok');
        btn.textContent = 'Reserved';
        return;
      }
      if (r.res.status === 422) {
        show('Please check your details and try again.', 'error');
      } else {
        show('Sorry, that did not go through, and nothing was saved. ' + FALLBACK, 'error');
      }
      btn.disabled = false;
      btn.textContent = label;
    }).catch(function () {
      show('Sorry, we could not reach the server, and nothing was saved. ' + FALLBACK, 'error');
      btn.disabled = false;
      btn.textContent = label;
    });
  });
})();
