# Getting ecoculture.in live — step by step

Work through this in order. Each phase ends with something you can see, so you
never go more than an hour without knowing whether it worked.

**Read this first:** deploy the homepage *before* building the other fourteen
pages. Learning the deploy loop on one page is much easier than on fifteen, and
any hosting surprise surfaces while there is almost nothing to fix. Phases 1–3
are one evening. Phase 4 onwards is the actual site.

---

## Phase 1 — Get the code on your machine

**1.1 Clone the repo.** Open a terminal (Terminal on Mac, PowerShell on Windows):

```
git clone https://github.com/ecoculture7/ecoculture-website.git
cd ecoculture-website
```

**1.2 Put the old site somewhere safe rather than deleting it.**

```
mkdir _old
git mv index.html about.html farmers.html 404.html favicon.svg robots.txt sitemap.xml _old/
```

Do **not** delete `_old/`. `about.html` and `farmers.html` contain farmer profiles, but
they are **placeholder data, not real people** — do not copy them into the new site.
Real details come from PSF; see `FARMER-DETAILS-REQUEST.md`.

Leave `CNAME` where it is for now. It keeps the current site alive on GitHub
Pages while we build. It gets deleted at cutover, not before.

**1.3 Unzip the scaffold into the repo root**, so you have `index.html`,
`styles/`, `scripts/`, `data/`, `assets/`, `amplify.yml`, `customHttp.yml`,
`amplify-redirects.json`, `README.md` and this file.

**1.4 Look at it.** Double-click `index.html`. It opens in your browser from
your own disk. The fonts will be right this time. The form will not submit —
that is expected and is fixed in Phase 5.

**1.5 Commit, on a branch, not on main.**

```
git checkout -b rebuild
git add -A
git commit -m "New site: foundation and homepage"
git push -u origin rebuild
```

The live site is untouched. Everything from here happens on `rebuild`.

---

## Phase 2 — Open it in Claude Code and settle two unknowns

Open the `ecoculture-website` folder in Claude Code in the Claude desktop app.
It reads the whole repo, including `README.md` and this file, so it knows the
rules without being told.

Ask it these two things. Both are questions I could not answer from outside:

> Read `_old/favicon.svg` and tell me whether it is the full Ecoculture mark —
> gold leaves around teal figures — or a simplified icon. If it is the full
> mark, replace `assets/logo-mark.svg` with it and tell me the file size
> difference.

If it is the real vector, it replaces my traced version, which is an
approximation rebuilt from a 426px PNG.

> In `_old/index.html`, find what happens when the element with class
> `email-btn` is clicked. Does the email address get sent anywhere — a fetch, a
> form post, an API endpoint — or does the success message just appear? Quote
> the code.

**This one matters.** The markup has no `<form>` and the input has no `name`
attribute, which means it cannot submit by ordinary means. If there is no
JavaScript sending it anywhere, then every waitlist signup for the past five
months was discarded the moment someone clicked, and the "no submissions"
result was never about demand.

Tell me both answers and I will adjust.

---

## Phase 3 — Deploy the homepage to Amplify

**3.1** Sign in to the AWS console and open **AWS Amplify**.

**3.2** Under **Deploy**, choose **Get started**.

**3.3** Choose **GitHub** as the repository service, then **Next**. You will be
asked to authorise AWS to read your GitHub account — approve it for the
`ecoculture-website` repository only, not all repositories.

**3.4** Choose the `ecoculture-website` repo, and **the `rebuild` branch, not
`main`.** Then **Next**.

**3.5** Build settings: Amplify will detect `amplify.yml` in the repo and use
it. It declares that there is no build step and that the whole repo is the site.
Accept and choose **Next**.

**3.6** Review, then **Save and deploy**.

Two or three minutes later you get a URL like
`https://rebuild.d1a2b3c4d5.amplifyapp.com`.

**3.7 Open that URL on your actual phone.** Not the desktop browser window
resized — a real phone on mobile data. This is the only test that counts: more
than half your respondents buy staples on ten-minute apps, so they live on
phones with ordinary connections.

**3.8 Add the redirects.** In the Amplify console, go to **Hosting → Rewrites
and redirects → Open text editor**, and paste the contents of
`amplify-redirects.json`.

From now on, every push to `rebuild` redeploys that URL automatically. That is
your preview. Nothing reaches ecoculture.in until Phase 7.

---

## Phase 4 — Build the remaining pages

