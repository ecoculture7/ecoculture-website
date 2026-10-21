# Temporary images: generation prompts and stock searches

These stand in until the real shoot (see `SHOT-LIST.md`). Three rules, because the
brand promise is *every face has a name, every field a village*:

1. **Keep the placeholder band on every generated or stock image.** The band
   (`PLACEHOLDER — not a photograph of a real field`) is removed only when a real,
   consented photograph replaces the file. A generated image that looks real and is
   not labelled is the one thing that would undo the site's whole argument.
2. **No faces presented as farmers.** Hands, backs, figures at a distance, or no
   people at all. Never put a generated person next to a name, a village or a quote.
3. **Name files for what they are**: `GEN-hero-grain.jpg`, `STOCK-bundi-field.jpg`.
   Never overwrite a `PLACEHOLDER-*` file; the assets folder is cached for a year.
   Change the `src` in the page instead.

Export every image as JPEG, quality ~75, at the width given; keep each under the
size given. Use the same colour grade across the set: warm, slightly desaturated,
natural daylight, no HDR, no filters, no vignette.

A style line to paste at the end of every prompt:

> Natural daylight, documentary photography, 35mm, shallow but honest depth of
> field, warm muted colour, no HDR, no filter, no text, no logos, no watermarks,
> North Indian plains, realistic, not glossy.

Negative prompt, where the tool takes one:

> stock-photo gloss, smiling model looking at camera, oversaturated, studio
> lighting, text, logo, watermark, cartoon, illustration, dramatic sky

---

## Slot by slot

| Slot | Size | Prompt (add the style line) | Stock search phrase |
|---|---|---|---|
| **Homepage hero** (`PLACEHOLDER-hero-grain.jpg`) | 2000×1125, <250 KB | A farmer seen from behind, waist-up, standing at the edge of a ripe wheat field at dawn in Rajasthan, the left half of the frame calm sky and soft field, the person in the right third, cotton kurta, no face visible | "farmer from behind wheat field dawn India" |
| **Bundi card** (`PLACEHOLDER-bundi-field.jpg`) | 1600×1067, <180 KB | A wide view of a small flat wheat field in Bundi district, Rajasthan, late morning, a low stone boundary wall, a village roofline far in the distance, no people | "Rajasthan wheat field village distance" |
| **Sant Kabir Nagar card** (`PLACEHOLDER-skn-paddy.jpg`) | 1600×1067, <180 KB | Kalanamak paddy close to harvest in eastern Uttar Pradesh, the black husks on the grain heads visible, overcast soft light, the field receding to a line of trees, no people | "black rice paddy close-up eastern UP" |
| **Farmer strip** (membership panel, `PLACEHOLDER-farmers-field.jpg`) | 1800×790, <180 KB | Hands of a farmer holding harvested grain over a large steel weighing scale in a village yard, a sack half-filled beside it, morning light, cropped so no face shows | "farmer hands weighing grain scale India" |
| **Reserve band** (`PLACEHOLDER-story-light.jpg`) | 2000×1125, <250 KB | A quiet village yard at golden hour, jute sacks of grain stacked against a mud wall, a brass vessel, long shadows, warm and low-contrast, no people | "jute sacks grain village golden hour India" |
| **Founder portrait** (`#founder`) | 960×1200, <150 KB | **Do not generate.** Leave the tile as it is until a real portrait exists. A generated face in the founder's slot is an impersonation. |
| **Natural, not organic** (beside the comparison; not yet placed) | 1600×1067, <180 KB | A farmer's hands stirring a blue plastic drum of jeevamrit — a dark fermenting slurry of cow dung, urine, jaggery and gram flour — in a shaded corner of a farmyard, a cow tethered out of focus behind, no face | "farmer preparing jeevamrit drum natural farming" |
| **Lab step** (`/proof`, not yet placed) | 1600×1067, <180 KB | A small sealed sample bag of wheat grain beside a tagged jute sack, a paper tag with a handwritten lot code, on a wooden table in daylight, no people | "grain sample bag lab tag sack" |

## The twelve item tiles (`#basket`)

Same frame for all twelve so the grid reads as a set: **1200×900 (4:3)**, under 90 KB
each, the item in a plain shallow terracotta or steel bowl on a worn wooden
surface, lit from one window on the left, muted warm grade, nothing else in frame.
Save as `/assets/img/items/GEN-<key>.jpg` and replace each card's icon with
`<img src="/assets/img/items/GEN-atta.jpg" alt="" width="1200" height="900" loading="lazy">`,
keeping the `Photo pending` tag.

| key | What is in the bowl |
|---|---|
| atta | coarse stone-ground whole wheat flour, a small heap, a few whole grains beside it |
| bansi | durum wheat flour, slightly golden and coarser, a few amber grains beside it |
| sonamoti | small round golden wheat grains, whole, a little flour at the edge |
| basmati | long unpolished basmati grains, light brown, a few husks |
| kalanamak | short black-husked rice grains, a few grains dehusked to show the white inside |
| arhar | split pigeon pea, dull yellow, unpolished and matte |
| moong | split yellow moong dal, matte, unpolished |
| chana | split chana dal, deep yellow, matte |
| masoor | split red lentil, dull orange-pink, unpolished |
| oil | a small glass bottle of dark golden mustard oil, a few mustard seeds spilled beside it |
| haldi | a heap of ground turmeric beside two dried turmeric fingers |
| dhaniya | a heap of ground coriander beside a few whole coriander seeds |

Stock search phrase for the set: "<item> in bowl rustic wooden table natural light".

## If you want film for the hero

Only if it stays silent, under 4 MB, 10–15 seconds, and loops without a visible
cut. Prompt: *"Slow handheld drift across a ripe wheat field at dawn, heads of
grain moving gently, warm low sun from the right, no people, no text."* Export
1280×720 H.264. The hero markup accepts a `<video autoplay muted loop playsinline>`
in place of the `<img>`; keep the `poster` as the still above.
