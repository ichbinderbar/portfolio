---
name: seo-agent-review
description: Review websites for SEO and AI agent discovery optimization. Covers meta tags, structured data (JSON-LD), llms.txt implementation, robots.txt for AI crawlers, Core Web Vitals, and search engine best practices. Use when auditing a site's search visibility, AI discoverability, or preparing for production deployment. Triggers on phrases like "review SEO", "check SEO", "audit for search", "AI agent optimization", "llms.txt review", "structured data check", or "search optimization".
---

# SEO & AI Agent Discovery Review

Comprehensive audit for search engine optimization and AI agent discoverability. Ensures websites are optimized for both traditional search engines and emerging AI systems.

## Review Process

Execute all sections in order. Provide actionable feedback with specific file locations and code examples.

---

## 1. Meta Tags Audit (CRITICAL)

### Required Meta Tags

Every page must have:

```html
<!-- Primary Meta Tags -->
<title>Page Title | Brand Name</title>
<meta name="title" content="Page Title | Brand Name" />
<meta name="description" content="150-160 character description with keywords" />
<meta name="author" content="Author Name" />
<meta name="robots" content="index, follow" />

<!-- Canonical URL (prevents duplicate content) -->
<link rel="canonical" href="https://example.com/page/" />

<!-- Viewport (required for mobile) -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Open Graph Tags (Social Sharing)

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/page/" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Description for social sharing" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:site_name" content="Site Name" />
<meta property="og:locale" content="en_US" />
```

**Image requirements:**
- Minimum: 1200x630px (Facebook/LinkedIn)
- Twitter: 1200x600px or 800x418px
- Format: JPG or PNG, under 5MB

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Description" />
<meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
```

### Validation Checklist

- [ ] Title under 60 characters (truncated in SERPs after 60)
- [ ] Description between 150-160 characters
- [ ] Canonical URL is absolute (not relative)
- [ ] OG image URL is absolute
- [ ] No duplicate meta tags
- [ ] Language specified (`<html lang="en">`)

---

## 2. Structured Data (JSON-LD)

### Why JSON-LD Matters

- Enables rich snippets in search results
- Helps AI agents understand page content semantically
- Creates knowledge graph connections

### Person Schema (Portfolio Sites)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://example.com/#person",
  "name": "Full Name",
  "givenName": "First",
  "familyName": "Last",
  "url": "https://example.com/",
  "image": "https://example.com/photo.jpg",
  "email": "email@example.com",
  "jobTitle": "Job Title",
  "description": "Professional description",
  "knowsAbout": ["Skill 1", "Skill 2"],
  "sameAs": [
    "https://linkedin.com/in/username",
    "https://github.com/username"
  ]
}
```

### BlogPosting Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post description",
  "datePublished": "2026-01-30",
  "dateModified": "2026-01-30",
  "url": "https://example.com/blog/post-slug/",
  "author": {
    "@type": "Person",
    "@id": "https://example.com/#person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Person",
    "@id": "https://example.com/#person"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/post-slug/"
  },
  "image": "https://example.com/post-image.jpg"
}
```

### Organization/Business Schema

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Business Name",
  "url": "https://example.com/",
  "logo": "https://example.com/logo.png",
  "description": "Service description",
  "areaServed": "Worldwide",
  "serviceType": ["Service 1", "Service 2"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@example.com"
  }
}
```

### FAQPage Schema (SEO Boost)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text."
      }
    }
  ]
}
```

### Schema.org Best Practices

| Practice | Why |
|----------|-----|
| Use `@id` references | Creates linked entities, not duplicates |
| Absolute URLs only | Ensures proper resolution |
| ISO 8601 dates | `YYYY-MM-DD` format required |
| Match visible content | Schema must reflect what users see |

### Validation Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 3. AI Agent Discovery (llms.txt)

### What is llms.txt?

A standardized file (like robots.txt) that provides context to AI systems about your website, services, and how to interact with your content.

**Specification:** https://llmstxt.org/

### llms.txt Structure

```markdown
# Site Name

> Brief tagline or value proposition

