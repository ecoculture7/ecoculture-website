# Pending for launch — as of 1 November 2026

The site is live on `main` with the 22 October prices, shelf-anchored MRPs, the
1 November pack renders and the new hero. What is left is below, grouped by who
has to act. Tick items here; `DEPLOY.md` Phase 6 is the older checklist and
this one supersedes it.

## A. Needs a decision or a document from the founder

- [ ] **FSSAI licence number.** `[ NUMBER ]` sits in the footer of all 16 pages
      and `[ 14 digits ]` on every pack face. Nothing ships without it.
- [ ] **Everyday atta variety.** ₹78 holds only if Raj 4037 is the everyday
      atta and PSF commits 46 qtl. If Pegumbari becomes the everyday atta the
      line is ~₹110 and the Medium basket ~₹3,306. The pack back already prints
      "Raj 4037". (Price list §3.)
- [ ] **GST, with the CA.** Inclusive pricing is what the site shows; ITC on
      FPC purchases and lab fees, and GST on the delivery charge, are open.
      None of it changes a page unless the CA says prices must be ex-GST.
- [ ] **Haldi and dhaniya prices.** Both sell at a provisional ₹680 a kilo
      (the old spice-pack figure). The packs are 100 g / 200 g with MRPs ₹72 /
      ₹143 printed. Confirm the per-kilo price or replace it.
- [ ] **Jeera.** Renders exist (100 g, 200 g) but jeera is not a SKU on the
      site. In or out?
- [ ] **The hero claim.** "Staples grown without chemicals" must be true of
      every SKU, including anything bought in through the FPO rather than grown
      by farmers Ecoculture trained. Confirm, or the line softens.
- [ ] **Arhar.** The Banda track is named before arhar ships, or arhar comes
      off all three starting baskets. The site says "source being named".
- [ ] **Story page.** `[ founder to review and edit this text ]` on
      `/story.html`.

## B. Needs details from the collectives (PSF)

- [ ] **Sourcing profiles.** Samriddh Mahila FPO: member count, acres, a line
      in their own words. Sant Kabir Nagar: the collective's name, farmers
      trained, acres. Banda: the collective, once there is one. Written consent
      for each. (`FARMER-DETAILS-REQUEST.md` is the ask.)
- [ ] **District cards on the homepage.** `[ number ]` farming families and
      farmers trained, `[ km ]` distance, `[ month ]` harvest.
- [ ] **The first real residue report** for `/proof` and the homepage
      specimen: lab name, panel screened, date, PDF. Issued after the
      November weigh-in.

## C. Legal pages (drafts, bracketed, with a visible Draft banner)

- [ ] `/terms.html`: registered address, tax treatment, payment gateway,
      date, and the clause marked "to be drafted by legal counsel".
- [ ] `/privacy.html`: registered address, delivery partner, payment gateway,
      retention time.
- [ ] `/shipping.html`: covered areas and pincodes, the reporting window,
      re-delivery attempts.
- [ ] `/refunds.html`: the reporting window, gateway processing times, the
      clause marked "confirm with legal".
- [ ] CA and lawyer review of all four, then remove the Draft banners.

## D. Infrastructure

- [ ] **Amplify production.** Connect `main` as the production branch, attach
      `ecoculture.in`, then delete `CNAME` and turn off GitHub Pages
      (`DEPLOY.md` Phase 7).
- [ ] **Reserve form backend.** The form today hands off to WhatsApp and
      email, which works but is manual. Deploy `backend/reserve/` (Lambda +
      DynamoDB + SES), set `data-endpoint` on the form, test with a real
      address and wait for the email.
- [ ] **Pack artwork, printable.** Every pack still carries `[ FSSAI logo ]`,
      `[ processor name, address ]`, `[ registered address ]`, `[ phone ]`,
      `[ email ]`, and the lot-sticker QR system has to exist before "Scan the
      lot sticker" means anything.

## E. Site quality, not blocking

- [ ] Convert the 20 JPEGs over 250 KB (about 6.9 MB on the homepage) to WebP
      with `<picture>` fallbacks. The pack renders already are.
- [ ] Price guards on `build.html` and `shipping.html` figures (QA §2.2).
- [ ] Basket composition chart sums to 101%; give the largest slice the
      remainder.
- [ ] One icon sprite, not two (`icons.v1.svg`, `icons.v2.svg`).
- [ ] "Soil Ecology" lettering inside the tile image is marginal contrast.
- [ ] The two QA reports (`QA-2026-10-31.md`, `QA-2026-11-01.md`) are in the
      public repo. Move or delete them.
- [ ] Trial-pack and pricing copy says "December 2026" in several places; keep
      that date true or change it in one pass.

## Done, for the record

- [x] Selling prices and shelf-anchored MRPs from the 22 October list, in
      `data/prices.js` only, with drift guards; `/mrp.html` holds the method.
- [x] Pack renders of 1 November on all twelve item cards, MRPs printed.
- [x] Hero line per the 1 November review.
- [x] The collective is named everywhere, never an individual farmer.
- [x] Real photographs: hero, fields, drums, founder; painted tiles, loop and
      step images in brand colours. The only placeholder image left is the
      Banda card on `/sourcing.html`, visibly a placeholder.
- [x] No "15% off", no unsourced statistics from the old site.
- [x] Reserve form live via WhatsApp and email; nothing is silently lost.
- [x] Sitemap and robots for the sixteen-page site.
