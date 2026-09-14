# Pre-launch fixes — 14 September 2026

- Confirmed owner rules: daily 10:00–18:00, minimum 50 GEL; free courier delivery from 200 GEL in meat. Below 200 GEL the address-based fee is added separately and agreed in WhatsApp. Payment by cash, transfer or card; no specific payment timing promised.
- Cart subtotal, delivery row, visible message preview and outgoing order agree. Free delivery remains conditional on the final weighed meat total. No invented flat delivery fee.
- Four unpriced products open a price/availability inquiry. The product sheet includes the selected quantity and preparation note. New unpriced cart additions are blocked; previously saved unpriced lines retain a price-query link.
- Russian question greeting starts with «Здравствуйте!». Georgian question template corrected. All new conditions translated into ka/ru/en.
- Home operations switch using Asia/Tbilisi before 10:00 and after 18:00, including the main support copy after closing.
- Familiar small add-ons only, ranked by extra cost; return to the catalog if no suitable 0.5/1 kg addition reaches the threshold. No premium-cut fallback.
- Header logo filter clamps its background before blending with forest. No new image or brand change.
- Legacy dish action now leads to catalog selection. Khashi no longer recommends pork trotters; their purpose copy now references muzhuzhi and meat jelly. Product identities, categories, units, prices and image assets unchanged; all 46 products retained.
- Static link preview uses a neutral MeatCO title and a short trilingual description rather than a Georgian-only preview on every language URL.

## Verification

- `node build.mjs` and `node validate.mjs` pass: 3 pages, 3 locales, 46 products, 42 prices. Font/image/search checks pass.
- Automated delivery boundaries below/at/above 200 GEL, minimum 50 GEL, all four price-inquiry texts in ka/ru/en, existing question/order separation, sold-out guards and Tbilisi opening/closing boundaries.
- Separate localhost browser origin: 360/390/430 px mobile and 1440 px desktop. Header rectangle removed; inspected Home, Cart and Help, no horizontal overflow in checked views.
- Actual UI flow: card adds 1 kg; 14 GEL checkout disabled; 56 GEL order contains an extra delivery line; 190 GEL requires a fee; 200 GEL shows free delivery. Language switch and reload preserve items/weights.
- Price inquiry reaches the WhatsApp handoff with product name only; sheet inquiry includes weight and note. No test message sent. Cart remained unchanged by inquiry.
- Legacy khashi flow lands in catalog with tripe only. No JavaScript errors in the tested session.

## Deferred / external checks

- Owner explicitly deferred Pixel and new attribution tags. Analytics stays disabled.
- Installed WhatsApp handoff in real iOS/Android and Meta in-app browsers, actual operator reply time, current stock, real cut photos and exact map pin still need real-world verification. No claim of completing those checks.
- No fresh slow-4G Lighthouse run; LCP under 2 seconds is not claimed.
