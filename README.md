# ecoculture.in

The Ecoculture website. Plain HTML, CSS and vanilla JavaScript — **no build step,
no framework, no dependencies.** Open any `.html` file in a browser and it works.

## Why it is built this way

Ten pages whose copy changes rarely, one interactive basket builder, and an
audience on Indian mobile connections. A framework would add a build pipeline
and a dependency tree to maintain for no gain a visitor can see.

## Layout

```
index.html            the homepage
basket.html           /basket   — what you get
build.html            /build    — the working basket builder
sourcing.html         /sourcing — where it comes from
proof.html            /proof    — the lab report
membership.html       /membership
story.html  faq.html  contact.html  farmers.html  404.html
terms.html  privacy.html  shipping.html  refunds.html

styles/tokens.css     colour, type, spacing. The only file with hex values.
styles/site.css       everything else. Mobile first, breakpoints 768 and 1100.
data/prices.js        EVERY price on the site. Nothing else holds a rupee figure.
assets/               logo and images
_redirects            Netlify redirects, including the old site's URLs
```

## The two rules that matter

**1. Prices live in `data/prices.js` and nowhere else.** If you find a rupee
figure in an HTML file, that is a bug. Figures marked `provisional: true` are
not yet confirmed — the MRPs are samples pending the CA.

**2. Colours live in `styles/tokens.css` and nowhere else.** `--ink-faint` fails
WCAG AA at 2.7:1 and is for rules and dividers only, never for text a reader
needs. Touch targets are never under 44px (`--tap`).

## Working on it with Claude Code

```
cd <this folder>
claude
```

Then say what you want changed. It reads the whole repo and knows these rules
because this file is in it.

## Deploying — AWS Amplify Hosting

Amplify connects to this GitHub repo and deploys on push. `main` is production;
any other branch gets its own preview URL you can open on a phone before merging.

| File | What it does |
|---|---|
| `amplify.yml` | build spec. There is no build — the repo IS the site. |
| `amplify-redirects.json` | paste into Amplify console → Hosting → Rewrites and redirects → Open text editor |
| `customHttp.yml` | security headers and cache policy, applied on every deploy |

The Content-Security-Policy is strict: `script-src 'self'`, no `unsafe-inline`.
That is why the menu script lives in `scripts/site.js` and not in the page. If
you add a script, add the file — do not inline it, and do not loosen the policy.

**Delete `CNAME` when the move happens.** It is a GitHub Pages file and does
nothing on Amplify except confuse whoever reads the repo next.

### The form needs a decision

Amplify Hosting serves static files. It does not receive form posts. The
reservation form currently posts nowhere. Pick one before launch:

- **A form service** (Formspree, Web3Forms). One attribute on the `<form>`,
  works immediately, free tier around 50 submissions a month.
- **API Gateway → Lambda → DynamoDB**, with SES emailing admin@ecoculture.in
  on each submission. Costs effectively nothing against the Activate credit,
  and is about a day of work.

Whichever you choose, **the form must email you on every submission.** The old
site may have been silently discarding signups for months; a confirmation you
can see is what stops that happening twice.

## Before this replaces the live site

- [ ] Real photography. Every image is a placeholder, named `PLACEHOLDER-*`
      and carrying a visible band. The brand rule is that every face has a
      name and every field a village — stock imagery is fatal to it.
- [ ] FSSAI licence number in the footer (currently `[ NUMBER ]`).
- [ ] Confirmed per-pack MRPs in `data/prices.js`.
- [ ] The four legal pages written, not just linked.
- [ ] A named arhar source, or arhar comes off the basket.
- [ ] The real residue report replaces the specimen on /proof.
- [ ] Decide what happens to the old site's "15% off first order" promise.
