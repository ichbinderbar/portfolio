---
title: "Why the AI Act Doesn't Treat All AI the Same: The Proportionality Principle for Developers"
description: "The EU AI Act's four-tier risk system isn't arbitrary. It's a constitutional requirement called proportionality. Here's how to use it to figure out which rules apply to your product."
date: 2026-02-13
lastModified: 2026-02-13
tags:
  - posts
  - eu-law
  - ai-regulation
  - compliance
  - product-management
---

You read the EU AI Act's requirements for high-risk AI systems and the compliance list is severe: conformity assessments, quality management systems, automatic event logging, technical documentation for the entire model lifecycle. Then you look at your product - a customer support chatbot - and wonder if you really need all of that.

You don't. And the reason you don't isn't a policy choice or a concession to industry lobbying. It's a binding constitutional constraint on every piece of EU legislation, written into Article 5(4) of the Treaty on European Union:

> "Under the principle of proportionality, the content and form of Union action shall not exceed what is necessary to achieve the objectives of the Treaties."

This principle is why the AI Act has four risk tiers instead of a single set of rules. It's why your chatbot faces different obligations than a resume screening tool. And understanding it will help you make better product decisions about how much compliance infrastructure your AI feature actually needs.

## What Proportionality Means in EU Constitutional Law

Proportionality isn't a soft guideline. It's one of three governing principles - alongside conferral and subsidiarity - that constrain how the EU exercises its powers. Every EU regulation and directive must satisfy it. If it doesn't, the Court of Justice of the EU (CJEU) can annul the legislation entirely.

The CJEU applies a three-step test when evaluating proportionality:

1. **Suitability.** Is the measure capable of achieving its stated objective?
2. **Necessity.** Is there a less restrictive way to achieve the same objective?
3. **Proportionality stricto sensu.** Even if the measure is suitable and necessary, does it impose an excessive burden relative to the benefit?

This isn't theoretical. The Court has struck down EU legislation for failing this test.

In *Digital Rights Ireland* (Joined Cases C-293/12 and C-594/12, judgment of 8 April 2014), the CJEU invalidated the Data Retention Directive (2006/24/EC) in its entirety. The Directive required telecoms providers to retain all users' communications metadata for 6 to 24 months. The objective - fighting serious crime - was legitimate. But the means - blanket retention of everyone's data with no differentiation, no connection to a threat, and no independent review of access - went beyond what was necessary. The Court found it a "wide-ranging and particularly serious interference" with Articles 7 and 8 of the Charter of Fundamental Rights that exceeded the limits of proportionality.

In *Schrems II* (Case C-311/18, 16 July 2020), the Court invalidated the EU-US Privacy Shield adequacy decision, finding that US surveillance programs under Section 702 FISA were "not limited to what is strictly necessary" under the proportionality standard.

In *Tobacco Advertising I* (Case C-376/98, 5 October 2000), the Court annulled a blanket ban on tobacco advertising because the measure went beyond what was necessary for its stated internal market objective.

These cases establish a pattern: if the EU legislates too broadly relative to the problem it's trying to solve, courts will strike it down. The EU AI Act was drafted with these precedents in mind.

## How Proportionality Shapes the AI Act's Risk Tiers

If the EU had imposed high-risk compliance requirements on every AI system regardless of context, the regulation itself would be vulnerable to a proportionality challenge. A chatbot that tells users the weather doesn't pose the same risk as a system that decides who gets a mortgage. Regulating both identically would fail the necessity test.

The AI Act (Regulation (EU) 2024/1689, in force since 1 August 2024) says this explicitly. Recital 26 states:

> "In order to introduce a proportionate and effective set of binding rules for AI systems, a clearly defined risk-based approach should be followed. That approach should tailor the type and content of such rules to the intensity and scope of the risks that AI systems can generate."

And Recital 176 contains the standard proportionality compliance clause:

> "In accordance with the principle of proportionality as set out in [Article 5 TEU], this Regulation does not go beyond what is necessary in order to achieve that objective."

The Commission's original proposal (COM(2021) 206 final, 21 April 2021) described the AI Act as a "balanced and proportionate horizontal regulatory approach to AI that is limited to the minimum necessary requirements to address the risks and problems linked to AI, without unduly constraining or hindering technological development or otherwise disproportionately increasing the cost of placing AI solutions on the market."

