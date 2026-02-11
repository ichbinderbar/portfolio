---
title: "The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters"
description: "SaaS companies face a growing list of compliance frameworks - SOC 2, ISO 27001, GDPR, CCPA, HIPAA, PCI DSS - but most don't need all of them. Here's how to build a compliance stack based on your market, stage, and customers."
date: 2026-02-15
tags:
  - posts
  - compliance
  - security
  - soc-2
  - iso-27001
  - gdpr
---

The compliance landscape for SaaS companies has grown from "get SOC 2 when enterprise customers ask" to a maze of overlapping frameworks, regulations, and certifications - each with its own audit process, cost structure, and market expectations.

SOC 2, ISO 27001, GDPR, CCPA, HIPAA, PCI DSS, FedRAMP, the EU AI Act. The question isn't whether compliance matters. It's which frameworks matter for your business, in what order, and how to avoid spending three times what you should by pursuing them badly.

This is the practical guide: which compliance frameworks exist, who they're for, how they overlap, and how to sequence them based on where you sell and what stage you're at.

## The Framework Landscape

### SOC 2

**What it is:** An attestation report issued by a licensed CPA firm evaluating your security controls against the AICPA's Trust Services Criteria. Not a certification - there's no pass/fail and no certifying body.

**Who needs it:** B2B SaaS companies selling to U.S. mid-market and enterprise buyers. The majority of enterprise procurement teams require a SOC 2 report before signing.

**What it costs:** $40,000-$80,000 all-in for Type II (first year). $30,000-$60,000 annually for renewal.

**Timeline:** 4-7 months for Type I, 9-15 months for Type II.

For a deep dive, see [SOC 2 Compliance Explained](/blog/what-is-soc-2-compliance/).

### ISO 27001

**What it is:** A formal certification from an accredited body (BSI, LRQA, SGS) confirming your Information Security Management System (ISMS) meets the ISO 27001 standard. Unlike SOC 2, it's a certificate - you pass or you don't.

**Who needs it:** SaaS companies selling to European enterprises, Asia-Pacific markets, or any buyer that specifically requires ISO 27001 certification. Some European procurement processes won't accept SOC 2 as a substitute.

**What it costs:** $60,000-$200,000 for initial certification. $6,000-$40,000/year for annual surveillance audits. The certificate is valid for three years.

**Timeline:** 3-12 months depending on existing security maturity.

For the detailed comparison, see [SOC 2 vs ISO 27001](/blog/soc-2-vs-iso-27001/).

### GDPR (General Data Protection Regulation)

**What it is:** The EU regulation governing how personal data of EU residents is collected, stored, processed, and transferred. Applies to any company processing EU residents' data, regardless of where the company is headquartered.

**Who needs it:** Any SaaS company with EU customers or users. Not optional - it's a legal obligation, not a market expectation.

**What it costs:** Highly variable. Initial compliance setup costs $20,000-$100,000+ depending on data complexity. Ongoing costs include legal counsel, DPA management, privacy tooling, and potentially a Data Protection Officer.

**Penalties:** Up to 20 million EUR or 4% of global annual revenue - whichever is higher. EU supervisory authorities issued approximately 1.2 billion EUR in fines in 2024, bringing cumulative GDPR fines since 2018 to nearly 6 billion EUR.

**Key obligations for SaaS companies:**

- **Data Processing Agreements (DPAs):** If you process personal data on behalf of customers - which virtually every B2B SaaS product does - you must have a DPA in place under Article 28(3). The DPA specifies what data you process, why, how long you retain it, and what security measures you maintain.

- **Sub-processor management:** Every third-party service that accesses your customers' personal data (AWS, Stripe, SendGrid, your analytics platform) is a sub-processor. You must maintain a complete inventory, notify customers of changes, provide objection rights, and ensure each sub-processor has its own DPA with you. The average company uses over 700 vendors - tracking these is a meaningful operational burden.

- **International data transfers:** If you transfer EU personal data outside the EEA (to U.S. servers, for example), you need a valid transfer mechanism. The EU-US Data Privacy Framework (DPF), adopted in July 2023, provides an adequacy basis for transfers to U.S. organizations that self-certify under the framework. Companies not certified under the DPF must use Standard Contractual Clauses (SCCs) with a documented Transfer Impact Assessment. The DPF's long-term stability remains uncertain - legal challenges have been filed and political changes could affect its status - so many companies maintain SCCs as a fallback.

