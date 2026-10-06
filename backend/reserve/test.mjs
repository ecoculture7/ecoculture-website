/* Run:  node backend/reserve/test.mjs   — no AWS needed. */
import assert from 'node:assert/strict';
import { createHandler } from './lib.mjs';

const good = { name: 'Asha Rao', email: 'Asha@Example.com', phone: '+91 98100 12345', area: 'Noida', household: '3-4', bot_field: '' };
const ev = (b) => ({ requestContext: { http: { method: 'POST' } }, body: JSON.stringify(b) });

function make({ failDb = false, failMail = false } = {}) {
  const calls = { db: [], mail: [] };
  const h = createHandler({
    env: { TO_EMAIL: 'admin@ecoculture.in', FROM_EMAIL: 'admin@ecoculture.in' },
    now: () => new Date('2026-10-06T10:00:00Z'),
    putSignup: async (r) => { if (failDb) throw new Error('db'); calls.db.push(r); },
    sendMail: async (m) => { if (failMail) throw new Error('ses'); calls.mail.push(m); }
  });
  return { h, calls };
}

let t = make();
let res = await t.h(ev(good));
assert.equal(res.statusCode, 200);
assert.equal(t.calls.db.length, 1);
assert.equal(t.calls.db[0].email, 'asha@example.com', 'email lower-cased');
assert.equal(t.calls.mail.length, 1);
assert.equal(t.calls.mail[0].to, 'admin@ecoculture.in');
assert.ok(!t.calls.mail[0].subject.includes('Asha'), 'no user input in the subject line');

t = make(); res = await t.h(ev({ ...good, bot_field: 'spam' }));
assert.equal(res.statusCode, 200); assert.equal(t.calls.db.length + t.calls.mail.length, 0, 'honeypot stores and sends nothing');

for (const bad of [{ name: '' }, { email: 'nope' }, { email: 'a@b.com\nBcc: x@y.com' }, { household: '99' }, { area: '' }, { phone: 'abc' }]) {
  t = make(); res = await t.h(ev({ ...good, ...bad }));
  assert.equal(res.statusCode, 422, JSON.stringify(bad)); assert.equal(t.calls.mail.length, 0);
}

t = make({ failMail: true }); res = await t.h(ev(good));
assert.equal(res.statusCode, 500, 'mail failure must not look like success');
t = make({ failDb: true }); res = await t.h(ev(good));
assert.equal(res.statusCode, 500); assert.equal(t.calls.mail.length, 0, 'no email if nothing was stored');

res = await make().h({ requestContext: { http: { method: 'GET' } } }); assert.equal(res.statusCode, 405);
res = await make().h({ requestContext: { http: { method: 'POST' } }, body: 'not json' }); assert.equal(res.statusCode, 400);
res = await make().h({ requestContext: { http: { method: 'POST' } }, body: 'x'.repeat(5000) }); assert.equal(res.statusCode, 413);

console.log('all reserve tests passed');