The four-tier risk system is proportionality operationalized:

### Unacceptable Risk (Article 5) - Banned

Eight categories of AI practices are prohibited outright: social scoring by public authorities, real-time remote biometric identification in public spaces (with narrow law enforcement exceptions), subliminal manipulation that causes harm, exploitation of vulnerabilities of specific groups, and emotion recognition in workplaces and educational institutions, among others.

The proportionality logic: these applications pose risks so severe to fundamental rights that no set of compliance requirements would adequately mitigate them. A ban is the only measure that passes the necessity test.

### High Risk (Articles 6-49) - Full compliance stack

The heaviest burden. Conformity assessments, quality management systems, data governance requirements, human oversight interfaces, automatic event logging, and technical documentation. The requirements under Articles 8 through 15 are extensive.

A system qualifies as high-risk through two paths:

**Safety legislation pathway (Article 6(1)):** The AI is a safety component of a product already regulated under existing EU harmonization legislation (medical devices, machinery, vehicles, aviation) and requires third-party conformity assessment.

**Annex III pathway (Article 6(2)):** The system falls into one of eight use-case categories listed in Annex III:

| Area | Examples |
|------|----------|
| Biometrics | Remote biometric identification, emotion recognition |
| Critical infrastructure | Safety components in energy, water, transport, digital infrastructure |
| Education | Determining admission, evaluating students, monitoring during exams |
| Employment | Recruitment screening, performance evaluation, task allocation |
| Essential services | Credit scoring, insurance risk assessment, emergency dispatch |
| Law enforcement | Evidence reliability, individual risk assessment, profiling |
| Migration and border control | Security risk assessment, visa/asylum application processing |
| Administration of justice | Assisting judicial authorities, systems influencing elections |

The proportionality logic: these are domains where AI errors have direct consequences on people's fundamental rights, safety, or access to essential services. The compliance burden is heavy because the harm potential is high.

### Limited Risk (Article 50) - Transparency only

If your AI system interacts directly with people, generates synthetic content (deepfakes, AI-generated text or audio), or performs emotion recognition or biometric categorization, you must disclose that fact. Users must know they're interacting with AI or looking at AI-generated content.

The proportionality logic: these systems pose manageable risks that can be addressed through informed consent. A full conformity assessment for a chatbot that identifies itself as a chatbot would be disproportionate to the harm.

### Minimal Risk - No mandatory obligations

Spam filters, AI-assisted video game NPCs, inventory management systems, recommendation engines for non-essential products. No specific requirements beyond existing law. The AI Act encourages voluntary codes of conduct (Article 95) but mandates nothing.

The proportionality logic: regulation here would impose compliance costs that far exceed any harm these systems could cause.

## The Self-Classification Framework

This is where proportionality becomes a practical product decision. Before asking "how do I comply?" ask "which tier am I in?"

**Step 1: Check the ban list (Article 5).** Social scoring, subliminal manipulation, exploitation of vulnerable groups, untargeted facial image scraping, emotion recognition in workplaces or schools. If your system does any of these, stop. Redesign or don't ship.

**Step 2: Check Annex III.** Go through the eight categories. Does your system touch biometrics, critical infrastructure, education access, employment decisions, essential services, law enforcement, migration, or justice administration? If yes, you're likely high-risk.

**Step 3: Check the safety legislation pathway (Article 6(1)).** Is your AI a component in a product regulated under existing EU harmonization legislation? A diagnostic AI in a medical device? High-risk. An AI chip in machinery? High-risk if the sectoral legislation requires third-party conformity assessment.

**Step 4: Apply the Article 6(3) exceptions.** Even if you fall under Annex III, you may be exempt if your system meets at least one of four conditions:

1. It performs a **narrow procedural task** with minimal impact on outcomes
2. It **improves the result** of a previously completed human activity without replacing human judgment
3. It **detects decision-making patterns** without influencing outcomes
4. It performs a **preparatory task** for an Annex III assessment without direct decision-making authority

There's a critical override: AI that performs **profiling of natural persons** (automated evaluation of personal aspects like behavior, preferences, or reliability) is always classified as high-risk, regardless of these exceptions. And providers claiming the exemption must document their assessment before placing the system on the market.

**Step 5: If none of the above, check Article 50.** Does your system generate content, interact with users directly, or categorize people based on biometric data? Transparency obligations apply. If none of these, you're minimal risk.

