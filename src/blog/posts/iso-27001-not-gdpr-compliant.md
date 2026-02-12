---
title: "Your ISO 27001 Certificate Doesn't Make You GDPR Compliant"
description: "ISO 27001 covers security. The GDPR covers security and privacy. Here's the structural gap that catches companies off guard—sometimes to the tune of hundreds of millions of euros."
date: 2026-02-03
lastModified: 2026-02-11
tags:
  - posts
  - compliance
  - legal-tech
  - gdpr
  - security
---

There's a question that comes up constantly in compliance discussions: "We have ISO 27001. Doesn't that mean we're GDPR compliant?"

The short answer is no. The longer answer explains a structural gap that catches companies off guard, sometimes to the tune of hundreds of millions of euros.

ISO 27001 is a voluntary international standard for information security. The GDPR is enforceable law. Both deal with protecting data, but they protect different things, for different reasons, with different consequences when you get it wrong. Treating one as a substitute for the other is how companies end up with world-class locks on every door while the building itself doesn't meet code.

## One Is a Law. The Other Is a Framework.

The GDPR (General Data Protection Regulation) is a regulation enforceable across the European Union. Violations carry fines of up to €20 million or 4% of global annual revenue, whichever is higher.

The enforcement numbers make this concrete. According to the CMS GDPR Enforcement Tracker Report (6th edition, March 2025), EU data protection authorities have issued over 2,245 published fines since 2018, totaling approximately €5.65 billion. DLA Piper's January 2025 survey puts the cumulative total at €5.88 billion, with €1.2 billion issued in 2024 alone. The Irish DPC fined TikTok €530 million in May 2025 for transferring European users' data to China without adequate protections. LinkedIn received a €310 million fine in October 2024 for behavioral advertising violations. Uber was fined €290 million by the Dutch DPA in January 2024 for improperly transferring European drivers' personal data to the United States. Meta has received multiple fines, including the largest GDPR penalty ever: €1.2 billion in 2023.

ISO 27001 is a voluntary international standard published by the International Organization for Standardization. It provides requirements for establishing, implementing, maintaining, and improving an Information Security Management System (ISMS). Certification is valuable. It signals operational maturity and gives you a structured approach to managing security risks. But there are no statutory penalties for non-compliance. No regulator knocks on your door because your Annex A controls are out of date.

Both matter. But confusing one for the other is where organizations get exposed.

## Where ISO 27001 Does the Heavy Lifting

ISO 27001 covers a significant portion of what the GDPR demands under Article 32, "Security of Processing." This is the article that requires organizations to implement "appropriate technical and organisational measures" to protect personal data. Encryption, pseudonymization, access controls, resilience of processing systems, regular testing of security measures.

If your ISMS is mature, you've already addressed these requirements. ISO 27001's risk assessment methodology (Clauses 6.1.2 and 6.1.3), its vendor management controls (Clause 8 and Annex A.15), its incident management framework (Annex A.16), and its documentation requirements (Clause 8) all map directly to GDPR obligations under Articles 5, 24, 25, 28, 30, and 32.

The GDPR itself acknowledges this relationship. Article 24(3) states that adherence to approved codes of conduct or approved certification mechanisms "may be used as an element by which to demonstrate compliance with the obligations of the controller." Article 42 further addresses certification as a tool for demonstrating compliance.

The operative phrase is *"an element."* Not the whole picture. One piece of evidence in a much larger compliance obligation.

## Where ISO 27001 Drops Off

The GDPR contains 99 Articles organized across 11 Chapters. The security requirements that ISO 27001 maps to cover a fraction of that scope. The rest addresses something ISO 27001 was never designed to cover: **data privacy rights**.

The gap is structural.

**Consent management (Articles 7 and 8).** The GDPR requires explicit, informed, freely given consent before processing personal data, and requires that controllers can demonstrate that consent was obtained. Pre-checked boxes don't qualify. Consent must be as easy to withdraw as it is to give. ISO 27001 contains no requirements around how user consent is collected, recorded, or managed. Your ISMS doesn't address whether your signup flow has a lawful basis for each processing activity.

**Data subject rights (Chapter 3, Articles 12–22).** The GDPR grants individuals eight specific rights:

- The right to be informed (Articles 13–14)
- The right of access (Article 15)
- The right to rectification (Article 16)
- The right to erasure, also called "the right to be forgotten" (Article 17)
- The right to restrict processing (Article 18)
- The right to data portability (Article 20)
- The right to object (Article 21)
- Rights related to automated decision-making and profiling (Article 22)

ISO 27001 does not address any of these. An ISMS ensures data is stored securely. It says nothing about whether a system can locate all data held on a specific individual, package it in a machine-readable format for portability, cascade a deletion request across services and third-party integrations, or halt processing while retaining the record. These aren't security problems. They're product architecture problems that require purpose-built workflows, APIs, and data governance pipelines.

**Breach notification timelines (Articles 33–34).** Both the GDPR and ISO 27001 address incident response. But the GDPR mandates notification to the relevant supervisory authority within 72 hours of becoming aware of a personal data breach. If the breach poses a high risk to individuals, they must also be notified directly, without undue delay. ISO 27001's Annex A.16 covers incident management but does not specify a notification deadline. That specificity matters when the clock starts ticking.