## About

2-3 paragraph description of the site/person/business.

## Services/Offerings

- Service 1: Description
- Service 2: Description

## Contact

- Email: email@example.com
- Booking: https://calendly.com/username

## Links

- [Link Name](https://example.com/page)
```

### llms-full.txt (Extended Version)

Provide more detailed context:

```markdown
# Site Name

> Tagline

## Detailed Background

Extended biography, credentials, experience...

## Service Details

### Service 1
Full description, process, pricing info...

### Service 2
...

## Case Studies / Projects

### Project Name
Problem, solution, results...

## FAQ

### Common Question?
Detailed answer...
```

### Implementation Checklist

1. **Create files:**
   - `llms.txt` - Summary version (~500-1000 words)
   - `llms-full.txt` - Detailed version (~2000-5000 words)

2. **Place at root:**
   - `https://example.com/llms.txt`
   - `https://example.com/llms-full.txt`

3. **Add link tags in `<head>`:**
```html
<link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context" />
<link rel="alternate" type="text/markdown" href="/llms-full.txt" title="LLM Full Context" />
```

4. **Reference in robots.txt:**
```
# LLMs.txt for AI context
# Summary: https://example.com/llms.txt
# Full details: https://example.com/llms-full.txt
```

---

## 4. robots.txt for AI Crawlers

### AI Bot User Agents (2026)

```
# Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI/LLM Crawlers - ALLOW for discoverability
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Diffbot
Allow: /

# Reference llms.txt
# LLMs.txt for AI context
# Summary: https://example.com/llms.txt
# Full details: https://example.com/llms-full.txt

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### Blocking vs Allowing AI Crawlers

**Allow if:**
- You want AI systems to reference your content
- You're building personal brand/authority
- You offer public services

**Block if:**
- Content is proprietary/paywalled
- Training data concerns
- Competitive information

```
# To block AI training
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /
```

---

## 5. security.txt (Trust Signal)

### Location

`/.well-known/security.txt`

### Format

```
Contact: mailto:security@example.com
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: en, es
Canonical: https://example.com/.well-known/security.txt
```

### Why Include It?

- Shows security awareness (trust signal)
- Some AI systems check for it
- Good practice for professional sites

---

## 6. Technical SEO Checklist

### Core Web Vitals

| Metric | Target | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| INP (Interaction to Next Paint) | < 200ms | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |

### Image Optimization

```html
<!-- Proper image attributes -->
<img
  src="image.jpg"
  alt="Descriptive alt text for SEO and accessibility"
  width="800"
  height="450"
  loading="lazy"
/>
```

- [ ] All images have descriptive `alt` text
- [ ] Width/height attributes set (prevents CLS)
- [ ] Lazy loading for below-fold images
- [ ] WebP format with fallbacks
- [ ] Compressed (use squoosh.app or similar)

### Performance

- [ ] CSS/JS minified
- [ ] Fonts preloaded or self-hosted
- [ ] Preconnect to external domains
- [ ] No render-blocking resources
- [ ] Gzip/Brotli compression enabled

```html
<!-- Preconnect example -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### Mobile Optimization

- [ ] Viewport meta tag present
- [ ] Touch targets at least 48x48px
- [ ] No horizontal scrolling
- [ ] Text readable without zooming
- [ ] Mobile-friendly test passes

---

## 7. Accessibility (SEO Impact)

### WCAG Quick Wins

```html
<!-- Skip link for keyboard users -->
<a href="#main" class="sr-only sr-only-focusable">Skip to content</a>

<!-- Semantic structure -->
<main id="main" role="main">
  <article>
    <h1>Page Title</h1>
    ...
  </article>
</main>

<!-- ARIA labels for icons -->
<a href="https://linkedin.com" aria-label="LinkedIn profile">
  <i class="fa fa-linkedin"></i>
</a>
```

### Checklist

- [ ] Heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] ARIA labels on icon-only buttons

---

## 8. Page-Type Specific Checks

### Homepage

