---
title: What Developers Get Wrong About Legal (And Vice Versa)
description: The gap between engineering and legal teams isn't about intelligence—it's about modeling. Here's how both sides can bridge it.
date: 2026-02-01
tags:
  - posts
  - legal-tech
  - compliance
  - engineering
---

The miscommunication I see between these two groups isn't about one side being difficult. It's about two different ways of modeling the world colliding in the same meeting room.

Here's what I've learned about where each side goes wrong, and how to fix it.

## What developers get wrong about legal

### "Just tell me the rule and I'll implement it."

This is the single most common thing I hear from engineers, and it sounds so reasonable. You give me a spec, I build to the spec. That's how software works.

Law doesn't work that way.

Regulations aren't boolean. They're not if/else statements. Take something like data residency requirements in LATAM. Brazil's LGPD has specific provisions about cross-border data transfers. Ecuador's framework is still maturing, with secondary regulations that shift interpretation. Colombia's SIC has enforcement patterns that don't always match the statutory text.

A developer hears "data residency" and thinks: *Okay, store it in a local region. Done.* But the actual requirement might depend on the type of data, the legal basis for processing, whether the receiving country has "adequate" protections, and what contractual safeguards exist between the parties. That's not a checklist. That's a decision tree with branches that depend on business context, regulatory interpretation, and sometimes a judgment call that no one can make with certainty.

I ran into this firsthand building a multi-tenant platform that handled user data across three countries. The engineering team wanted a single, clean data-routing rule. What we actually needed was a configurable policy engine, because the "rule" was different depending on the tenant's jurisdiction, the data type, and which regulator might come knocking.

The instinct to simplify is good engineering. But when developers treat legal requirements like deterministic specs, they build systems that are either over-constrained (blocking legitimate operations) or under-constrained (missing real obligations). Both are expensive to fix.

### "Compliance is a feature we add later."

I've seen this kill timelines more than almost anything else.

The reasoning goes like this: let's build the product first, validate the market, then bolt on compliance before launch. It feels efficient. Ship fast, patch later.

The problem? **Compliance isn't a coat of paint. It's load-bearing.**

When we were building out role-based access controls for an enterprise security module—tens of thousands of lines of production code—the access model had to account for SOC 2 requirements around least-privilege access from day one. Not because an auditor was breathing down our necks, but because retrofitting access controls into an existing architecture meant touching every service boundary, every API call, every data flow.

If we'd built the core system first and "added compliance later," we would've essentially rebuilt it. I've watched teams do exactly that. It's demoralizing and expensive.

Think of it like plumbing in a building. You don't frame the walls, finish the drywall, and then decide where the pipes go. Compliance shapes your architecture. Your data model. Your API contracts. The earlier you account for it, the less rework you eat.

### "The legal team is slowing us down."

Sometimes, yes. Legal review cycles can be painfully slow. But most of the time when I hear this complaint, the real issue is that engineering asked legal the wrong question at the wrong time.

If you go to an attorney and say "review this feature," you'll wait weeks. If you say "we're building a feature that processes user biometric data for identity verification, we plan to store the raw data for 30 days, here's the data flow diagram—what obligations does this trigger in Brazil and Colombia?" you'll get a useful answer in days.

Lawyers aren't slow because they're inefficient. They're slow when they don't have enough context to scope the problem. Engineers scope problems for a living. Apply that skill to legal questions and watch the bottleneck shrink.

## What lawyers get wrong about engineering

### "Just make it compliant."

This is the legal equivalent of "just tell me the rule." It sounds like a clear instruction. It's actually useless.

Compliant *how*? Are we talking about encryption at rest, in transit, or both? Which encryption standard? Does the regulation specify, or is it "appropriate technical measures," that wonderfully vague phrase that shows up in half the data protection laws on the planet?

When a lawyer tells an engineering team to "make it compliant" without specifying the threat model, the data classification, or the regulatory provision, they're asking the team to guess. And engineers who guess about legal requirements build one of two things: a system that does way too much (expensive, slow, over-engineered) or a system that misses the actual risk (which the lawyer will catch in the audit and blame engineering for).

I've been on both sides of this conversation. The fix is specificity. Don't say "this needs to be secure." Say "this data is classified as sensitive personal data under Ecuador's LOPDP, we need encryption at rest using AES-256, access logging with immutable audit trails, and a 90-day retention policy with automated deletion. Here's the regulatory citation."

That an engineer can build to.

### "The technology is just implementation details."

This one is subtle and dangerous.

I've worked with lawyers who treat the entire technical stack as a black box. Data goes in, compliant output comes out. What happens in between? "That's an engineering problem."

Except the technology choices *are* compliance decisions.