- **Data Protection Officer (DPO):** Required if your core activities involve large-scale processing of personal data or large-scale systematic monitoring of individuals. Most B2B SaaS companies that don't process sensitive personal data at scale won't need one, but the analysis is fact-specific. Getting it wrong carries penalties up to 10 million EUR.

### CCPA / CPRA (California Privacy Law)

**What it is:** California's consumer privacy law (CCPA, enhanced by CPRA in 2023) governing how businesses handle personal information of California residents.

**Who needs it:** Companies doing business in California that meet revenue or data volume thresholds - in practice, most SaaS companies with California users.

**Key obligations for SaaS companies:**

- **Service provider agreements:** If you're a SaaS product processing data on behalf of customers, you're likely a "service provider" under CCPA. Written contracts must specify what you can and can't do with the data - you can't sell it, share it for advertising, or combine it with data from other sources.

- **Opt-out mechanisms:** Consumers have the right to opt out of the sale or sharing of their personal information. As of 2025, you must honor Global Privacy Control (GPC) browser signals automatically - you can't require users to manually opt out if their browser is already signaling the preference.

- **Data mapping:** You need to know what personal information you collect, from what sources, for what purposes, who you share it with, and how long you retain it. This sounds straightforward until you account for analytics tools, marketing pixels, customer success platforms, and third-party integrations.

### Vertical-Specific Frameworks

**HIPAA** - Mandatory for SaaS handling Protected Health Information (PHI). Healthcare technology vendors, patient portals, telehealth platforms, and any service processing health data. Requires Business Associate Agreements, specific technical safeguards, and breach notification procedures. Fines reach up to $2.1 million per violation category per year (adjusted for inflation from the original $1.5 million statutory amount).

**PCI DSS** - Mandatory for SaaS that stores, processes, or transmits payment card data. Payment processors, e-commerce platforms, subscription billing systems handling card numbers directly. If you use Stripe or a similar tokenization service that handles card data on your behalf, PCI DSS scope is significantly reduced.

**FedRAMP** - Required for SaaS sold to U.S. federal government agencies. Significantly more rigorous and expensive than commercial frameworks. If you're not selling to federal agencies, you don't need it.

## How the Frameworks Overlap

The good news: these frameworks share roughly 80% of underlying control requirements. The bad news: the remaining 20% is framework-specific, and the documentation, audit processes, and certification mechanisms are all different.

### SOC 2 and ISO 27001

The AICPA publishes an official mapping showing approximately 80% overlap between SOC 2 Trust Services Criteria and ISO 27001 Annex A controls. In practice, if you have a SOC 2 Type II report, achieving ISO 27001 certification requires:

- Building the ISMS documentation framework (ISO 27001 is more prescriptive about management system documentation than SOC 2)
- Conducting a formal risk assessment using ISO 27001's specific methodology
- Implementing ISO 27001-specific controls that SOC 2 doesn't address (some physical security controls, business continuity specifics)
- Going through a different audit process with an accredited certification body

**What transfers directly:** Access controls, encryption standards, change management processes, incident response procedures, vendor management programs, employee training, logging and monitoring - everything you built for SOC 2 applies.

**What doesn't transfer:** The ISMS documentation structure, the risk assessment methodology, certain controls in ISO 27001 Annex A that SOC 2 doesn't explicitly require, and the audit relationship (different auditor, different process).

For a company that already has SOC 2, adding ISO 27001 typically costs 40-60% of what it would cost from scratch.

### SOC 2/ISO 27001 and GDPR

SOC 2 and ISO 27001 are security frameworks. GDPR is a data protection regulation. They address related but different concerns:

- **Security frameworks** ask: "Are you protecting data effectively?"
- **GDPR** asks: "Do you have a lawful basis for processing personal data, are you transparent about it, and do you respect data subject rights?"

Having SOC 2 or ISO 27001 provides evidence of technical and organizational measures - which GDPR Article 32 requires - but it doesn't address consent management, data subject access requests, purpose limitation, data minimization, or the legal basis for processing. You need SOC 2/ISO 27001 AND GDPR compliance. They're complementary, not substitutes.

### SOC 2/ISO 27001 and HIPAA