For LATAM teams building for global markets: this classification exercise should happen before architecture decisions. If you're high-risk, you need [logging, human oversight interfaces, and data governance pipelines](/blog/direct-effect-ai-act/) from day one. Retrofitting those is a backend rewrite, not a configuration change.

## How Proportionality Shapes Enforcement, Not Just Classification

Proportionality doesn't just structure the law. It shapes how regulators enforce it.

Article 99 establishes a three-tier penalty structure:

| Violation | Max Fine (absolute) | Max Fine (turnover) |
|-----------|-------------------|-------------------|
| Prohibited AI practices (Art. 5) | EUR 35,000,000 | 7% of worldwide annual turnover |
| Other operator obligations | EUR 15,000,000 | 3% of worldwide annual turnover |
| Supplying incorrect information | EUR 7,500,000 | 1% of worldwide annual turnover |

For regular companies, the applicable fine is whichever is higher. But for SMEs and startups, the applicable fine is whichever is **lower** - a significant concession. That's proportionality applied to punishment: a bootstrapped startup misclassifying its system will not face the same financial consequences as a multinational knowingly deploying a banned practice.

Article 99 also requires that fines be "effective, proportionate, and dissuasive," with authorities considering the size, turnover, and market share of the provider when calculating penalties. This mirrors the GDPR's enforcement approach and ensures that penalties scale to the entity's capacity.

## The Connection to "How Much Compliance Is Enough?"

If you've read the [compliance posts on this blog](/blog/saas-compliance-stack/), you've encountered this question before: "Which certifications and frameworks actually matter for my situation?"

Proportionality provides the principled answer. The EU doesn't impose uniform obligations because uniform obligations would be disproportionate. Your compliance effort should follow the same logic - scaling to your actual risk profile rather than to the maximum possible regulatory burden.

For a LATAM startup building an AI-powered internal tool with no EU customers: the AI Act may not apply directly. For the same startup signing its first enterprise deal with a Madrid-based multinational: the [contractual infection vector](/blog/direct-effect-ai-act/) kicks in, and the proportionate response is to classify your system, implement the corresponding tier's requirements, and document that you did so.

The principle cuts both ways. It limits what regulators can demand from you. But it also establishes that doing nothing when you fall into the high-risk category is indefensible. If the harm potential is high, a minimal compliance effort is not proportionate to the risk. The [human-in-the-loop interfaces, comprehensive logging, and bias monitoring](/blog/ai-agents-liability/) are architectural requirements, not nice-to-haves.

## The Compliance Timeline

The AI Act entered into force on 1 August 2024, but obligations phase in gradually:

| Date | What applies |
|------|-------------|
| 2 February 2025 | Prohibited AI practices (Art. 5) take effect |
| 2 August 2025 | GPAI model governance, notification obligations |
| 2 August 2026 | High-risk system requirements (Annex III), transparency obligations (Art. 50) |
| 2 August 2027 | High-risk AI in safety-regulated products |

If you're building AI features that touch Annex III categories, August 2026 is your hard deadline for full compliance. That's not much runway. The time to classify your system and design accordingly is now.

## What This Means for Product Decisions

Proportionality isn't just a legal concept. It's a prioritization framework.

If your AI feature classifies as minimal risk, your compliance investment is near zero. Ship the feature.

If it classifies as limited risk, budget a sprint for transparency disclosures and documentation. Then ship.

If it classifies as high-risk, treat compliance as a core product workstream with its own backlog and sprint allocation. It's not overhead - it's the cost of operating in that market, the same way you'd budget for PCI DSS if you processed credit cards.

The AI Act's risk tiers give you explicit, legally grounded permission to right-size your compliance effort. The proportionality principle ensures the regulation won't demand more than what's necessary. But it also ensures that regulators, courts, and enterprise buyers will expect you to meet the standard that matches your risk level.

Classify first. Build accordingly.

---

**Keep reading:**
- [The Direct Effect of the EU AI Act: Why Local Compliance Isn't Enough](/blog/direct-effect-ai-act/)
- [AI Agents and Liability: Who's Responsible When the Agent Gets It Wrong?](/blog/ai-agents-liability/)
- [The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters](/blog/saas-compliance-stack/)

*Building AI features and unsure which risk tier you fall into? [Let's talk](https://calendly.com/juanidrovo).*