**Data Protection Impact Assessments (Article 35).** The GDPR requires DPIAs before high-risk processing activities: large-scale profiling, systematic monitoring, or processing of sensitive data categories. ISO 27001's risk assessment process evaluates risks *to the organization's information assets*. A DPIA evaluates risks *to the individuals whose data is processed*. The lens is fundamentally different.

**International data transfers (Articles 44–49).** Moving personal data outside the EU requires that the receiving country provides an "essentially equivalent" level of data protection. This is precisely what drove TikTok's €530 million fine. The company couldn't demonstrate that Chinese law provided equivalent protections for European users' data. ISO 27001 addresses vendor management and outsourcing controls, but it doesn't evaluate the legal adequacy of cross-border data flows under EU standards.

**Data Protection Officer (Articles 37–39).** Certain organizations (public authorities, companies that conduct large-scale systematic monitoring, or those processing sensitive data at scale) must appoint a DPO. ISO 27001 has no equivalent requirement.

## The Core Distinction: Security vs. Privacy

This is the structural divide that explains the entire gap.

**Security** protects data from unauthorized access, modification, or destruction. It's encryption, access controls, network segmentation, incident response. ISO 27001 lives here.

**Privacy** governs *how* data is collected, *why* it's processed, *who* has rights over it, and *when* it must be deleted. The GDPR spans both security and privacy. ISO 27001 covers only security.

A fully encrypted database that stores personal data collected without lawful basis is *secure*. It is not *compliant*. An organization with airtight access controls but no mechanism for handling erasure requests has strong security and a GDPR violation waiting to happen.

Only one of the GDPR's seven core principles, "integrity and confidentiality" (Article 5(1)(f)), deals directly with security. The other six (lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, and storage limitation) fall squarely in the privacy domain that ISO 27001 doesn't touch.

## ISO 27701: The Privacy Extension

The ISO family recognized this gap. ISO 27701, published in 2019, is a privacy extension that bolts onto an existing ISO 27001 ISMS. It specifies requirements for a Privacy Information Management System (PIMS) and addresses many of the areas ISO 27001 misses: consent management, data subject rights, purpose limitation, data retention, and the distinct roles of controllers and processors.

ISO 27701 gets significantly closer to GDPR alignment. But it's still a framework, not a law. It doesn't replace the need for DPIAs, DPO appointments, or compliance with specific jurisdictional requirements of individual EU member states' data protection authorities. And certification to ISO 27701 doesn't provide immunity from enforcement.

Frameworks give you structure. Laws give you obligations. The strongest compliance posture uses both: the framework as the operational backbone, the legal requirements as the floor you can't drop below.

## What This Means in Practice

If you're building or operating a product that processes EU personal data, the practical takeaway breaks down clearly:

**ISO 27001 covers your security foundation.** Risk assessments, access controls, encryption, vendor management, incident response, documentation. This is roughly the Article 32 portion of GDPR compliance. Essential, but partial.

**GDPR compliance requires a privacy layer on top of that foundation.** Consent management built into your application, not a spreadsheet. Data subject request workflows that can locate, export, restrict, and delete personal data across your stack. Retention policies that actually execute, meaning automated purges, not policies gathering dust. Breach notification procedures with documented timelines. DPIAs conducted before launching high-risk features. Lawful basis documented for every processing activity.

From a product perspective, GDPR compliance is infrastructure. It affects your database schema, your API design, your event pipelines, your third-party integration contracts. Article 25, Data Protection by Design and by Default, means your architecture should account for data minimization, purpose limitation, and individual rights from the beginning of the development lifecycle, not as a retrofit.

**For organizations operating across multiple jurisdictions,** particularly companies serving EU customers from Latin America, there's an added layer. Brazil's LGPD, Colombia's data protection framework, Ecuador's LOPDP each carry their own requirements that sometimes align with the GDPR and sometimes diverge. ISO 27001 provides a shared security baseline across all of them. But the privacy obligations are jurisdiction-specific and demand jurisdiction-specific product decisions.

## The Bottom Line

ISO 27001 certification demonstrates that your security practices meet an internationally recognized standard. That's valuable. It builds trust with enterprise buyers, supports contract negotiations, and provides operational discipline that makes broader compliance work easier.

But it does not demonstrate that your product respects the rights of the people whose data it processes. It doesn't prove lawful basis for processing. It doesn't show that you can honor an erasure request within 30 days. It doesn't address whether your cross-border data transfers meet EU adequacy requirements.

The certificate is a foundation. The GDPR requires the entire building.

If you hold ISO 27001 and assume you're covered, run a gap analysis against the full 99 Articles. You'll likely find that your ISMS addresses the security requirements well, and that the privacy, rights, and governance requirements need dedicated, product-level work that no security framework was designed to provide.

---

**Keep reading:**
- [The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters](/blog/saas-compliance-stack/)
- [How to Prepare for a Compliance Audit in Ecuador (And Why Certification Might Be Worth It)](/blog/ecuador-compliance-audit-guide/)
- [RAG Pipelines and the Right to Be Forgotten: An Engineering Problem Disguised as a Legal One](/blog/rag-pipelines-right-to-be-forgotten/)

*Need help closing the gap between ISO 27001 and GDPR? [Let's talk](https://calendly.com/juanidrovo).*
