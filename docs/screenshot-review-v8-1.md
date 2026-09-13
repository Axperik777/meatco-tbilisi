# MeatCO — screenshot refinement after v8

Scope: visual critique and corrections only. No features, products, price changes or checkout changes.

Before screenshots reviewed in the browser: RU home/catalog/cart at 390×844 and home at 1920×1080.

1. First-screen trust: the explanation of weight/delivery was pale and visually secondary; “Tbilisi” repeated the headline. Make the agreement before packing explicit and legible, and use the already supplied Mevele 3 address as the existing location fact.
2. Catalog density: repeated category names and tall gaps below photos delayed the add button. Keep photos large, remove redundant category text visually, tighten copy spacing and toolbar spacing.
3. Cart sheet: one item occupied two full-width rows; a decorative confirmation panel and expired time chips pushed fields down. Place quantity next to the item image, reduce vertical spacing, treat the weight statement as a simple note, and visually omit expired disabled slots. Size the empty sheet to its content.
4. Desktop emptiness: the 1040px canvas left roughly 430px on each side at 1920px. Use a 1320px maximum for wide screens, retain three product columns and constrain image height so larger width does not make the cards taller.
5. Template cues: pill-shaped trust labels, tiny text and repeated borders carried too much visual weight. Use a quiet, unboxed factual row, cleaner category tiles and clearer product names.

Keep the existing palette, logo, typography families, six-product home selection, five catalog categories and bottom tabs. Preserve all three locales and existing order functions.

## After screenshot review

- RU home, 390×844: first Add button ends at 752.6px, above the bottom navigation at 766px. Large square photos remain. No horizontal overflow.
- RU cart with one 1kg beef item, 390×844: form content reduced from 865px to 725px. The comment field is visible without scrolling; the checkout action remains fixed. Item row is 116px tall.
- KA home and cart, 360×800: no horizontal overflow; the fact row fits within 321px. Long product names wrap without colliding with the quantity controls. Filled cart item row is 133.2px.
- KA empty cart: screenshot caught the native dialog stretching despite `height: auto`. Changed to `fit-content`; verified at 262.5px high, anchored at the bottom, with no empty full-screen area.
- EN home and beef catalog, 360×800: reviewed photographs, product names, prices, controls and bottom tabs. No horizontal overflow. On this shorter viewport the home Add buttons still require a small scroll; the catalog has the first row of Add buttons immediately visible.
- RU desktop home, 1920×1080: 1320px content canvas, three large product columns, no horizontal overflow. First Add ends at 980.2px, above navigation at 990px.
- Browser error log: no JavaScript errors during these checks.

All changes are CSS and six copy values across the three languages. No new functionality, catalog data changes or WhatsApp logic changes. Existing validators pass: 346 strings per locale, 46 products / 42 prices, 19 search scenarios and 21 cart checks. Local QA basket was emptied after checking; no WhatsApp message was sent.
