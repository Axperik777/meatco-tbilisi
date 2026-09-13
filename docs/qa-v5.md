# MeatCO v5 verification

2026-09-13. Browser UI exercised through the Codex browser against the local build.

- RU mobile 390×844: home search/categories above the first product, no horizontal page overflow.
- KA and EN at 360×800: language changes, product detail, basket, prices, video copy and WhatsApp text. Fixed long Georgian words causing horizontal basket overflow; checked the single unpriced-item case too.
- Desktop RU at 1366×900: complete hero and general freshness/delivery offer, header basket and finder.
- Added pork 1.5kg at 14, beef tenderloin 1kg at 60: subtotal 81 GEL. Added two chickens at 17: 115 GEL. Increased beef to 1.5kg: 145 GEL.
- Integer-only pieces reject 1.5 in product detail and basket. Invalid basket draft survives editing a different item and prevents checkout. Decimal comma accepted for kg.
- Tripe without a price remains outside the subtotal and is explicitly listed for confirmation. When it is the only item, no false zero total is shown.
- Reload and page navigation preserve selected product IDs and quantities; removing every item returns the empty basket.
- Basket video checkbox, Vake, a test cutting instruction and eggs combined correctly in the prepared WhatsApp message. Fixed extras resetting during checkbox input.
- Product video request contains the selected localized product and the correct business WhatsApp number.
- Search: ribs with е/ё, mixed word order, chicken synonym, Georgian khinkali, Russian aspic and unknown query. Category restriction can be reset without losing the query.
- No browser console errors observed during exercised flows.
- Turkey replacement visually inspected: one adult turkey with long spread drumsticks, distinct from the compact chicken image. Built-in generated illustration; provenance retained internally.

No real message was sent, no order or payment created. Runtime checks cover desktop browser viewport emulation, not physical iOS/Android devices or the manager's response. No native Georgian reviewer, conversion experiment, payment or delivery test was performed.