Strong security controls from SOC 2 or ISO 27001 provide a foundation for HIPAA technical safeguards - access controls, encryption, audit logging, and incident response are already in place. But HIPAA adds PHI-specific requirements: Business Associate Agreements, the Privacy Rule (who can access what health data and under what circumstances), specific breach notification timelines, and the distinction between covered entities and business associates.

### The overlap principle

Every framework you've implemented makes the next one cheaper. A company with SOC 2 that adds ISO 27001 spends roughly half what a company starting ISO 27001 from scratch would spend. A company with SOC 2 and ISO 27001 that adds HIPAA spends far less on technical controls (they're already implemented) and primarily invests in the PHI-specific requirements.

This is why sequencing matters.

## Building Your Compliance Stack: What to Pursue When

### Stage 1: Foundation (Seed to Early Revenue)

**Pursue:** Basic security practices. GDPR compliance if you have EU users. CCPA compliance if you have California users.

**Don't pursue:** Formal certifications. No enterprise buyer expects SOC 2 from a pre-revenue startup. Spending $60,000+ on compliance before product-market fit is money better spent on the product.

**What "foundation" means practically:**
- MFA on all systems
- Encryption at rest and in transit
- Role-based access controls
- Change management basics (code review, CI/CD)
- A privacy policy that accurately describes your data practices
- DPAs with customers if you process their users' personal data (GDPR requirement, not optional)

This foundation doesn't cost much - most of it is engineering practices you should adopt anyway. But it dramatically reduces the cost and timeline of formal compliance later.

### Stage 2: First Certification (Series A, $1M-$5M ARR, Enterprise Sales Starting)

**Pursue:** SOC 2 Type II if selling to U.S. enterprises. ISO 27001 if selling to European enterprises. Pick the one your buyers are actually asking for.

**Timeline:** Start 6-12 months before you need to close a major enterprise deal. If a prospect asks for SOC 2 today and you haven't started, you're already behind.

**Cost:** $40,000-$80,000 all-in for SOC 2 Type II. $60,000-$200,000 for ISO 27001 (ISO tends to cost more upfront but has lower annual renewal costs).

The decision between SOC 2 and ISO 27001 comes down to geography:
- Primarily U.S. market → SOC 2 first
- Primarily European market → ISO 27001 first
- Both markets equally → SOC 2 first (faster, cheaper), then ISO 27001 within 12-18 months

For startup-specific guidance on timing, costs, and execution, see [SOC 2 for Startups](/blog/soc-2-for-startups/).

### Stage 3: Second Framework (Series B, $5M-$20M ARR, International Expansion)

**Pursue:** Whichever of SOC 2 or ISO 27001 you didn't do first. The 80% control overlap means the incremental cost is 40-60% of the original investment.

**Why now:** At this stage, either your U.S. enterprise customers are asking about ISO 27001 (because they sell internationally and need their vendors certified) or your European expansion requires ISO 27001 alongside your existing SOC 2.

**Cost:** $30,000-$80,000 incremental, leveraging existing security program.

### Stage 4: Vertical Frameworks (When Market Requires)

**Pursue:** HIPAA (if entering healthcare), PCI DSS (if handling payment data), FedRAMP (if selling to federal government). Only pursue these when you have customers or pipeline that specifically requires them.

Vertical frameworks are expensive and narrow. HIPAA compliance for a SaaS company can cost $50,000-$150,000. FedRAMP is even more: $200,000+ and 12-18 months of work. Don't invest in these speculatively.

### Stage 5: Continuous Compliance (Ongoing)

At scale, the goal shifts from "achieve compliance" to "maintain compliance efficiently." This means:
- Annual SOC 2 audits
- ISO 27001 surveillance audits (years 2 and 3) and recertification (year 4)
- Continuous GDPR and privacy program management
- Monitoring emerging regulations (EU AI Act, state privacy laws)
- A compliance automation platform managing evidence collection, control monitoring, and audit coordination across all frameworks

## The Cost of Doing It Wrong

### Pursuing too many frameworks at once

A company attempting SOC 2, ISO 27001, and HIPAA simultaneously in year one will spend more than the sum of the individual costs due to coordination overhead, audit fatigue, and resource fragmentation. The engineering team gets pulled into three parallel audit processes. Evidence collection happens three different ways. The compliance program becomes a year-round scramble.

**Realistic comparison:**

