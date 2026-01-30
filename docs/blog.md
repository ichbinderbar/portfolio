# Blog Documentation

## Adding New Posts

Create a markdown file in `src/blog/posts/`. The filename becomes the URL slug.

**Example:** `my-new-post.md` → `juanidrovo.com/blog/posts/my-new-post/`

## Required Frontmatter

```yaml
---
title: Your Post Title
description: Brief description for SEO and post previews (1-2 sentences)
date: 2026-01-30
tags:
  - posts
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title (appears as h1 and in browser tab) |
| `description` | Yes | SEO meta description and preview text on blog listing |
| `date` | Yes | Publication date (YYYY-MM-DD). Controls sort order (newest first) |
| `tags` | Yes | Must include `posts`. Add others for categorization |

## Optional Frontmatter

```yaml
---
ogImage: https://juanidrovo.com/assets/custom-image.jpg
---
```

| Field | Description |
|-------|-------------|
| `ogImage` | Custom Open Graph image for social sharing (defaults to profile.jpg) |

## Markdown Content

After the frontmatter `---`, write your content in standard markdown:

```markdown
Introduction paragraph...

## Section Heading

Regular paragraph with **bold**, *italic*, and [links](https://example.com).

### Subsection

- Bullet points
- Work fine

1. Numbered lists
2. Also work

> Blockquotes for callouts

`inline code` and code blocks:

\```javascript
const code = "highlighted";
\```
```

## Tags

Tags appear as labels on posts. Always include `posts` (required for the collection). Add descriptive tags:

```yaml
tags:
  - posts
  - compliance
  - security
  - legal-tech
```

## Example Complete Post

```markdown
---
title: SOC 2 Compliance for Startups
description: A practical guide to achieving SOC 2 certification without breaking the bank or slowing down your team.
date: 2026-02-15
tags:
  - posts
  - compliance
  - security
  - startups
---

Getting SOC 2 certified doesn't have to be painful...

## Why SOC 2 Matters

Your enterprise customers will ask for it...

## The Practical Approach

Here's what actually works...
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build everything (portfolio + blog) |
| `npm run preview` | Build and serve locally (test before deploy) |
| `npm run build:blog` | Build blog only |

## SEO: Updating Sitemap

When adding new posts, manually update `src/sitemap.xml` to include the new URL:

```xml
<url>
  <loc>https://juanidrovo.com/blog/posts/your-new-post/</loc>
  <lastmod>2026-02-15</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>
```

## File Structure

```
src/blog/
├── index.njk              # Blog listing page
├── blog.css               # Blog styles
└── posts/
    ├── posts.json         # Default layout config
    ├── welcome.md         # Example post
    └── your-new-post.md   # Add posts here
```
