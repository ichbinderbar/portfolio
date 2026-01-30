# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm start        # Start dev server at http://localhost:1234 (main site only)
npm run preview  # Build and serve full site with blog
npm run build    # Build for production (outputs to /dist)
```

## Architecture

Single-page portfolio built with Parcel bundler, Bootstrap 4, and SCSS.

### Key Files

- `src/index.html` - All content lives here (5 sections: Hero, About, Projects, Contact, Footer)
- `src/sass/abstracts/_variables.scss` - Theme colors (`$primary-color`, `$secondary-color`) and font sizes
- `src/assets/` - Images (profile.jpg, project.jpg, favicon.png) and resume.pdf

### Styling Structure

```
src/sass/
├── abstracts/     # Variables, mixins, helpers
├── base/          # Base styles, typography
├── components/    # Buttons
├── layout/        # Footer, sections
├── sections/      # Hero, about, projects, contact
└── vendors/       # Bootstrap overrides
```

### JavaScript

- `src/scripts/scrollReveal.js` - Scroll animations using ScrollReveal.js
- `src/scripts/tiltAnimation.js` - Hover tilt effect using vanilla-tilt
- `src/data/scrollRevealConfig.js` - Animation configuration

## Customization

**Colors:** Edit `$primary-color` and `$secondary-color` in `src/sass/abstracts/_variables.scss`

**Content:** Edit section content directly in `src/index.html`

**Projects:** Each project is a `.row` inside `#projects` section. Copy/paste a row block to add more projects.

**Social links:** Footer contains Font Awesome icons. Find icons at https://fontawesome.com/v4.7.0/icons/

## Blog

Static blog at `/blog/` built with Eleventy (11ty). Posts are markdown files in `src/blog/posts/`.

**Add a post:** Create `src/blog/posts/your-slug.md` with required frontmatter (title, description, date, tags).

See `docs/blog.md` for full documentation.

## Documentation

Extended documentation lives in `/docs/`:
- `blog.md` - Blog post format and usage
