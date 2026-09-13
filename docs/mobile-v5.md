# MeatCO: quick product discovery

Purpose: customers coming from Meta or WhatsApp can find a cut, see its unit price and start a WhatsApp order.

Keep the v4 brand: claret #641e2c, forest #213b31, porcelain #f7f8f4, limestone #e8e9e1, ink #222b25. Prata/Noto Serif Georgian for restrained headings, Manrope/NotoGeo for controls and prices.

Mobile structure:
MeatCO header → compact headline → search + category links → compact product cards.
Persistent bottom actions: Catalog | Search | Basket.

Search shows matching raw products directly, including familiar dish names based on the existing cut recommendations. Normalize ё/е and case; match words in any order. Do not add fake stock, fuzzy substitutions or an external search service.

Catalog: search before categories, controls stay reachable when scrolling. Preserve search when changing category and provide a route to all categories if a match exists elsewhere.

Order: add several products, edit quantity, review estimated item total, send one WhatsApp message. Area, comment and grocery extras are optional. Add a checkbox asking to see the selected meat on video. Product detail has a separate video request link.

Critique: the previous mobile hero delayed categories to y=703 and the first product to y=957 at a 390×844 viewport. Large photos and branding are already in the product cards; a second large mobile hero costs discovery space. Retain the full visual hero on desktop, compress it to the headline on mobile.

No claim of measured conversion lift. Validate navigation, query matching, locality, accessibility and layout; actual shopper timing still needs a user test.

After implementation at 390×844 on RU home: search top 235px, categories 286px, first product 505px. Full desktop photo remains, with a general freshness/delivery offer replacing the tenderloin price tag.