Choosing between a relational database and a document store affects how you enforce data retention policies. Picking a vector database for a RAG pipeline changes how you handle right-to-deletion requests, because embeddings derived from personal data create a whole secondary compliance question that most lawyers haven't even thought about yet.

When I built a trademark monitoring platform using retrieval-augmented generation, the choice to use semantic search with phonetic similarity algorithms wasn't just a technical decision. It directly affected how we matched potentially infringing marks against registered ones, which meant it affected the legal defensibility of the results. If the algorithm missed a phonetic match that a human examiner would catch, we had a product liability question. If it over-matched, we'd flood clients with false positives and lose trust.

The attorney advising on IP strategy needed to understand *why* we chose Metaphone over Levenshtein distance for certain query types. Not the implementation details, but the trade-off: recall vs. precision, and what each meant for the client's risk profile.

Lawyers who dismiss technology as "implementation details" miss the fact that **architecture is policy**. How you build the system determines what the system can and can't do. And if the legal team doesn't understand those constraints, they'll write requirements that are either technically impossible or absurdly expensive.

### "We already reviewed this. Why is it changing?"

Software ships iteratively. Features evolve. Data flows change. A legal review of v1.0 doesn't cover v1.3. And if the legal team expects their initial sign-off to hold forever, they'll be perpetually frustrated.

This is where I see the biggest cultural mismatch. Legal culture prizes stability. Contracts are drafted to be durable. Regulations change slowly (usually). The instinct is to get it right once.

Engineering culture prizes iteration. Ship, measure, adjust. The instinct is to get it right eventually, through continuous improvement.

Neither instinct is wrong. But they collide hard in compliance-sensitive products.

The solution I've landed on, after watching this collision happen on multiple projects, is building compliance checks into the CI/CD pipeline, not the calendar. Instead of quarterly legal reviews, you build automated checks that flag when a data flow changes, when a new data type enters the system, when an API contract is modified in a way that might affect data processing agreements.

You don't eliminate legal review. You make it event-driven instead of schedule-driven. The legal team reviews changes, not the whole system every quarter. Engineering gets faster iteration cycles. Legal gets earlier visibility. Everyone's less annoyed.

## The real problem is structural

Here's my actual thesis, the thing I keep coming back to.

The gap between developers and lawyers isn't about intelligence or competence. It's about modeling.

Engineers model the world in systems: inputs, outputs, state, transformations. Lawyers model the world in rules: obligations, permissions, prohibitions, exceptions. Both are trying to manage complexity. Both are trying to reduce risk. But they're using fundamentally different frameworks, and neither side is taught to translate between them.

Law school doesn't teach you how a distributed system handles data residency. Computer science programs don't teach you how regulatory ambiguity affects design decisions. So you end up with two groups of very capable people talking past each other in meetings, each frustrated that the other "doesn't get it."

I got lucky—or stubborn, depending on who you ask—and ended up building in both worlds. What I've learned is that the translation layer between legal and engineering isn't a person (though it helps to have one). It's a shared artifact.

Data flow diagrams that map to regulatory obligations. Threat models that reference specific provisions. Architecture decision records that include compliance trade-offs alongside performance and cost trade-offs.

When both teams can look at the same document and see their own concerns reflected, the conversation changes. Instead of "make it compliant" or "give me a checklist," you get: "This data flow triggers obligations X, Y, and Z. Here are three architecture options that satisfy them, each with different cost, performance, and risk profiles. Which trade-off fits our business?"

That's how products get built at the intersection of law and engineering. Not by one side winning the argument, but by both sides modeling the same reality.

## So what do you do with this?

**If you're a developer:** Learn to ask legal questions the way you'd write a good bug report. Specific. Scoped. With enough context that the lawyer can reproduce the problem. Don't ask "is this feature compliant?" Ask "does storing biometric templates in a third-party cloud service in the US violate Brazil's cross-border transfer restrictions given that our DPA includes standard contractual clauses?"

**If you're a lawyer:** Learn to read a data flow diagram. You don't need to write code. But you need to understand what a database migration means, why a microservices architecture handles data differently than a monolith, and what happens when an engineering team says "that requirement would mean rewriting the entire auth service." Because sometimes that's pushback. And sometimes it's a genuine constraint you need to design around.

**If you're both, or trying to be:** Welcome to the weird middle. It's messy here. The regulations are ambiguous, the systems are complex, and nobody's textbook covers the intersection.

But every product worth building lives in that intersection. And the people who can work in it—really work in it, not just wave at it from one side—are the ones shipping things that actually hold up when the auditor calls or the regulator sends a letter.

The checklist crowd and the "just make it work" crowd will always be loud. Build anyway.
