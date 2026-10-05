Everleaf responsive verification

- 160 checks: eight site pages at 360, 390, 768, 1024 and 1440px, in light/dark themes and LTR/RTL.
- 300 checks: fifteen article pages with the same viewport/theme/direction matrix.
- 20 final header checks, including brand visibility and overlap detection.
- Product category shortcuts, subscription enquiry routing and article navigation passed.
- All local links and image references resolve; images on the eight main pages loaded successfully.
- Keyboard focus and reduced-motion behavior passed.
- Visually reviewed 360px dark RTL screenshots for the header, About values and subscription cards.

Browser: headless Microsoft Edge through cached Playwright.
Run QA scripts from the repository root; their browser-library path is machine-specific.
No deployment or external form submissions were performed.

Article consolidation verification:
- All 15 article bodies preserved exactly in assets/js/blog-articles.js.
- All 15 card links and browser back navigation passed.
- Five missing/invalid ID cases passed, including prototype-name and markup inputs.
- 40 responsive details-page checks passed at 360, 390, 768, 1024 and 1440px in both themes and directions.
- No browser JavaScript errors; 360px screenshots reviewed.
- Removed 15 article-*.html files after verification; final local links resolve.
