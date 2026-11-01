/* ──────────────────────────────────────────────────────────────────────────
   Ecoculture — the single source of truth for every price on this site.
   Nothing else in the codebase should contain a rupee figure for a SKU.

   Rule: at or below the certified-organic shelf, benchmarked against each
   brand's OWN site, never a marketplace listing.

   PROVISIONAL FIGURES ARE MARKED `provisional: true`. The banner on any page
   that shows them reads from that flag, so clearing it is a one-word edit.
   Last reviewed: 1 November 2026, against the consolidated price list of
   22 October 2026. Two prices per item: the selling price (SP, below) and the
   printed MRP, which is SHELF-ANCHORED (see ECO.MRP). The pouch artwork of
   24 October still carries the superseded SP x 1.05 figures and must be
   re-set to the MRPs below before the next label print run.
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

/* MRP — shelf-anchored, decided 22 October 2026 (replaces the +5% rule of
   16 October). The printed MRP of each pack is the own-site price of the
   closest equivalent at three named certified-organic brands on a dated run,
   the highest where more than one sells it. Where there is no like-for-like
   comparator, or the shelf is at or below our selling price, the fallback is
   SP + 5% rounded up to the rupee. No brand is named on a pack or a product
   page; the sources are on one page, /mrp.html. MRP is fixed per label print
   run and re-fetched at each run, not more than quarterly. The selling price
   moves freely beneath it and never exceeds it.
   Pages show the MRP struck through beside the highlighted selling price,
   with the one-line note in fill.js. Nothing reaches a page while
   provisional is true or a pack is unconfirmed. */
window.ECO.mrpFallback = function (sp) { return Math.ceil(sp * 1.05 - 1e-9); };

window.ECO.MRP = {
  provisional: false,         /* set true to pull every MRP and note off the pages in one word */
  rule: 'shelf',
  anchored: '2026-10-21',     /* the dated shelf run the MRPs were read on */
  anchoredLabel: '21 October 2026',
  reviewed: '2026-11-01',
  shelf: ['Swadesi Way', 'Organic Tattva', 'Two Brothers'],
  packs: [
    { k: 'atta',      pack: 1,   sells: 78,  mrp: 90,   anchor: 'Swadesi Way, Lokwan atta 1 kg',                       confirmed: true },
    { k: 'atta',      pack: 2,   sells: 156, mrp: 175,  anchor: 'Swadesi Way, Lokwan atta 2 kg',                       confirmed: true },
    { k: 'atta',      pack: 5,   sells: 390, mrp: 425,  anchor: 'Swadesi Way, Lokwan atta 5 kg (Organic Tattva 399)',  confirmed: true },
    { k: 'bansi',     pack: 1,   sells: 100, mrp: 105,  anchor: 'shelf at our price (Swadesi Way ≈100), fallback +5%', confirmed: true },
    { k: 'bansi',     pack: 2,   sells: 200, mrp: 210,  anchor: 'fallback +5%',                                        confirmed: true },
    { k: 'sonamoti',  pack: 1,   sells: 150, mrp: 158,  anchor: 'shelf below our price (Swadesi Way ≈145), fallback +5%', confirmed: true },
    { k: 'sonamoti',  pack: 2,   sells: 300, mrp: 315,  anchor: 'fallback +5%',                                        confirmed: true },
    { k: 'basmati',   pack: 1,   sells: 158, mrp: 220,  anchor: 'Organic Tattva, Biryani basmati 1 kg',                confirmed: true },
    { k: 'basmati',   pack: 5,   sells: 790, mrp: 1089, anchor: 'Organic Tattva, Biryani basmati 5 kg',                confirmed: true },
    { k: 'kalanamak', pack: 0.5, sells: 150, mrp: 215,  anchor: 'Two Brothers, Kalanamak 2 kg at 855, pro-rated',      confirmed: true },
    { k: 'kalanamak', pack: 1,   sells: 299, mrp: 425,  anchor: 'Two Brothers, Kalanamak 2 kg at 855, pro-rated',      confirmed: true },
    { k: 'arhar',     pack: 0.5, sells: 124, mrp: 135,  anchor: 'Organic Tattva, arhar dal 500 g',                     confirmed: true },
    { k: 'arhar',     pack: 1,   sells: 248, mrp: 270,  anchor: 'Organic Tattva, arhar dal 1 kg',                      confirmed: true },
    { k: 'moong',     pack: 0.5, sells: 115, mrp: 155,  anchor: 'Organic Tattva, moong dal 500 g',                     confirmed: true },
    { k: 'moong',     pack: 1,   sells: 230, mrp: 310,  anchor: 'Organic Tattva, moong dal 1 kg',                      confirmed: true },
    { k: 'chana',     pack: 0.5, sells: 92,  mrp: 120,  anchor: 'Organic Tattva, chana dal 500 g',                     confirmed: true },
    { k: 'chana',     pack: 1,   sells: 185, mrp: 235,  anchor: 'Organic Tattva, chana dal 1 kg',                      confirmed: true },
    { k: 'masoor',    pack: 0.5, sells: 100, mrp: 140,  anchor: 'Organic Tattva, malka masoor 500 g',                  confirmed: true },
    { k: 'masoor',    pack: 1,   sells: 200, mrp: 275,  anchor: 'Organic Tattva, malka masoor 1 kg',                   confirmed: true },
    { k: 'oil',       pack: 0.5, sells: 172, mrp: 200,  anchor: 'Swadesi Way, black mustard oil 500 ml (≈200)',        confirmed: true },
    { k: 'oil',       pack: 1,   sells: 345, mrp: 425,  anchor: 'Two Brothers, mustard oil 1 L',                       confirmed: true },
    /* The list prices one three-spice pack (haldi, dhaniya, jeera) at 68 per
       100 g with no like-for-like comparator, so fallback +5%. Haldi and dhaniya
       are sold separately here at a provisional figure, so their packs stay
       unconfirmed and show no MRP until their own prices are set. */
    { k: 'haldi',     pack: 0.1, sells: 68,  mrp: 72,   anchor: 'no like-for-like comparator, fallback +5%',           confirmed: false },
    { k: 'haldi',     pack: 0.5, sells: 340, mrp: 357,  anchor: 'fallback +5%',                                        confirmed: false },
    { k: 'dhaniya',   pack: 0.1, sells: 68,  mrp: 72,   anchor: 'no like-for-like comparator, fallback +5%',           confirmed: false },
    { k: 'dhaniya',   pack: 0.5, sells: 340, mrp: 357,  anchor: 'fallback +5%',                                        confirmed: false }
  ]
};
/* Every row must respect the rule: selling price never above MRP. */
window.ECO.MRP.packs.forEach(function (r) {
  if (r.mrp == null) r.mrp = window.ECO.mrpFallback(r.sells);
  if (r.sells > r.mrp) throw new Error('prices.js: ' + r.k + ' ' + r.pack + ' sells above its MRP');
});

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
