# SEO & AI Citation Improvement Plan

Goal: Get juanidrovo.com cited as a source by AI systems (ChatGPT, Perplexity, Google AI Overviews) and increase organic traffic through search.

## Current State (Feb 2026)

### What's Working
- 10 blog posts (~29,000 words) with strong depth and legal citations
- FAQPage structured data (JSON-LD) on homepage with 6 questions
- `llms.txt` and `llms-full.txt` for direct AI agent discovery
- Person + SoftwareApplication structured data on homepage
- Niche authority content (RAG + GDPR, AI copyright, Ecuador compliance)

### What's Broken
- Zero internal links between blog posts
- Zero links from blog posts back to juanidrovo.com
- No foundational "pillar" posts targeting high-volume queries
- No Article structured data on blog posts (no author attribution)
- FAQ answers contain first-person sales language in structured data (hurts citability)
- FAQ doesn't link to related blog posts
- Blog post endings are inconsistent (some lack CTAs)

---

## Phase 1: Fix FAQ Section ✅ DONE

### 1.1 Rewrite FAQ Answers for Citability
- Remove first-person sales language from structured data answers ("I've guided...", "I built...")
- Keep visible answers conversational but make JSON-LD answers factual and encyclopedic
- AI systems skip sales copy; they cite reference-quality answers

### 1.2 Add "Read More" Links from FAQ to Blog Posts
| FAQ Question | Links To |
|---|---|
| Do I need SOC 2 or ISO 27001? | New pillar post: "SOC 2 vs ISO 27001" (Phase 2) |
| How long does SOC 2 certification take? | New pillar post: "How to Prepare for SOC 2" (Phase 2) |
| Why hire a lawyer who also builds software? | Blog: What Developers Get Wrong About Legal |
| How does AI help with trademark monitoring? | Blog: Why Trademark Monitoring Is a Natural Fit for RAG |
| Can a LATAM consultant handle international certs? | Blog: Ecuador Compliance Audit Guide |
| Why are LATAM companies pursuing SOC 2/ISO 27001? | Blog: Ecuador Compliance Audit Guide |

### 1.3 Sync Updates to llms-full.txt
- Update FAQ section in llms-full.txt to match rewritten answers
- Add blog post URLs as references alongside FAQ answers

---

## Phase 2: Internal Linking ✅ DONE

### 2.1 Add Cross-Links to Every Blog Post
Each post should link to 2-3 related posts. Natural linking map:

- **AI Copyright Lawsuits** <-> NYT v. OpenAI <-> Direct Effect AI Act
- **ISO 27001 vs GDPR** <-> Ecuador Compliance Guide <-> RAG + Right to Be Forgotten
- **RAG + Right to Be Forgotten** <-> Trademark Monitoring + RAG
- **What Developers Get Wrong** <-> Agentic Architect
- **Ecuador Compliance Guide** <-> ISO 27001 vs GDPR

### 2.2 Link Blog Posts Back to Homepage
Every blog post should include at least one contextual link to juanidrovo.com services or the relevant project (Markatzy, etc.)

### 2.3 Add Consistent CTAs to Post Endings
Every post ends with:
- Link to 1-2 related posts ("Read next: ...")
- Link to services or booking page when contextually relevant

---

## Phase 3: Pillar Content (High-Volume Posts)

Write 3-5 foundational posts targeting the queries that appear in Google AI Overviews and PAA boxes:

| Target Query | Estimated Intent | Post Title |
|---|---|---|
| "SOC 2 vs ISO 27001" | Comparison shopping | SOC 2 vs ISO 27001: Which Certification Do You Actually Need? |
| "what is SOC 2 compliance" | Educational | SOC 2 Compliance Explained: What It Is, Who Needs It, and How to Get Certified |
| "how to prepare for SOC 2 audit" | Action-oriented | How to Prepare for a SOC 2 Audit: A Practical Checklist |
| "SOC 2 for startups" | Startup-specific | SOC 2 for Startups: When You Need It and How to Get There |
| "compliance for SaaS companies" | Broad entry point | The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters |

These posts should:
- Be 3,000-5,000 words with real depth
- Include specific timelines, costs, and processes (not generic advice)
- Cite official sources (AICPA, ISO, regulations)
- Link to niche posts for deeper dives
- Include FAQ schema for sub-questions within each post

---

## Phase 4: Technical SEO for Blog

### 4.1 Add Article Structured Data
Add JSON-LD to blog post template:
```json
{
  "@type": "Article",
  "author": { "@id": "https://juanidrovo.com/#person" },
  "datePublished": "...",
  "dateModified": "..."
}
```

### 4.2 Add "Last Updated" Dates
AI systems prefer fresh content. Display and include `dateModified` in structured data.

### 4.3 Sitemap and RSS
Verify blog sitemap and RSS feed are discoverable and include all posts.

---

## Phase 5: AI-Specific Optimization

### 5.1 Update llms-full.txt After Each Phase
Keep llms-full.txt in sync with new FAQ answers, new blog posts, and updated internal structure.

### 5.2 Monitor AI Citations
Periodically search for your topics on:
- Perplexity (shows sources inline)
- ChatGPT with browsing (shows citations)
- Google AI Overviews (shows source panel)

Track which queries cite competitors and which cite you.

### 5.3 Structured Data for Blog Posts
Add FAQPage schema to pillar posts that answer multiple sub-questions (e.g., a "SOC 2 for Startups" post can have its own FAQ schema for questions answered within the post).

---

## Execution Order

1. **Phase 1** — Fix FAQ section (quick wins, improves homepage immediately)
2. **Phase 2** — Internal linking (connects existing content, biggest structural fix)
3. **Phase 3** — Pillar content (brings traffic; requires writing time)
4. **Phase 4** — Technical blog SEO (schema, dates, sitemap)
5. **Phase 5** — Ongoing AI monitoring and llms.txt maintenance
