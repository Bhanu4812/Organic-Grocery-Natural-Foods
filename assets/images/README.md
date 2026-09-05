# Image organization

The generated homepage hero is stored locally as `hero-organic.png`. The generated Golden Lentils product image is stored in `products/`, and the curated demo photography is vendored in `library/` so the site does not depend on remote image requests at runtime.

When preparing the template for production, download licensed replacements into these suggested folders and update the matching `src` values:

- `products/`
- `categories/`
- `farms/`
- `team/`
- `testimonials/`
- `blog/`
- `heroes/`

Keep the existing width, height, loading and alt attributes. Component crops are controlled centrally in `assets/css/style.css`.
