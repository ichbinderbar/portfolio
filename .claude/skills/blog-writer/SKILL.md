---
name: blog-writer
description: Write and review blog posts for juanidrovo.com. Handles both creating new posts (with research, formatting, and SEO optimization) and reviewing existing posts for format adherence. Use when writing new blog content, reviewing post format, checking consistency across posts, or preparing pillar content. Triggers on phrases like "write a blog post", "new blog post", "review blog format", "check post format", "blog review", "pillar post", or "write about".
---

# Blog Writer & Reviewer

Write new blog posts and review existing ones for juanidrovo.com. Ensures format consistency, voice adherence, and SEO optimization across all content.

**Blog location:** `src/blog/posts/`
**Documentation:** `docs/blog.md`
**SEO plan:** `docs/seo-ai-citation-plan.md`

## Modes

This skill operates in two modes:
1. **Write mode** — Create a new blog post from scratch
2. **Review mode** — Audit existing posts for format and consistency

---

## 1. Frontmatter Format (STRICT)

Every post must use this exact frontmatter structure:

```yaml
---
title: "Title in Quotes"
description: "Description in quotes. 1-2 sentences for SEO and previews."
date: YYYY-MM-DD
lastModified: YYYY-MM-DD
tags:
  - posts
  - tag-1
  - tag-2
---
```

### Rules

- `title` and `description` values MUST be quoted
- `date` uses ISO format (YYYY-MM-DD)
- `lastModified` MUST be included — set equal to `date` for new posts. Update when post content changes.
- `tags` MUST include `posts` as the first tag
- Add 2-4 descriptive tags (lowercase, hyphenated)
- `description` should be 150-160 characters for optimal SEO

### Common Tags

`compliance`, `security`, `soc-2`, `iso-27001`, `legal-tech`, `ai`, `copyright`, `gdpr`, `engineering`, `rag`, `ecuador`, `data-protection`, `product-management`, `ai-regulation`, `eu-law`, `trademark`, `startups`, `saas`

---

## 2. Post Structure

### Opening (no heading)

Start with 1-2 paragraphs that hook the reader. No heading before the opening. Jump straight into the topic with a concrete scenario, question, or observation.

```markdown
Every growing SaaS company hits the same inflection point...
```

Do NOT start with generic introductions like "In this post, we'll explore..." or "Today I want to talk about..."

### Body

Use `##` for main sections and `###` for subsections. Keep heading hierarchy clean (never skip levels).

### Heading Style

| Post Type | Heading Tone |
|-----------|-------------|
| Regular post | Conversational, opinionated ("The real problem is structural") |
| Pillar post | Descriptive, SEO-friendly ("Side-by-Side: The Structural Differences") |

---

## 3. Post Ending Format (STRICT)

Every post MUST end with these three elements in this exact order:

```markdown
---

**Keep reading:**
- [Related Post Title](/blog/slug/)
- [Another Related Post](/blog/slug/)

*[Contextual question]? [Let's talk](https://calendly.com/juanidrovo).*
```

### Rules

- Horizontal rule (`---`) separates content from ending
- **Keep reading:** header in bold, followed by 2-3 links
- Links use relative paths (`/blog/slug/`, not full URLs)
- CTA is italicized, asks a question relevant to the post topic, links to Calendly with "Let's talk"
- Exception: product-specific posts (e.g., Markatzy) can link to the product instead

---

## 3.1. FAQPage Structured Data (Pillar Posts Only)

Pillar posts with FAQ sections MUST include a FAQPage JSON-LD `<script>` block embedded directly in the markdown. This enables rich FAQ snippets in Google search results.

### FAQ Content Format

Write each FAQ question in bold, followed by the answer as a paragraph:

```markdown
## Frequently Asked Questions

**Can I skip SOC 2 Type I and go straight to Type II?**
Technically yes. But most companies use Type I as a stepping stone...

**Is SOC 2 a certification?**
No. SOC 2 is an attestation...
```

### JSON-LD Block

Immediately after the last FAQ answer (and BEFORE the `---` separator), add the FAQPage schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I skip SOC 2 Type I and go straight to Type II?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Technically yes. But most companies use Type I as a stepping stone..."
      }
    },
    {
      "@type": "Question",
      "name": "Is SOC 2 a certification?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SOC 2 is an attestation..."
      }
    }
  ]
}
</script>
```

### Rules

- JSON-LD `text` values should be factual and concise (no first-person, no links)
- JSON-LD `name` values must match the bold question text exactly
- Every bold FAQ question in the content must have a matching entry in the JSON-LD
- Place the `<script>` block after the last FAQ answer, before the `---` separator
- Regular posts do NOT need FAQPage schema (only pillar posts)

### Full Pillar Post Ending Order

```
## Frequently Asked Questions

