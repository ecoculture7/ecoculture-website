# Photography and film brief

The brand rule: **every face has a name, every field a village.** No stock, no
AI imagery, no unnamed people. Every placeholder on the site is a file called
`PLACEHOLDER-*` with a visible band across it. This brief says what replaces each.

## Naming and caching (important)

`/assets/**` is cached for **a year and marked immutable** (`customHttp.yml`).
So **never overwrite a file**. Save each real photo under a new name such as
`hero-ramkhelawan-bundi.jpg`, change the `src` in the page, and delete the
placeholder. Overwriting means returning visitors see the old image for up to a year.

## Technical spec

- JPEG or WebP, **under 150 KB** each. Export at 1600 px wide, quality ~75.
- Keep each photo's aspect ratio as below, or the layout will crop it.
- Add real `alt` text (the person, the place, what is happening). Decorative
  images keep `alt=""`.
- Shoot in daylight. No filters. People looking at their work, not at the camera,
  unless they choose to.
- **Written consent from every person shown** (name, village, photo, quote).

## Photos

| Replaces | Where it appears | Ratio | What to shoot |
|---|---|---|---|
| `PLACEHOLDER-hero-grain.jpg` | Homepage hero, **full width behind the headline** | 16:9, **2000 px wide** | A named farmer at harvest or at the weigh-in. **Leave the left half calm and dark-ish** (sky, crop, shadow): the headline sits there. Put the person in the right third. Under 250 KB. The caption names them: `[ farmer ], [ village ], Bundi · [ month ]` |
| `PLACEHOLDER-bundi-field.jpg` | Homepage and /sourcing, Bundi card | 3:2 | A wide Bundi field with its crop, in daylight, with the village or a landmark recognisable |
| `PLACEHOLDER-skn-paddy.jpg` | Homepage and /sourcing, Sant Kabir Nagar card | 3:2 | Kalanamak paddy, black husk visible if possible |
| `PLACEHOLDER-farmers-field.jpg` | /sourcing farmer cards (three) | 3:2 | One portrait-in-the-field per farmer: **three different photos**, not one reused |
| `PLACEHOLDER-story-light.jpg` | Homepage **"Hold a trial pack" band**, full width behind the copy (and /story) | 16:9, 2000 px wide | Warm, calm, low-contrast: a field at golden hour or hands at the scale. The headline sits on the left half. Under 250 KB |
| `PLACEHOLDER-farmers-field.jpg` (also used as the strip at the top of the **membership "Joining a harvest" panel**) | Homepage membership | 16:7 crop | The weigh-in or a named farmer at the field; a wide, short crop of the same shoot |

Extras worth shooting at the same visit:
- The **scale** during a weigh-in, with the farmer and the number visible.
- The **sealed lot**: sacks with lot code and seal.
- The **ghani** pressing mustard oil.
- A **self-help group** cleaning and grading dal.
- The **lab sample** bag and a **residue report** next to the sacks, if allowed.
- Photos for the two big infographic gaps: a real scale and a real report, which
  would replace the icons on /proof.

## Film

One 45–60 second film from the November Kharif weigh-in: **the scale, the lots
and the payment**, as promised on the homepage. The shell is already on the
homepage (Where we are). To switch it on, follow the comment in `index.html`
next to `.video__empty`.

- **Self-host** the file in `assets/video/` (the CSP allows `media-src 'self'` and
  nothing else, deliberately: no third-party player, no tracking).
- MP4 (H.264 + AAC), 1280×720, **under 8 MB**. A phone on mobile data is the
  test. No autoplay, no loop; the visitor presses play.
- A poster image (`assets/img/weigh-in-poster.jpg`), and **captions** as a
  `.vtt` file: many people watch without sound, and Hindi speech needs English
  captions (and the reverse).
- Name each farmer on screen when they speak. Same consent rule as photos.
