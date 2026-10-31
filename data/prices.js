/* ──────────────────────────────────────────────────────────────────────────
   Ecoculture — the single source of truth for every price on this site.
   Nothing else in the codebase should contain a rupee figure for a SKU.

   Rule: at or below the certified-organic shelf, benchmarked against each
   brand's OWN site, never a marketplace listing.

   PROVISIONAL FIGURES ARE MARKED `provisional: true`. The banner on any page
   that shows them reads from that flag, so clearing it is a one-word edit.
   Last reviewed: 1 November 2026. Two prices per item: the selling price (SP,
   below) and the printed MRP, which is SP x 1.05 rounded up to the rupee. The
   pouch artwork of 24 October carries the MRPs; every one of its nineteen
   packs matches that formula against the SPs here.
   ────────────────────────────────────────────────────────────────────────── */

window.ECO = window.ECO || {};

/* Pack sizes are a hard product rule, closed 6 October 2026.
   `step` is both the minimum and the increment: the first tap buys a real
   pack, so no quantity the builder can produce is unbuyable.             */
window.ECO.SKUS = [
  { k: 'atta',      name: 'Whole wheat atta',        hi: 'standard, stone-ground',     cat: 'atta',  unit: 'kg', price: 78,  step: 1,    note: '' },
  { k: 'bansi',     name: 'Bansi atta',              hi: 'durum, coarse grind',        cat: 'atta',  unit: 'kg', price: 100, step: 1,    note: '' },
  { k: 'sonamoti',  name: 'Sona Moti atta',          hi: 'landrace, low yield',        cat: 'atta',  unit: 'kg', price: 150, step: 1,    note: 'small lots only' },
  { k: 'basmati',   name: 'Basmati rice',            hi: '1509 / 1718, unpolished',    cat: 'rice',  unit: 'kg', price: 158, step: 1,    note: '' },
  { k: 'kalanamak', name: 'Kalanamak rice',          hi: 'GI-tagged, our own farmers', cat: 'rice',  unit: 'kg', price: 299, step: 0.5,  note: '500 g pack · in every basket' },
  { k: 'arhar',     name: 'Arhar dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 248, step: 0.5,  note: 'source being named' },
  { k: 'moong',     name: 'Moong dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 230, step: 0.5,  note: '' },
  { k: 'chana',     name: 'Chana dal',               hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 185, step: 0.5,  note: '' },
  { k: 'masoor',    name: 'Masoor dal',              hi: 'unpolished',                 cat: 'dal',   unit: 'kg', price: 200, step: 0.5,  note: '' },
  { k: 'oil',       name: 'Kachi ghani mustard oil', hi: 'cold-pressed, not refined',  cat: 'oil',   unit: 'L',  price: 345, step: 0.5,  note: '' },
  /* PROVISIONAL: haldi and dhaniya were one "spice pack" at 680 a kg. They are now
     sold separately at that same figure until the per-item prices are set, so no
     basket total moves. Jeera is out for now. Replace both prices when known. */
  { k: 'haldi',     name: 'Haldi (turmeric)',        hi: 'sun-dried and ground',         cat: 'spice', unit: 'kg', price: 680, step: 0.1,  note: 'processed in 2–3 month batches' },
  { k: 'dhaniya',   name: 'Dhaniya (coriander)',     hi: 'sun-dried and ground',         cat: 'spice', unit: 'kg', price: 680, step: 0.1,  note: 'processed in 2–3 month batches' }
];

/* The MRP rule, finalised: MRP = selling price x 1.05, rounded UP to the rupee.
   It is printed on the pack; the customer pays the selling price. */
window.ECO.mrpOf = function (sp) { return Math.ceil(sp * 1.05 - 1e-9); };

/* Packs: the selling price of each pack. The MRP is derived by the rule above
   (and checked against the pouch artwork for the nineteen packs that have one).
   Oil, haldi and dhaniya packs have no artwork yet, hence confirmed: false. */
window.ECO.MRP = {
  provisional: false,
  reviewed: '2026-11-01',
  packs: [
    { k: 'atta',       pack: 1,   sells: 78,  confirmed: true },
    { k: 'atta',       pack: 2,   sells: 156, confirmed: true },
    { k: 'atta',       pack: 5,   sells: 390, confirmed: true },
    { k: 'bansi',      pack: 1,   sells: 100, confirmed: true },
    { k: 'bansi',      pack: 2,   sells: 200, confirmed: true },
    { k: 'sonamoti',   pack: 1,   sells: 150, confirmed: true },
    { k: 'sonamoti',   pack: 2,   sells: 300, confirmed: true },
    { k: 'basmati',    pack: 1,   sells: 158, confirmed: true },
    { k: 'basmati',    pack: 5,   sells: 790, confirmed: true },
    { k: 'kalanamak',  pack: 0.5, sells: 150, confirmed: true },
    { k: 'kalanamak',  pack: 1,   sells: 299, confirmed: true },
    { k: 'arhar',      pack: 0.5, sells: 124, confirmed: true },
    { k: 'arhar',      pack: 1,   sells: 248, confirmed: true },
    { k: 'moong',      pack: 0.5, sells: 115, confirmed: true },
    { k: 'moong',      pack: 1,   sells: 230, confirmed: true },
    { k: 'chana',      pack: 0.5, sells: 93,  confirmed: true },
    { k: 'chana',      pack: 1,   sells: 185, confirmed: true },
    { k: 'masoor',     pack: 0.5, sells: 100, confirmed: true },
    { k: 'masoor',     pack: 1,   sells: 200, confirmed: true },
    { k: 'oil',        pack: 0.5, sells: 172, confirmed: false },
    { k: 'oil',        pack: 1,   sells: 345, confirmed: false },
    { k: 'haldi',      pack: 0.1, sells: 68,  confirmed: false },
    { k: 'haldi',      pack: 0.5, sells: 340, confirmed: false },
    { k: 'dhaniya',    pack: 0.1, sells: 68,  confirmed: false },
    { k: 'dhaniya',    pack: 0.5, sells: 340, confirmed: false }
  ]
};
window.ECO.MRP.packs.forEach(function (r) { r.mrp = window.ECO.mrpOf(r.sells); });

/* The three starting points. Every quantity is a legal pack multiple. */
window.ECO.TIERS = {
  S: { label: 'Small',  who: '1–2 people', q: { atta: 5,  basmati: 2, kalanamak: 0.5, arhar: 0.5, moong: 0.5, chana: 0.5, masoor: 0.5, oil: 0.5, haldi: 0.1, dhaniya: 0.2 } },
  M: { label: 'Medium', who: '3–4 people', q: { atta: 8,  basmati: 4, kalanamak: 0.5, arhar: 1,   moong: 1,   chana: 1,   masoor: 0.5, oil: 1.5, haldi: 0.2, dhaniya: 0.3 } },
  L: { label: 'Large',  who: '5–6 people', q: { atta: 12, basmati: 6, kalanamak: 0.5, arhar: 1.5, moong: 1.5, chana: 1,   masoor: 1,   oil: 2,   haldi: 0.4, dhaniya: 0.4 } }
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
