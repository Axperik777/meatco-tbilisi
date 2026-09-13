# Mobile fonts — v8.3

Scope: font assets, font loading and mobile typography. The app shell, colors, product data, translations, cart and WhatsApp builder are unchanged.

## Published font policy

- Manrope: real 400, 600 and 700 static WOFF2 faces, Latin/Russian subset. No 800/900 or italic.
- NotoGeo: original regular 400 and bold 700 converted to WOFF2. A CSS request for 600 selects the existing 700 face; a separate Georgian semibold file is not downloaded.
- Georgian WOFF2 is embedded in the render-blocking fonts.css. This small static critical subset also covers the Georgian language button. KA uses NotoGeo for its H1 and UI, including Latin words; no Manrope or Prata network request is needed on the KA Home screen.
- Prata 400 is restricted to the actual RU/EN Home headline glyphs. If these headline strings change, regenerate the subset.
- The early head bootstrap uses the existing URL > saved language > ka precedence, before CSS. RU/EN preload Manrope regular and semibold; Prata is preloaded only for a Home entry. Catalog and Help entries do not preload Prata.
- Six old public TTF files were removed (795,264 bytes), including ExtraBold and the unused 381,592-byte Georgian serif. Original used sources live outside dist in tools/font-sources.
- No Google Fonts CSS, @import, external font request, new typeface or package dependency is shipped to the browser.

Sans faces use swap; Prata uses optional so a late serif does not replace the visible fallback. These modes follow [MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/font-display). Local fallback faces have size-adjust plus ascent/descent/line-gap overrides, as described in [MDN @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).

Segoe UI / Arial advance widths are calibrated against the actual RU/EN UI strings; Georgia / Times are calibrated against the two Home headlines. Roboto uses an approximate x-height adjustment, not an Android device measurement. Fallback metrics reduce wrapping changes; they cannot guarantee identical glyph widths on every OS.

## Font budget

Sizes exclude HTTP headers and use gzip for the font CSS; WOFF2 is already compressed.

| Resource | Bytes |
| --- | ---: |
| Manrope 400 | 16,908 |
| Manrope 600 | 17,272 |
| Manrope 700 | 17,376 |
| Prata 400 headline subset | 2,876 |
| fonts.css including Georgian 400/700 | ~28,300 gzip |
| Worst-case RU/EN Home total | ~83 KB |
| KA Home total | ~28 KB |

The exact asset hashes and Python gzip-level-9 calculation are in font-build.json. Node's default gzip gives a slightly different total (82,644 bytes). In the local HTTP probe, KA requested only fonts.css; RU/EN requested it plus the four Latin/Cyrillic WOFF2 files.

## Mobile scale

One max-width:639px media query sets 11/12/13/15/16/18/20 px kicker/caption/UI/body/product/section/price and clamp(28px,8vw,34px) H1. The 11px size is reserved for noninteractive kickers; visible buttons and inputs are at least 12px. Tabs are 12px, cart CTA 13px/48px high.

Home H1 uses 1.18 line-height, -0.02em tracking on RU/EN, zero tracking on KA, and four pixels of glyph breathing room below the line box. Product titles use 1.25 line-height, two-line ellipsis and retain their full accessible name. The product sheet shows the full name.

Desktop tokens remain 18px product / 20px section / 22px price / up to 44px hero.

## Verification

- Home checked on KA/RU/EN at 360, 390 and 430 outer viewport widths. On this desktop browser the vertical scrollbar consumes 15px of content width. No horizontal page overflow and no interactive text below 12px.
- Header, category labels, catalog, weight controls and cart reviewed; Georgian cart at 360px and catalog at 430px, Russian cart and English cart reviewed. Requested strings are covered by the subset; long beef-round names retain two-line truncation in cards and wrap in the cart.
- 844×390 landscape: KA/RU/EN H1 does not overlap the subtitle or chips, no page overflow. 1440px desktop computed scale stays 44/18/20/22.
- Local delayed-response profile: 400ms response delay, ~1.6Mbps per response, additional 3s delay for external WOFF2. This is a local approximation, not a physical-phone Slow 4G benchmark.
- KA first contentful paint ~1.11s in that profile; NotoGeo 400/700 loaded, other families unused; total observed CLS 0.
- Isolated 3s font delay on RU/EN: Home H1, subtitle, category row, product rail and tab bar keep the same measured rectangles before and after the fonts arrive. Remaining font-timed CLS is below 0.0001 (small inline label-width differences).
- **Separate existing issue:** generated HTML initially contains Georgian text. The existing deferred locale code replaces it for RU/EN. That replacement produces ~0.13–0.14 CLS in the delayed probe, before the font swap. This pass does not change translation behavior or hide readable content to conceal it. Total RU/EN page CLS is therefore not zero.
- This is Chromium responsive QA on Windows. Physical iOS/Android rendering has not been verified.
- Full validation: 3 pages, 3×346 UI keys, 46 products/42 prices, 19 search cases, 21 cart/message cases and 350 locale/entry font-preload cases.

## Rebuilding

Normal build/CI uses the committed WOFF2 assets; Python is not needed for deployment.

To regenerate fonts on the Windows workstation, install fonttools[woff], brotli and zopfli in a local environment and run tools/build-fonts.py. It reads the original used fonts from tools/font-sources, obtains no network data, and uses local Windows fallback fonts to recalculate metrics. Then run node build.mjs and node validate.mjs.

The official Manrope variable source supplies the missing real 600/700 instances. Its pinned Google Fonts commit, URL and licenses are recorded in tools/font-sources/provenance.json and dist/assets/fonts. Existing Manrope regular, Prata and Georgian regular/bold sources are retained.