| Approach | Year 1 Cost | Year 2 Cost |
|---|---|---|
| All three simultaneously | $170,000+ | $60,000/year |
| Sequential (SOC 2 → ISO 27001 → HIPAA) | $60,000-$80,000 (SOC 2 only) | $40,000 (add ISO 27001) + renewal |

The sequential approach costs less in total because each subsequent framework builds on the previous one. Pursuing everything at once means building parallel compliance programs that could have been unified.

### Wrong framework for your market

Spending $60,000 on ISO 27001 when every one of your prospects asks for SOC 2 is a common and expensive mistake. The reverse happens too - U.S.-focused companies that get SOC 2 then discover their first European enterprise customer won't accept it as equivalent to ISO 27001.

Before investing: survey your existing customers and analyze your sales pipeline. What do prospects actually require? What have you lost deals over? The answer determines your first framework.

### Compliance theater

The most expensive mistake is treating compliance as a checkbox exercise - policies that don't reflect practice, controls that exist during audits and get ignored between them, evidence collected retroactively rather than continuously.

Compliance theater fails in three ways:
1. Auditors detect the gaps, resulting in exceptions or failed certifications
2. Actual security incidents occur because the controls you documented aren't operating
3. Customers who read your SOC 2 report's exception list lose confidence

The fix is straightforward: implement controls that make operational sense, use automation to maintain them continuously, and write policies that describe what you actually do.

## Data Residency and Sovereignty

Data residency has become a practical concern for SaaS companies selling internationally. The question isn't theoretical anymore - enterprise customers ask where their data is stored, which legal jurisdiction governs it, and whether it can be accessed by foreign authorities.

### The post-Schrems II reality

The 2020 Schrems II ruling invalidated the EU-U.S. Privacy Shield, and for three years companies relied on Standard Contractual Clauses with supplementary measures for EU-to-U.S. data transfers. In July 2023, the European Commission adopted the EU-US Data Privacy Framework (DPF), providing a new adequacy basis for transfers to self-certified U.S. organizations. However, the DPF faces legal challenges (a case commonly referred to as "Schrems III" has been filed), and changes in U.S. political leadership have raised questions about the framework's durability.

This uncertainty has pushed many SaaS companies toward offering EU data residency regardless of the DPF's status - hosting European customer data in EU-based data centers avoids transfer mechanism complexity entirely and provides a hedge against future legal disruptions.

### What enterprise customers expect

- **Default:** Data residency matching the customer's region
- **Option:** Customer-selected region for data storage
- **Transparency:** Clear documentation of where data is stored, which sub-processors access it, and under what jurisdictions
- **Architecture:** Multi-region deployment capability, even if not all customers require it

The EU's Cloud Sovereignty Framework (published October 2025) establishes eight sovereignty objectives for EU institutions procuring cloud services. While these currently apply to public sector procurement, they signal where private sector expectations are heading - particularly for regulated industries like financial services and healthcare.

### Practical approach for SaaS companies

If more than 20% of your revenue comes from EU customers, offer an EU-hosted option. The infrastructure cost of running EU-based deployments on AWS, GCP, or Azure is marginal compared to the legal complexity and customer friction of managing cross-border data transfers.

If you're U.S.-only today but planning international expansion, architect for multi-region from the start. Retrofitting data residency into a single-region application is significantly more expensive than designing for it upfront.

## Emerging: AI Compliance

If your SaaS product uses AI - and increasingly, every SaaS product does - a new layer of compliance requirements is forming.

### EU AI Act

The EU AI Act entered into force in August 2024, with requirements phasing in through 2026. For SaaS companies, the key obligations depend on how AI is used in your product:

