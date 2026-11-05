/* Trial credit codes. Kept free of AWS imports, like lib.mjs, so it tests on a laptop.

   When a trial pack ships, issueCode() makes a one-time code that is stored
   with the trial record and sent to the customer by email and WhatsApp. At
   prepay checkout the code is posted here; it is valid once, within
   creditDays of shipping, and worth the trial price recorded when it was
   issued (never the live price, so a later price change cannot move it).

   The site has no accounts and this does not create any. */

const CODE_RE = /^ECO-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; /* no 0/O, 1/I */

export function issueCode(random = Math.random) {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(random() * ALPHABET.length)]).join('');
  return 'ECO-' + part() + '-' + part();
}

export function validateCode(raw) {
  const code = String(raw ?? '').trim().toUpperCase();
  return CODE_RE.test(code) ? code : null;
}

/* A stored credit looks like:
   { code, email, amount, shippedAt (ISO), creditDays, redeemedAt (ISO | null) } */
export function createCreditHandler({ getCredit, markRedeemed, now = () => new Date() }) {
  const json = (statusCode, obj) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

  return async function handler(event) {
    if ((event.requestContext?.http?.method || 'POST') !== 'POST') return json(405, { ok: false });
    let body;
    try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false }); }

    const code = validateCode(body.code);
    if (!code) return json(422, { ok: false, reason: 'format' });

    const credit = await getCredit(code);
    if (!credit) return json(404, { ok: false, reason: 'unknown' });
    if (credit.redeemedAt) return json(409, { ok: false, reason: 'used' });

    const deadline = new Date(credit.shippedAt).getTime() + credit.creditDays * 86400000;
    if (now().getTime() > deadline) return json(410, { ok: false, reason: 'expired' });

    /* "check" only looks; "redeem" burns the code, and is called by the
       payment step once the gateway confirms the prepayment. */
    if (body.action === 'redeem') {
      await markRedeemed(code, now().toISOString());
    }
    return json(200, { ok: true, amount: credit.amount, expiresAt: new Date(deadline).toISOString() });
  };
}