Fourteen to go: `basket`, `build`, `sourcing`, `proof`, `membership`, `story`,
`faq`, `contact`, `farmers`, `404`, and the four legal pages.

The designs exist as artboards in the Ecoculture Website canvas. The basket
builder is already written and working there — it ports to vanilla JavaScript
almost directly.

Work in batches of two or three pages, pushing to `rebuild` after each batch and
checking the preview on your phone. Do not build all fourteen and then look.

The four legal pages — Terms, Privacy, Shipping & Delivery, Refund &
Cancellation — are not design work and are not optional. **No Indian payment
gateway will onboard you without them.** They need your FSSAI number, your
registered address, and your actual delivery and refund terms. Draft them with
your CA in the same conversation as the GST and MRP questions.

---

## Phase 5 — Make the form actually work

Amplify Hosting serves files. It does not receive form posts. Pick one:

**Option A — a form service.** Formspree or Web3Forms. One `action` attribute
on the `<form>` in `index.html`. Working in ten minutes, free up to roughly 50
submissions a month.

**Option B — API Gateway → Lambda → DynamoDB**, with SES emailing you on each
submission. Costs nothing against your Activate credit. About a day.

Either way, **one rule: the form must email admin@ecoculture.in on every
submission.** A form that shows "Thank you!" and stores nothing looks exactly
like a form nobody used. That may already have cost you five months of signups.
A confirmation you can see is the only thing that prevents a repeat.

**Test it by submitting a real address and waiting for the email.** Not by
reading the code.

---

## Phase 6 — The checklist before cutover

Nothing here is optional, and none of it is design.

- [ ] **Photography.** Every image is named `PLACEHOLDER-*` and renders with a
      band across it reading "not a photograph of a real field". The brand rule
      is that every face has a name and every field a village. One caught
      instance of stock imagery undoes the whole argument.
- [ ] **FSSAI licence number** in the footer, replacing `[ NUMBER ]`.
- [ ] **Confirmed per-pack MRPs** in `data/prices.js`. Clear `provisional: true`
      only when the CA has signed them off.
- [ ] **The four legal pages written**, not just linked.
- [ ] **A named arhar source**, or arhar comes off the basket. It is in all
      three pre-filled baskets and the page currently says "source being named".
- [ ] **Real farmer details from PSF** in `/sourcing` and `/farmers` (every `[ bracket ]` filled, with written consent), per `FARMER-DETAILS-REQUEST.md`.
- [ ] **The real residue report** replaces the specimen on `/proof`.
- [ ] **The six unsourced statistics** from the old site do not reappear:
      ₹10,218 farmer income, 30% soil collapse, 40% pesticide residue increase,
      250M farmers in debt, 40% soil health improvement, 38% income increase.
      Each needs a citation or stays off.
- [ ] **No "15% off your first order"** anywhere. The new pricing has no launch
      discount, and the Kalanamak panel says so explicitly.
- [ ] **`sitemap.xml` and `robots.txt` regenerated** for the fifteen-page site.
- [ ] **Form tested end to end** with a real address.

---

## Phase 7 — Cutover

**7.1 Merge to main.**

```
git checkout main
git merge rebuild
git rm CNAME
git commit -m "Remove GitHub Pages CNAME; site now on Amplify"
git push
```

**7.2** In Amplify, connect the `main` branch as production.

**7.3** Add the custom domain: **Hosting → Custom domains → Add domain**, enter
`ecoculture.in`. Amplify issues the SSL certificate and gives you the DNS
records to create.

**7.4** Create those records wherever `ecoculture.in` is registered. If the
domain is not in Route 53, you add them at your current registrar — you do not
need to transfer the domain to AWS. DNS takes anywhere from minutes to a few
hours to propagate.

**7.5** In GitHub, turn off Pages: **Settings → Pages → Source → None.** If you
skip this, two hosts believe they serve the same domain, which produces
intermittent and very confusing results.

**7.6** After it resolves, check: the homepage on a phone, `/about.html`
redirecting to `/sourcing.html`, a nonsense URL landing on the 404 page, and one
real form submission arriving in your inbox.

**7.7** In Google Search Console, submit the new `sitemap.xml`.

---

## If something breaks

Amplify keeps every deploy. **Hosting → the branch → the deploy list →
Redeploy this version** puts the previous one back in about a minute.

And because every change is a git commit, `git revert` undoes any single one
without touching the rest.
