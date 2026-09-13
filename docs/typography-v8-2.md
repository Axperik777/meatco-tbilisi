# MeatCO v8.2 — typography and spacing only

The shared token block lives in `dist/app-shell.css`. The existing `style.css` and `app-ui.css` inherit its type, spacing and radius tokens. Repeated locale-specific and viewport-specific type overrides were removed from the active app layer.

- Home H1 alone uses Prata / the already installed Noto Serif Georgian fallback, 32–44px / 400. All other app text uses the existing Manrope / NotoGeo stack.
- UI 14px, body/help 15px, product titles 18px / 700, section headings 20px / 700, prices 22px / 700, unit captions 12px. Cart line names 15px / 650; line totals 16px / 700.
- Supplied Manrope files are static Regular 400 and ExtraBold 800. The former CSS falsely mapped ExtraBold to 700–900. Removed that registration so the browser synthesizes requested semibold/bold from the installed Regular face. No font files were added or edited. Georgian keeps its existing Regular and Bold 700 files.
- Home and its header share a centered 640px maximum; catalog and its header use 1080px and three columns. Narrow screens use the 430px app maximum, 16px side gutters and two product columns.
- Category labels remain 14px. On phones, fixed-width 136px photo tiles scroll horizontally instead of squeezing four labels into narrow columns. Long labels wrap naturally; none are ellipsized or clamped.
- Product grid gaps: 12px mobile / 16px desktop. Card padding: 12px / 12px / 14px as requested. Home sections use 32px spacing; controls use 44–48px minimum targets. Six-pixel icon-to-tab-label gap and 14px card bottom padding are the explicit rhythm exceptions.
- Safe-area spacing is applied to the header, tabs and sheet footer. Body clearance uses the tab-height token, safe-area bottom and 16px.

## Browser checks

- 390×844: RU, KA and EN Home reviewed; KA catalog, product sheet, basket, Help and end-of-Help reviewed.
- No horizontal document overflow in those screens. DOM inspection found no visible text below 11px on Home, catalog or Help.
- KA product titles retain 18px; category labels retain 14px and grow to two lines. Longer product names may use three lines; full names are preserved.
- KA basket CTA is 14px, ends at y=827 within the 844px viewport; cart name 15px / 650, line price 16px. No sheet overflow.
- KA end-of-Help ends at y=755.6; tab bar starts at y=771, leaving about 15px clearance.
- 1440×1000: RU Home is centered at 640px with the header aligned to it. Catalog is 1080px, three ~349px columns, 16px gaps; price 22px, unit 12px. RU basket and empty state verified (240px empty sheet).
- No browser JavaScript errors. Test basket emptied; no order or WhatsApp message sent.

Checks use browser viewport emulation, not physical-device testing. No scripts, checkout payload, translations, i18n keys, catalog data, images or product templates were changed. Generated HTML only updates CSS content hashes.