**Question 1?**
Answer text...

**Question 2?**
Answer text...

<script type="application/ld+json">{ FAQPage schema }</script>

---

**Keep reading:**
- [Link 1](/blog/slug/)
- [Link 2](/blog/slug/)

*CTA question? [Let's talk](https://calendly.com/juanidrovo).*
```

---

## 3.2. Nunjucks Template Escaping (STRICT)

Eleventy uses Nunjucks to render markdown files. Any `{{ }}` or `{% %}` syntax inside code blocks will be parsed as Nunjucks template expressions and **will break the build**.

### When to Wrap

Wrap a code block with `{% raw %}` / `{% endraw %}` if it contains ANY of:
- `${{ }}` (GitHub Actions syntax: `${{ secrets.TOKEN }}`, `${{ matrix.language }}`, `${{ github.sha }}`)
- `{{ }}` (React JSX: `dangerouslySetInnerHTML={{ __html: body }}`, template injection payloads)
- `{% %}` (Jinja2, Django, or Nunjucks template tags)

### Format

Place `{% raw %}` on the line BEFORE the opening triple backticks and `{% endraw %}` on the line AFTER the closing triple backticks:

```
{% raw %}
\`\`\`yaml
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
\`\`\`
{% endraw %}
```

### Rules

- Every code block with `{{ }}` or `{% %}` MUST be wrapped - no exceptions
- The `{% raw %}` tag goes outside the code fence, not inside it
- When reviewing posts, check for unwrapped `{{ }}` patterns - these cause Eleventy build failures

---

## 4. Voice & Tone

### Regular Posts

- First-person perspective ("I've seen...", "I ran into this firsthand...")
- Personal anecdotes from real projects
- Conversational but authoritative
- Bridges lawyer + engineer audiences
- Storytelling with real experience examples
- Practical over theoretical (always includes "what to do about it")

### Pillar Posts

- Third-person/instructional ("your company", "you're looking at")
- Reference-quality, educational tone
- Data-driven: specific costs, timelines, comparison tables
- Include FAQ sections with sub-questions (see Section 3.1 for format)
- Include FAQPage JSON-LD structured data (see Section 3.1)
- Target queries that appear in Google AI Overviews and PAA boxes

### Both Types

- Expert, not condescending
- Data-driven when relevant (statistics, citations, specific numbers)
- No fluff or filler paragraphs
- No generic advice - always specific and actionable
- NEVER use em dashes (—) or en dashes (–). Use hyphens (-) for parenthetical statements and ranges. Em/en dashes are a strong AI writing signal and must be avoided entirely.

---

## 5. Writing a New Post (Write Mode)

### Step 1: Research

Before writing, gather:
- Current data and statistics from authoritative sources
- Official source citations (regulations, standards bodies)
- Cost ranges and timelines (with source URLs)
- Competitive landscape (what existing content covers this topic)

### Step 2: Write

- Target word count: 3,000–5,000 words for pillar posts, 2,000–4,000 for regular posts
- Include at least one table or structured comparison
- Cite specific numbers, not vague ranges
- Link to 2-3 existing blog posts where contextually relevant (inline, not just in "Keep reading")

### Step 3: Internal Linking

Every new post should:
- Link to 2-3 existing posts inline where contextually relevant
- Be linked FROM relevant existing posts (update their "Keep reading" sections if appropriate)
- Be linked from relevant FAQ answers on the homepage if applicable

### Step 4: Sitemap

Add the new post to `src/sitemap.xml`. Use `/blog/slug/` (NOT `/blog/posts/slug/`):

```xml
<!-- Regular post -->
<url>
  <loc>https://juanidrovo.com/blog/your-new-post/</loc>
  <lastmod>2026-02-15</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>

<!-- Pillar post (higher priority) -->
<url>
  <loc>https://juanidrovo.com/blog/your-pillar-post/</loc>
  <lastmod>2026-02-15</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

### Step 5: Verify

- Run `npm run build` and confirm no errors
- Verify word count meets target
- Check all internal links resolve

---

## 6. Reviewing Posts (Review Mode)

Audit all posts in `src/blog/posts/` against these checks:

### Frontmatter Checks

- [ ] Title is quoted
- [ ] Description is quoted
- [ ] Description is 150-160 characters
- [ ] Date is ISO format
- [ ] `lastModified` is present (YYYY-MM-DD)
- [ ] Tags include `posts`
- [ ] Tags are lowercase and hyphenated

### Ending Format Checks

- [ ] Horizontal rule before ending
- [ ] "Keep reading:" header in bold
- [ ] 2-3 related post links
- [ ] CTA in italics with Calendly link
- [ ] CTA asks a contextual question

### Content Checks

- [ ] No heading before opening paragraphs
- [ ] Heading hierarchy is clean (##, ###, no skips)
- [ ] At least one inline link to another blog post
- [ ] No broken internal links
- [ ] Em dashes and en dashes used correctly
- [ ] All code blocks with `{{ }}` or `{% %}` wrapped in `{% raw %}` / `{% endraw %}`

### Structured Data Checks (Pillar Posts Only)

- [ ] FAQ section uses bold questions + paragraph answers
- [ ] FAQPage JSON-LD `<script>` block is present after FAQ content
- [ ] Every bold FAQ question has a matching JSON-LD entry
- [ ] JSON-LD `name` values match bold question text exactly
- [ ] JSON-LD `text` values are factual and concise (no first-person, no links)
- [ ] JSON-LD block is placed before the `---` separator

### Consistency Checks

- [ ] Voice matches post type (regular = first-person, pillar = instructional)
- [ ] No "In this post..." or "Today we'll..." openings
- [ ] CTA wording follows the pattern: *[Question]? [Let's talk](calendly).*

---

## 7. Post Type Reference

### Regular Posts (priority 0.7)

Narrative voice. First-person. Personal anecdotes. Niche topics.

**Examples:** AI copyright lawsuits, ISO 27001 vs GDPR gaps, RAG pipeline engineering, trademark monitoring

### Pillar Posts (priority 0.8)

Educational. Reference-quality. Tables, costs, timelines, FAQ sections. Target high-volume search queries.

**Examples:** SOC 2 vs ISO 27001, What is SOC 2, How to prepare for SOC 2 audit, SOC 2 for startups, SaaS compliance stack

**Pillar posts defined in:** `docs/seo-ai-citation-plan.md` (Phase 3)

---

## 8. Internal Linking Map

When writing or reviewing, use this map to find related posts:

| Topic Cluster | Posts |
|--------------|-------|
| SOC 2 / ISO 27001 / Compliance | `soc-2-vs-iso-27001`, `what-is-soc-2-compliance`, `soc-2-for-startups`, `how-to-prepare-soc-2-audit`, `saas-compliance-stack`, `iso-27001-not-gdpr-compliant`, `ecuador-compliance-audit-guide` |
| AI Copyright / IP | `ai-copyright-lawsuits-that-matter`, `nyt-v-openai-ai-product-rules` |
| AI Regulation | `direct-effect-ai-act`, `ai-copyright-lawsuits-that-matter` |
| RAG / AI Engineering | `rag-pipelines-right-to-be-forgotten`, `why-trademark-monitoring-natural-fit-rag`, `the-agentic-architect-openclaw` |
| Legal + Engineering | `what-developers-lawyers-get-wrong`, `rag-pipelines-right-to-be-forgotten` |
| GDPR / Privacy | `iso-27001-not-gdpr-compliant`, `rag-pipelines-right-to-be-forgotten`, `direct-effect-ai-act` |
| SaaS / Startups | `soc-2-for-startups`, `saas-compliance-stack`, `what-is-soc-2-compliance` |

---

## 9. Review Output Format

When reviewing, structure findings as:

**Format Issues**
```
File: src/blog/posts/slug.md
Issue: Description not quoted in frontmatter
Current: description: Some text here
Fix: description: "Some text here"
```

**Ending Issues**
```
File: src/blog/posts/slug.md
Issue: CTA links to homepage instead of Calendly
Current: [See how I can help](https://juanidrovo.com)
Fix: [Let's talk](https://calendly.com/juanidrovo)
```

**Consistency Issues**
```
File: src/blog/posts/slug.md
Issue: Only 1 "Keep reading" link (standard is 2-3)
Fix: Add link to [Related Post](/blog/slug/)
```

**Pass** (no issues found)
```
File: src/blog/posts/slug.md
Status: All checks pass
```