- **High-risk AI systems** (employment decisions, credit scoring, education, critical infrastructure): risk management systems, transparency requirements, documentation, conformity assessments. Full requirements apply from August 2026.
- **General-purpose AI models**: transparency about training data, copyright compliance. Requirements already in effect for model providers as of 2025.
- **Limited-risk AI systems**: transparency obligations (inform users they're interacting with AI).

**Penalties:** Up to 35 million EUR or 7% of global annual revenue for prohibited practices. Even lesser violations carry penalties up to 15 million EUR or 3%.

### U.S. AI regulation

The U.S. approach is fragmented. A December 2025 executive order signals federal preemption of state AI laws, but the landscape remains uncertain. Colorado's AI Act takes effect June 2026. California's Transparency in Frontier AI Act is effective January 2026. Whether state laws survive federal preemption is unclear.

**Practical guidance:** Don't wait for regulatory clarity. Implement basic AI transparency practices now - inform users when AI is involved in your product, document how AI models are used, maintain audit trails for AI-driven decisions, and test for bias in any AI system that affects access, pricing, or eligibility.

### What this means for your compliance stack

AI compliance is not yet a separate certification or audit process. It's an emerging set of obligations layered on top of existing frameworks. For now, the practical approach is:

- Include AI systems in your existing risk assessment process
- Document AI usage in your SOC 2 system description and ISO 27001 ISMS
- Address AI transparency in your privacy policy and customer-facing documentation
- Monitor EU AI Act implementation timelines for your risk category
- Track U.S. state and federal developments quarterly

The companies that integrate AI governance into their existing compliance programs now will spend far less adapting when regulations crystallize than those that treat AI compliance as a separate future problem.

## Frequently Asked Questions

**Which compliance framework should we pursue first?**
It depends on your market. If your customers are U.S. enterprises, SOC 2 Type II. If European enterprises, ISO 27001. If both, SOC 2 first (faster and cheaper), then add ISO 27001 within 12-18 months. GDPR and CCPA are legal obligations, not optional certifications - comply with them regardless of which security framework you pursue.

**How much overlap is there between SOC 2 and ISO 27001?**
Approximately 80% of controls overlap. Access controls, encryption, change management, incident response, vendor management, and employee training satisfy both frameworks. The remaining 20% is framework-specific: ISO 27001 requires more extensive ISMS documentation and a specific risk assessment methodology; SOC 2 has different audit mechanics and its own criteria structure. A company with SOC 2 that adds ISO 27001 typically spends 40-60% of what it would cost from scratch.

**Do we need both SOC 2 and GDPR compliance?**
If you have U.S. enterprise customers and EU users, yes. They address different concerns. SOC 2 demonstrates that your security controls work. GDPR compliance demonstrates that you handle personal data lawfully. Having one does not satisfy the other, though the security measures implemented for SOC 2 provide evidence of the technical safeguards GDPR Article 32 requires.

**When should a SaaS company pursue HIPAA compliance?**
Only when you handle Protected Health Information. If you're entering the healthcare market and your product will store, process, or transmit PHI, you need HIPAA compliance before signing your first healthcare customer. If you're not in healthcare, don't pursue it speculatively - it's expensive and the requirements are narrow. Your existing SOC 2 or ISO 27001 program provides 60-70% of the technical controls HIPAA requires, so the incremental investment is the PHI-specific requirements: Business Associate Agreements, Privacy Rule compliance, and breach notification procedures.

**Can a compliance automation platform handle multiple frameworks?**
Yes, and this is where they provide the most value. Platforms like Vanta, Drata, and Secureframe maintain a unified control library that maps a single control (e.g., "MFA enabled on all production systems") to every applicable framework simultaneously. When you implement the control and collect evidence once, it satisfies SOC 2, ISO 27001, HIPAA, and GDPR requirements in parallel. Without a platform, you're maintaining separate evidence repositories and control documentation for each framework - which is how compliance costs compound unnecessarily.

**What's the total annual cost of maintaining SOC 2 + ISO 27001 + GDPR?**
For a SaaS company of 50-200 employees with both certifications and GDPR compliance operational: $80,000-$150,000/year. This includes SOC 2 annual audit ($30,000-$60,000), ISO 27001 surveillance audit ($6,000-$40,000), compliance platform subscription ($20,000-$50,000), penetration testing ($10,000-$30,000), and ongoing privacy program costs (DPA management, sub-processor tracking, training). The cost drops each year as processes mature and automation handles more of the evidence burden.

---

**Keep reading:**
- [SOC 2 Compliance Explained: What It Is, Who Needs It, and How to Get Certified](/blog/what-is-soc-2-compliance/)
- [SOC 2 vs ISO 27001: Which Certification Do You Actually Need?](/blog/soc-2-vs-iso-27001/)
- [How to Prepare for a SOC 2 Audit: A Practical Checklist](/blog/how-to-prepare-soc-2-audit/)

*Building your compliance stack and not sure where to start? [Let's talk](https://calendly.com/juanidrovo).*