| Element | Check |
|---------|-------|
| H1 | Contains primary keyword, describes site |
| Meta title | Brand + primary service/offering |
| Schema | Person, Organization, or WebSite |
| OG Image | Custom, represents brand |
| llms.txt link | Present in `<head>` |

### Blog Post

| Element | Check |
|---------|-------|
| H1 | Post title, unique |
| Meta description | Summarizes post, includes keywords |
| Schema | BlogPosting with author, dates |
| Canonical | Points to self |
| Internal links | Links to related posts |

### Service/Product Page

| Element | Check |
|---------|-------|
| H1 | Service name + benefit |
| Schema | Service, Product, or Offer |
| FAQ section | With FAQPage schema |
| CTA | Clear call-to-action |

---

## 9. Review Output Format

### Structure findings as:

**Critical Issues** (Blocking rich results or indexing)
```
Location: src/index.html
Issue: Missing canonical URL - may cause duplicate content issues
Current: [none]
Add: <link rel="canonical" href="https://example.com/" />
```

**Schema Issues** (Preventing rich snippets)
```
Location: BlogPosting schema
Issue: datePublished in wrong format
Current: "January 30, 2026"
Fix: "2026-01-30" (ISO 8601)
Validation: Fails Google Rich Results Test
```

**AI Discoverability Issues**
```
Issue: No llms.txt file
Impact: AI agents have no structured context about the site
Add: Create /llms.txt and /llms-full.txt files
Reference: https://llmstxt.org/
```

**Performance Issues**
```
Location: Homepage
Issue: LCP at 4.2s (target < 2.5s)
Cause: Hero image not optimized
Fix: Compress image, add width/height, consider WebP
```

**Accessibility Issues**
```
Location: Footer social links
Issue: Icon-only links missing accessible names
Current: <a href="..."><i class="fa fa-linkedin"></i></a>
Fix: Add aria-label="LinkedIn"
```

**Good Patterns Observed**
- Comprehensive Person schema with credentials
- Proper OG tags for social sharing
- Mobile-responsive design
- Fast TTFB

---

## 10. Quick Reference

### Essential Files

| File | Location | Purpose |
|------|----------|---------|
| robots.txt | /robots.txt | Crawler instructions |
| sitemap.xml | /sitemap.xml | Page index for crawlers |
| llms.txt | /llms.txt | AI agent context |
| security.txt | /.well-known/security.txt | Security contact |

### Meta Tag Length Limits

| Tag | Limit | Truncated |
|-----|-------|-----------|
| Title | 60 chars | Google SERPs |
| Description | 160 chars | Google SERPs |
| OG Title | 60 chars | Social platforms |
| OG Description | 200 chars | Social platforms |

### Schema Types by Page

| Page Type | Primary Schema |
|-----------|---------------|
| Homepage (personal) | Person |
| Homepage (business) | Organization |
| Blog listing | WebPage or Blog |
| Blog post | BlogPosting |
| Service page | Service or ProfessionalService |
| Product page | Product |
| FAQ page | FAQPage |
| Contact page | ContactPage |

### Testing Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Schema Validator**: https://validator.schema.org/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **WAVE Accessibility**: https://wave.webaim.org/

---

## 11. AI Agent Optimization Trends (2026)

### Emerging Best Practices

1. **Structured summaries** - AI prefers scannable, hierarchical content
2. **Entity clarity** - Use schema `@id` to define entities unambiguously
3. **Fact density** - Include specific numbers, dates, credentials
4. **Question-answer format** - FAQs help AI extract knowledge
5. **Citation-worthy content** - Original research, unique data, expert insights

### What AI Systems Look For

| Signal | Implementation |
|--------|----------------|
| Authority | Credentials in schema, author bylines |
| Freshness | dateModified in schema, recent content |
| Specificity | Concrete facts over vague claims |
| Structure | Headings, lists, tables |
| Context | llms.txt, comprehensive About pages |

---

## Sources

- Google Search Central documentation
- Schema.org specifications
- llmstxt.org specification
- Web.dev Core Web Vitals guides
- WCAG 2.1 accessibility guidelines
