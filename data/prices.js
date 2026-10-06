/* ──────────────────────────────────────────────────────────────────────────
   Ecoculture — the single source of truth for every price on this site.
   Nothing else in the codebase should contain a rupee figure for a SKU.

   Rule: at or below the certified-organic shelf, benchmarked against each
   brand's OWN site, never a marketplace listing.

   PROVISIONAL FIGURES ARE MARKED `provisional: true`. The banner on any page
   that shows them reads from that flag, so clearing it is a one-word edit.
   Last reviewed: 6 October 2026.
   ────────────────────────────────────────────────────────────────────────── */

window.ECO = window.ECO || {};

/* Pack sizes are a hard product rule, closed 6 October 2026.
   `step` is both the minimum and the increment: the first tap buys a real
   pack, so no quantity the builder can produce is unbuyable.             */
window.ECO.SKUS = [
  { k: 'atta',      name: 'Whole wheat atta',        hi: 'standard, stone-ground',     cat: 'atta',  unit: 'kg', price: 78,  step: 1,    note: '' },
  { k: 'bansi',     name: 'Bansi atta',              hi: 'durum, coarse grind',        cat: 'atta',  unit: 'kg', price: 138, step: 1,    note: '' },
  { k: 'sonamoti',  name: 'Sona Moti atta',          hi: 'landrace, low yield',        cat: 'atta',  unit: 'kg', price: 188, step: 1,    note: 'small lots only' },
  { k: 'basmati',   name: 'Basmati rice',            hi: '1509 / 1718, unpolished',    cat: 'rice',  unit: 'kg', price: 158, step: 1,    note: '' },
  { k: 'kalanamak', name: 'Kalanamak rice',          hi: 'GI-tagged, our own farmers', cat: 'rice',  unit: 'kg', price: 299, step: 0.5,  note: '500 g pack · in every basket' },
  { k: 'arhar',     name: 'Arhar dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 248, step: 0.5,  note: 'source being named' },
  { k: 'moong',     name: 'Moong dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 230, step: 0.5,  note: '' },
  { k: 'chana',     name: 'Chana dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 185, step: 0.5,  note: '' },
  { k: 'masoor',    name: 'Masoor dal',              hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 245, step: 0.5,  note: '' },
  { k: 'oil',       name: 'Kachi ghani mustard oil', hi: 'cold-pressed, not refined',  cat: 'oil',   unit: 'L',  price: 345, step: 0.5,  note: '' },
  { k: 'spice',     name: 'Spice pack',              hi: 'haldi · dhaniya · jeera',    cat: 'spice', unit: 'kg', price: 680, step: 0.1,  note: 'ground the week it ships' }
];

/* Printed MRPs, per pack. Required on every pre-packaged food sold in India.
   ONLY Kalanamak is confirmed (₹399 on a 1 kg pack against ₹299 selling).
   Every other row is that same 25% rule applied and rounded to a printable
   number — a SAMPLE, pending the CA. Do not put an unconfirmed MRP on a page
   or a pack: an inflated MRP is the one claim here that could draw a notice. */
window.ECO.MRP = {
  provisional: true,          /* <- clear this when the CA confirms the set */
  reviewed: '2026-10-06',
  packs: [
    { k: 'atta',      pack: 1,   sells: 78,  mrp: 105,  confirmed: false },
    { k: 'atta',      pack: 2,   sells: 156, mrp: 209,  confirmed: false },
    { k: 'atta',      pack: 5,   sells: 390, mrp: 520,  confirmed: false },
    { k: 'bansi',     pack: 1,   sells: 138, mrp: 185,  confirmed: false },
    { k: 'bansi',     pack: 2,   sells: 276, mrp: 369,  confirmed: false },
    { k: 'sonamoti',  pack: 1,   sells: 188, mrp: 255,  confirmed: false },
    { k: 'sonamoti',  pack: 2,   sells: 376, mrp: 505,  confirmed: false },
    { k: 'basmati',   pack: 1,   sells: 158, mrp: 215,  confirmed: false },
    { k: 'basmati',   pack: 5,   sells: 790, mrp: 1055, confirmed: false },
    { k: 'kalanamak', pack: 0.5, sells: 150, mrp: 200,  confirmed: true  },
    { k: 'kalanamak', pack: 1,   sells: 299, mrp: 399,  confirmed: true  },
    { k: 'arhar',     pack: 0.5, sells: 124, mrp: 169,  confirmed: false },
    { k: 'arhar',     pack: 1,   sells: 248, mrp: 335,  confirmed: false },
    { k: 'moong',     pack: 0.5, sells: 115, mrp: 155,  confirmed: false },
    { k: 'moong',     pack: 1,   sells: 230, mrp: 309,  confirmed: false },
    { k: 'chana',     pack: 0.5, sells: 92,  mrp: 125,  confirmed: false },
    { k: 'chana',     pack: 1,   sells: 185, mrp: 249,  confirmed: false },
    { k: 'masoor',    pack: 0.5, sells: 122, mrp: 165,  confirmed: false },
    { k: 'masoor',    pack: 1,   sells: 245, mrp: 329,  confirmed: false },
    { k: 'oil',       pack: 0.5, sells: 172, mrp: 230,  confirmed: false },
    { k: 'oil',       pack: 1,   sells: 345, mrp: 460,  confirmed: false },
    { k: 'spice',     pack: 0.1, sells: 68,  mrp: 95,   confirmed: false },
    { k: 'spice',     pack: 0.3, sells: 204, mrp: 275,  confirmed: false },
    { k: 'spice',     pack: 0.5, sells: 340, mrp: 455,  confirmed: false }
  ]
};

/* The three starting points. Every quantity is a legal pack multiple. */
window.ECO.TIERS = {
  S: { label: 'Small',  who: '1–2 people', q: { atta: 5,  basmati: 2, kalanamak: 0.5, arhar: 0.5, moong: 0.5, chana: 0.5, masoor: 0.5, oil: 0.5, spice: 0.3 } },
  M: { label: 'Medium', who: '3–4 people', q: { atta: 8,  basmati: 4, kalanamak: 0.5, arhar: 1,   moong: 1,   chana: 1,   masoor: 0.5, oil: 1.5, spice: 0.5 } },
  L: { label: 'Large',  who: '5–6 people', q: { atta: 12, basmati: 6, kalanamak: 0.5, arhar: 1.5, moong: 1.5, chana: 1,   masoor: 1,   oil: 2,   spice: 0.8 } }
};

/* Delivery. ONE threshold, read on the LIST price before any prepayment
   discount — reading it after would push a prepaying customer away from
   free delivery, which would be a strange sort of benefit.
   ₹2,500: a ₹150 drop is 6.0% of order value, the top of the 4–6% band.
   ₹249:   per-order cost is ~₹320 and near-fixed; at 21% contribution this
           breaks even at ₹338 of produce, and the cheapest compliant
           order is ₹412, so every compliant order clears.                */
window.ECO.DELIVERY = {
  freeFrom: 2500,
  midFrom: 1200,
  midFee: 99,
  smallFee: 249,
  perOrderCost: 320
};

/* Prepayment. There is no membership fee: the discount is the interest paid
   on money received early. For N months at basket value B the advance is
   B×N(N−1)/2 month-rupees, so the implied annual cost is 24d/(N−1).
   Every tier is set to ~24% a year, which makes the rule:
   the discount in per cent is the months prepaid, minus one.            */
window.ECO.PREPAY = [
  { months: 3,  discount: 0.02, impliedAnnual: 0.24 },
  { months: 6,  discount: 0.05, impliedAnnual: 0.24 },
  { months: 12, discount: 0.12, impliedAnnual: 0.26 }
];
