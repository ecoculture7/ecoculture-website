/* Run:  node backend/reserve/credit.test.mjs   — no AWS needed. */
import assert from 'node:assert/strict';
import { issueCode, validateCode, createCreditHandler } from './credit.mjs';

assert.match(issueCode(), /^ECO-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
assert.equal(validateCode(' eco-ab23-cd45 '), 'ECO-AB23-CD45');
assert.equal(validateCode('ECO-AB23'), null);

const ev = (b) => ({ requestContext: { http: { method: 'POST' } }, body: JSON.stringify(b) });
function make(record, at = '2026-12-20T10:00:00Z') {
  const calls = { redeemed: [] };
  const h = createCreditHandler({
    now: () => new Date(at),
    getCredit: async (code) => (record && record.code === code ? record : null),
    markRedeemed: async (code, when) => { calls.redeemed.push([code, when]); }
  });
  return { h, calls };
}
const live = { code: 'ECO-AB23-CD45', email: 'a@b.com', amount: 523, shippedAt: '2026-12-05T10:00:00Z', creditDays: 30, redeemedAt: null };

let t = make(live); let res = await t.h(ev({ code: 'eco-ab23-cd45' }));
assert.equal(res.statusCode, 200); assert.equal(JSON.parse(res.body).amount, 523); assert.equal(t.calls.redeemed.length, 0, 'a check does not burn the code');

t = make(live); res = await t.h(ev({ code: live.code, action: 'redeem' }));
assert.equal(res.statusCode, 200); assert.equal(t.calls.redeemed.length, 1);

t = make({ ...live, redeemedAt: '2026-12-10T00:00:00Z' }); res = await t.h(ev({ code: live.code }));
assert.equal(res.statusCode, 409);

t = make(live, '2027-01-10T00:00:00Z'); res = await t.h(ev({ code: live.code }));
assert.equal(res.statusCode, 410, 'past creditDays');

t = make(null); res = await t.h(ev({ code: 'ECO-ZZZZ-ZZZZ' }));
assert.equal(res.statusCode, 404);
t = make(live); res = await t.h(ev({ code: 'nope' }));
assert.equal(res.statusCode, 422);
console.log('credit: all tests passed');
