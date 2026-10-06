/* Reserve-form logic, kept free of AWS imports so it can be tested on a laptop.
   index.mjs wires the real clients in; test.mjs wires in fakes.

   The rule this exists to keep: the visitor sees "thank you" ONLY if the signup
   is stored AND you have been emailed. Anything less returns an error, so a
   failure can never look like a success. */

const HOUSEHOLDS = ['1-2', '3-4', '5-6', '7+'];
const EMAIL_RE = /^[^\s@<>"',;:]+@[^\s@<>"',;:]+\.[^\s@<>"',;:]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9 \-]{7,16}$/;

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

export function validate(body) {
  /* Honeypot: real people never fill it. Pretend success so bots learn nothing. */
  if (clean(body.bot_field, 50)) return { bot: true };

  const v = {
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 20),
    area: clean(body.area, 100),
    household: clean(body.household, 5)
  };
  const errors = {};
  if (v.name.length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email)) errors.email = 'Please enter a valid email address.';
  if (v.phone && !PHONE_RE.test(v.phone)) errors.phone = 'Please check the WhatsApp number.';
  if (v.area.length < 2) errors.area = 'Please tell us where in Delhi NCR.';
  if (!HOUSEHOLDS.includes(v.household)) errors.household = 'Please choose a household size.';
  return Object.keys(errors).length ? { errors } : { value: v };
}

export function createHandler({ putSignup, sendMail, env, now = () => new Date() }) {
  const json = (statusCode, obj) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  });

  return async function handler(event) {
    /* CORS is configured on the Function URL itself. Do not add headers here:
       duplicated Access-Control headers make browsers reject the response. */
    if ((event.requestContext?.http?.method || 'POST') !== 'POST') return json(405, { ok: false });

    let body;
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
      if (raw.length > 4000) return json(413, { ok: false });
      body = JSON.parse(raw);
    } catch {
      return json(400, { ok: false });
    }

    const r = validate(body);
    if (r.bot) return json(200, { ok: true });
    if (r.errors) return json(422, { ok: false, errors: r.errors });

    const s = r.value;
    const record = { ...s, createdAt: now().toISOString() };

    try {
      /* Keyed by email, so a retry after a failure overwrites rather than duplicates. */
      await putSignup(record);
      await sendMail({
        to: env.TO_EMAIL,
        from: env.FROM_EMAIL,
        replyTo: s.email,
        subject: 'New trial-pack reservation',
        text: [
          'Someone reserved a December trial pack.',
          '',
          `Name:      ${s.name}`,
          `Email:     ${s.email}`,
          `WhatsApp:  ${s.phone || '(not given)'}`,
          `Area:      ${s.area}`,
          `Household: ${s.household}`,
          `Received:  ${record.createdAt}`
        ].join('\n')
      });
    } catch (err) {
      console.error('reserve failed', err);
      return json(500, { ok: false });
    }
    return json(200, { ok: true });
  };
}
