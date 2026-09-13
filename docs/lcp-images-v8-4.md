# LCP images — v8.4

Scope: image files, markup, request priorities and intrinsic dimensions. No layout redesign, catalog/search changes, translation changes, font changes or WhatsApp checkout changes.

## Changes

- Home's first two photos (pork-flesh, beef-round) are present in the initial HTML with eager loading, high fetch priority, async decoding and explicit dimensions. There are exactly two high-priority img elements per storefront document.
- index.html has one mobile image preload, for the same pork-flesh-small.webp used by the first Home card. It is emitted before the font bootstrap. No logo or category preloads were added.
- Mobile picture sources choose only the real 480px derivative, including on 3x displays. The img fallback keeps actual 480/960 srcset candidates for desktop. The preload matches the mobile source exactly, avoiding a second candidate download.
- sizes reflects the existing 430px phone canvas, 640px Home, 1080px catalog, gaps and borders. Categories remain a horizontal 136px tile row on mobile; applying the brief's hypothetical 25vw would describe the wrong layout.
- Other Home photos and categories are lazy/low. The hidden catalog is entirely lazy on Home. Opening catalog.html directly makes its first four product photos eager, with only the first two marked high; the hidden Home remains lazy.
- Direct index.html#catalog entry was checked too: image hints are assigned to the panel selected by the existing router before its first paint. Four catalog photos are eager, only two high, and all hidden Home photos are lazy. No route or filter logic changed.
- Cart thumbnails and legacy search thumbnails receive src/srcset/sizes/dimensions/loading/priority/decoding when inserted. Product detail images load on opening the sheet. Only image markup in cart-related files changed.
- Hidden order/privacy logos also use the compact WebP and lazy/low loading. These otherwise caused an unexpected 200KB original-logo request even with a compact header.
- 46 product thumbnails were regenerated from the existing originals at 480×480, WebP q73. All 46 original files remain byte-for-byte unchanged.
- Header logo: 360×128 WebP q90, 8,024 bytes, down from 200,654 bytes. Its displayed size and visual design are unchanged.
- The build reads real WebP dimensions and checks available variants. A single-file image does not get a made-up second srcset candidate. Picture source fallback is removed along with srcset if an image fails, preserving the existing neutral-placeholder behavior.
- Fonts were already optimized in v8.3. No TTF request occurred during this image pass.

## Local measurements

Chromium browser PerformanceObserver, 390×844 outer viewport, DPR 1, 400ms response latency and shared 1.6Mbps response bandwidth. Cache-Control: no-store. No CPU slowdown or physical mobile device emulation. The same local server profile served the previous dist snapshot and the new build.

| Home | LCP | LCP element | Total page CLS |
| --- | ---: | --- | ---: |
| KA before | 3,808ms | pork-flesh-small.webp | 0 |
| KA after | 1,684ms | pork-flesh-small.webp | 0 |
| RU after | 1,800ms | pork-flesh-small.webp | 0.133 |
| EN after | 1,884ms | pork-flesh-small.webp | 0.144 |

These are individual lab runs, not field percentiles. The image-only pass meets the <2s Home target in this local network profile; that does not establish <2s on a mid-range phone with slow 4G.

Image transfer (logo + product/category files, including response overhead but excluding favicon): 479,756 → 188,716 bytes, about 61% less. Home requested seven small product/category WebPs and the compact logo, with no 960px original and no large logo before interaction.

At 390px, the first card photo is 163.5×163.5 CSS pixels after the desktop scrollbar and card borders; the fetched file is 480×480. Its attributes are eager / high / async. Both first cards keep square reserved boxes. KA CLS is zero with delayed image arrival.

The RU/EN CLS comes from the existing late replacement of initial Georgian text, as documented in v8.3. It was deliberately not changed by this task. Do not describe total RU/EN CLS as zero.

Direct catalog RU was additionally checked: four eager product images, only two high priorities, no 960px original on mobile. In the same probe its LCP was 3,032ms (third card, eager/low); the <2s claim above applies only to Home. That catalog probe preceded the last logo size reduction and is retained as a diagnostic, not presented as a final phone benchmark.

Raw compact evidence: [lcp-qa-v8-4.json](lcp-qa-v8-4.json). Asset sizes, quality settings and hashes: [image-assets-v8-4.json](image-assets-v8-4.json).

## Validation and maintenance

- node build.mjs and node validate.mjs pass: existing locale/catalog/price checks, 19 search cases, 21 cart/message cases, 350 font-preload cases and image-specific assertions.
- Image assertions check priority counts, one Home preload, lazy hidden panels, real srcset URLs, 480px derivatives under 50KB, image dimensions and single-file fallback.
- Product-photo tap still opens the full image in the product sheet; cart thumbnail is small/lazy/low and the calculated test total remains 33 ₾. The test item was removed; no WhatsApp message was sent.
- Home and Catalog were visually checked at 1440px: square photo boxes and the existing centered canvases are preserved, with no horizontal overflow or browser errors.
- tools/optimize-images.py regenerates small images with Pillow from current catalog originals; it requires Node and Pillow. Normal CI only uses committed assets.
- The public PageSpeed API request returned HTTP 429 (shared project daily quota), so these local results are not a Lighthouse score.

Implementation follows [web.dev LCP optimization](https://web.dev/articles/optimize-lcp) for early discovery and priority, and [responsive image preloading](https://web.dev/articles/preload-responsive-images) for matching the preload candidate to the displayed image.
