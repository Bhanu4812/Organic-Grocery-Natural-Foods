# Everleaf Organic Grocery HTML Template

Open `pages/index.html` directly or serve the project root with any static server. The project is dependency-free.

## Structure and customization

- `assets/css/style.css` contains tokens, components, layouts and responsive rules. Change colors and font stacks in `:root`.
- `assets/css/dark-mode.css` contains intentional dark-theme overrides. The toggle uses `localStorage` and falls back to the system preference.
- `assets/css/rtl.css` provides RTL fallbacks; add `dir="rtl"` to `<html>` to enable it.
- `assets/js/main.js` handles navigation, search, cart demo, tabs, accordions, validation, password visibility and filters.
- `assets/js/lucide.min.js` is a pinned local copy of the single icon library used throughout the interface, so icons also work when pages are opened directly.
- Replace files in `assets/images/` and preserve aspect ratios. Update image `src`, `width`, `height` and useful `alt` text together.
- `pages/` contains all website HTML pages, including the home, shop, account and utility pages.

Navigation and footer markup are intentionally identical across public pages. Update each occurrence when adding a route. Forms are front-end demos: replace `action="#"` with a Formspree endpoint or add Netlify attributes. Newsletter forms are ready for a Mailchimp/ConvertKit action URL. Cart and subscription buttons are placeholders for a future Stripe, PayPal or store backend integration; no payment or private key is included.

The demo cart stores unique product IDs in `localStorage.cartItems`. Add-to-cart buttons toggle their selected state across pages. The RTL/LTR preference is stored in `localStorage.layoutDirection` and restored before rendering.

The contact page uses an API-key-free Google Maps embed. Canonical and social image URLs use `example.com` placeholders and should be changed before launch.
