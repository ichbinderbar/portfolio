# Blog Documentation

## Adding New Posts

Create a markdown file in `src/blog/posts/`. The filename becomes the URL slug.

**Example:** `my-new-post.md` → `juanidrovo.com/blog/posts/my-new-post/`

## Required Frontmatter

Always quote `title` and `description` values in YAML:

```yaml
---
title: "Your Post Title"
description: "Brief description for SEO and post previews (1-2 sentences)"
date: 2026-01-30
tags:
  - posts
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title (appears as h1 and in browser tab). Always quote. |
| `description` | Yes | SEO meta description and preview text on blog listing. Always quote. |
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

## Post Ending Format

Every post must end with three elements in this order:

1. **Horizontal rule** (`---`)
2. **"Keep reading:" section** with 2-3 links to related posts
3. **CTA line** in italics linking to Calendly

```markdown
---

**Keep reading:**
- [Related Post Title](/blog/slug/)
- [Another Related Post](/blog/slug/)

*[Contextual question]? [Let's talk](https://calendly.com/juanidrovo).*
```

**Rules:**
- Include 2-3 "Keep reading" links. Pick the most contextually relevant posts.
- CTA should ask a question related to the post topic, then link to Calendly with "Let's talk".
- Exception: if the post is about a specific product (e.g., Markatzy), the CTA can link to that product instead.

## Tags

Tags appear as labels on posts. Always include `posts` (required for the collection). Add descriptive tags:

```yaml
tags:
  - posts
  - compliance
  - security
  - legal-tech
```

## Post Types

### Regular posts (priority 0.7)
Standard blog posts. Narrative voice, first-person perspective, personal anecdotes from real projects. Topics cover niche areas (specific regulations, specific technologies, case analysis).

### Pillar posts (priority 0.8)
Foundational, high-volume-query posts. Reference-quality, educational tone. Include specific costs, timelines, comparison tables, and FAQ sections. Target queries that appear in Google AI Overviews and PAA boxes. Pillar posts are defined in `docs/seo-ai-citation-plan.md`.

## Example Complete Post

```markdown
---
title: "SOC 2 Compliance for Startups"
description: "A practical guide to achieving SOC 2 without breaking the bank or slowing down your team."
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

---

**Keep reading:**
- [SOC 2 vs ISO 27001: Which Certification Do You Actually Need?](/blog/soc-2-vs-iso-27001/)
- [How to Prepare for a Compliance Audit in Ecuador](/blog/ecuador-compliance-audit-guide/)

*Navigating SOC 2 for the first time? [Let's talk](https://calendly.com/juanidrovo).*
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
<!-- Regular post -->
<url>
  <loc>https://juanidrovo.com/blog/posts/your-new-post/</loc>
  <lastmod>2026-02-15</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>

<!-- Pillar post (higher priority) -->
<url>
  <loc>https://juanidrovo.com/blog/posts/your-pillar-post/</loc>
  <lastmod>2026-02-15</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
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
