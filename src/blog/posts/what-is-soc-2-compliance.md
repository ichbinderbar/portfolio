---
title: "SOC 2 Compliance Explained: What It Is, Who Needs It, and How to Get Certified"
description: "SOC 2 is the security standard that enterprise buyers expect before signing contracts. Here's what it covers, how the audit works, what the report contains, and how to get there without wasting time or money."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - compliance
  - security
  - soc-2
---

If you're selling software to businesses, you'll eventually hear the question: "Do you have a SOC 2?" It usually comes from a prospect's security team during vendor due diligence, and the wrong answer can stall or kill a deal.

SOC 2 has become the de facto security standard for B2B software companies in the United States. It's not a law. No regulator requires it. But enterprise buyers, investors, and procurement teams treat it as a baseline expectation, and increasingly, a prerequisite.

Here's what SOC 2 actually is, what it covers, how the audit works, and how to get there.

## What SOC 2 Is (and Isn't)

SOC 2 stands for **System and Organization Controls 2**. It's a framework developed by the AICPA (American Institute of Certified Public Accountants) that evaluates how a service organization protects customer data.

A few things SOC 2 is not:

- **It's not a certification.** SOC 2 is an attestation. A licensed CPA firm examines your controls and issues a report with their opinion. There's no certifying body, no certificate, and no pass/fail. The output is a detailed report that prospects read and evaluate. Calling it a "SOC 2 certification" in sales materials signals unfamiliarity with the framework.

- **It's not a checklist.** SOC 2 doesn't prescribe specific technologies or configurations. It defines criteria your controls must meet. How you meet them is up to you. Two companies can both pass a SOC 2 audit with completely different tech stacks and control implementations.

- **It's not legally required.** No law mandates SOC 2. But it's become effectively mandatory for B2B SaaS companies selling to mid-market or enterprise clients. Without a SOC 2 report, you may be disqualified from deals or face extended security reviews that add weeks to your sales cycle.

### A Brief History

SOC 2 replaced the SAS 70 standard, which was originally designed for evaluating financial controls at service organizations. As cloud computing grew, the industry needed a framework that went beyond financial reporting to address security, availability, and data handling. In 2011, the AICPA introduced three new report types: SOC 1 (financial controls, governed by SSAE 16), SOC 2 (Trust Services Criteria, governed by AT Section 101), and SOC 3 (public summary). SOC 1 uses a different attestation standard than SOC 2 and SOC 3, though all three were released as part of the same reporting framework. In 2017, SSAE 18 superseded the earlier standards, and today SOC 2 engagements are performed under AT-C Section 205. The Trust Services Criteria (TSP Section 100) were updated with revised Points of Focus in 2022 to address evolving threats, though the core criteria themselves remain unchanged.

## What SOC 2 Evaluates: The Five Trust Services Criteria

SOC 2 organizes its requirements into five categories called Trust Services Criteria. Only one is mandatory. The rest are optional and selected based on what's relevant to your service and your customers' expectations.

### 1. Security (Required)

Every SOC 2 engagement must include Security. It's the foundation: the Common Criteria, organized into nine sub-categories (CC1 through CC9) that map to COSO internal control principles:

- **CC1 - Control Environment.** Organizational commitment to integrity, board oversight, reporting structures, competency requirements, and accountability.
- **CC2 - Communication and Information.** How you generate, use, and communicate relevant information both internally and externally.
- **CC3 - Risk Assessment.** How you identify, analyze, and manage risks, including fraud risk.
- **CC4 - Monitoring.** How you evaluate whether your controls are actually functioning over time.
- **CC5 - Control Activities.** The specific activities that mitigate risks, including technology controls and policies.
- **CC6 - Logical and Physical Access.** User registration, authorization, role-based access, physical facility restrictions, data transmission controls, and malware prevention. This is usually the largest section.
- **CC7 - System Operations.** Configuration monitoring, anomaly detection, security event evaluation, and incident response.
- **CC8 - Change Management.** Authorization, design, testing, approval, and documentation of system changes.
- **CC9 - Risk Mitigation.** Business process risk activities and vendor risk management.

Security alone contains over 30 individual criteria. For many companies, especially those early in their compliance journey, starting with Security only is the right move.

### 2. Availability (Optional)

Evaluates whether your system meets its uptime and performance commitments. Covers capacity planning, backup processes, disaster recovery, and recovery testing. Include this if your service has SLA commitments or if downtime directly impacts your customers' operations.

### 3. Processing Integrity (Optional)

Evaluates whether your system processes data completely, accurately, timely, and with proper authorization. Relevant for companies handling financial transactions, data transformations, calculations, or any processing where errors have direct business consequences.

### 4. Confidentiality (Optional)

Evaluates how you identify, protect, and dispose of confidential information (trade secrets, financial data, intellectual property, or any information designated as confidential beyond personal data).

### 5. Privacy (Optional)

Evaluates how you handle personally identifiable information (PII) across eight areas: notice, consent, collection, use and retention, access, disclosure, data quality, and monitoring. This overlaps with regulations like the GDPR and CCPA but is evaluated through the AICPA's own criteria, not those laws directly.

Most companies start with Security only, then add Availability or Confidentiality in subsequent audits as customer requirements evolve.

## Type I vs Type II

SOC 2 comes in two report types, and the distinction matters.

**SOC 2 Type I** evaluates the design of your controls at a single point in time. The auditor reviews your policies, configurations, and documentation and issues an opinion on whether controls are suitably designed to meet the applicable criteria. Think of it as a snapshot.

**SOC 2 Type II** evaluates the operating effectiveness of those controls over an observation period, typically six to twelve months. The auditor doesn't just verify that you have an access review process. They verify that you actually executed access reviews throughout the observation window and acted on the results.

Type I takes 2-5 months and costs less. It's useful when a prospect needs proof of your controls now and you can't wait for a full observation period. But Type II is what serious buyers expect. A Type I report shows you've designed good controls. A Type II report proves you operate them consistently.

The pragmatic path: get a Type I to unblock near-term deals, then start the observation period for Type II immediately. Many companies deliver their first Type II report within 12 months of starting the process.

## Who Needs SOC 2

SOC 2 isn't for every company. It's for companies that store, process, or transmit customer data as a service. In practice, that means:

- **SaaS and cloud service providers,** the primary audience
- **Managed service providers (MSPs) and IT service companies**
- **Data hosting and data center operators**
- **Healthcare technology vendors** (often alongside HIPAA)
- **Fintech companies and payment processors**
- **HR, payroll, and benefits platforms**

The trigger is almost always market-driven. Enterprise customers start asking for it during procurement. Investors ask about your security posture during due diligence. A partner requires it before integrating with your API.

If no customer, investor, or partner has asked for SOC 2, you probably don't need it yet. If they're asking, you're already behind. The process takes months, and prospects won't wait.

## How the Audit Works: Step by Step

### 1. Define Scope

Decide which Trust Services Criteria to include and which systems, processes, and teams are in scope. Scoping too broadly wastes money. Scoping too narrowly creates gaps that auditors and customers will notice.

### 2. Readiness Assessment (Optional but Recommended)

A pre-audit evaluation, usually conducted by your auditor, where they walk through your current control environment, map existing controls to the applicable criteria, and identify gaps. The output is a letter summarizing findings and remediation recommendations. Budget $10,000-$25,000 for this step. It's worth it: discovering major gaps mid-audit is significantly more expensive than discovering them upfront.

### 3. Gap Remediation

Implement the missing controls identified during readiness. This typically includes writing or updating security policies, deploying technical controls (MFA, logging, encryption, endpoint protection), establishing change management procedures, building vendor management processes, and training employees on security practices.

This is where compliance automation platforms (Vanta, Drata, Secureframe) earn their cost. They provide policy templates, automate evidence collection from your cloud infrastructure and identity providers, and continuously monitor for control gaps.

### 4. The Observation Period (Type II Only)

For Type II, your controls must operate effectively for a minimum of six months. During this window, you're collecting evidence continuously: access review records, change management tickets, monitoring alerts, training completions, vendor assessments. Everything the auditor will later examine must be documented throughout the period.

### 5. Fieldwork

The auditor examines your evidence, interviews key personnel, inspects system configurations, and tests controls against the applicable criteria. Fieldwork typically takes four to eight weeks. They're looking at 200-300 pieces of evidence across your control environment.

### 6. Report Issuance

The auditor drafts the report, shares it with your management for review, and issues the final version. Expect the report four to six weeks after fieldwork ends.

## What's Inside a SOC 2 Report

A SOC 2 report typically runs 60-100+ pages and contains five sections:

**Section 1 - Auditor's Opinion.** The CPA firm's formal opinion on whether your controls are suitably designed (Type I) or suitably designed and operating effectively (Type II). Four possible outcomes: unqualified (clean pass), qualified (mostly passed with noted exceptions), adverse (failed), or disclaimer (insufficient evidence to form an opinion).

**Section 2 - Management Assertion.** Written by your management, not the auditor. States that the system description is fairly presented and that controls meet the applicable criteria.

**Section 3 - System Description.** The most detailed section. Describes your services, system boundaries, infrastructure, software, personnel, procedures, data flows, and subservice organizations. Also lists complementary user entity controls (CUECs), controls your customers must implement on their end for the overall control environment to function.

**Section 4 - Tests of Controls and Results.** The longest section. A table mapping each control to the applicable Trust Services Criteria, describing what test the auditor performed, and documenting the result. Exceptions appear here with their nature and impact.

**Section 5 - Other Information.** Optional. Management's response to exceptions, additional context, or supplementary information.

When prospects review your report, they're primarily reading Sections 1 and 4: the auditor's opinion and the test results. Exceptions don't automatically disqualify you; what matters is the nature, severity, and your management's response.

## SOC 1 vs SOC 2 vs SOC 3

SOC 2 is one of three report types. Understanding the differences prevents confusion:

| | SOC 1 | SOC 2 | SOC 3 |
|---|---|---|---|
| **Focus** | Financial reporting controls | Security, availability, processing integrity, confidentiality, privacy | Same as SOC 2 (summary version) |
| **Audience** | User entity auditors and controllers | Customers, prospects, partners (under NDA) | General public |
| **Distribution** | Restricted | Restricted | Freely distributable |
| **Detail** | Full test results | Full test results | Summary only; no test details |
| **Types** | Type I and Type II | Type I and Type II | Type II only |

**SOC 1** evaluates controls relevant to your customers' financial reporting. Payroll processors, claims processors, and payment platforms typically need SOC 1.

**SOC 2** evaluates controls relevant to security and data handling. SaaS companies, cloud providers, and IT service firms typically need SOC 2.

**SOC 3** is a public-facing summary of a SOC 2 Type II report. It contains the auditor's opinion but no detailed test results. Companies use it for marketing (posting the SOC 3 seal on their website) while sharing the full SOC 2 report under NDA with prospects.

Some companies need both SOC 1 and SOC 2 if their service affects both financial reporting and data security.

## Bridge Letters: Covering the Gap

SOC 2 reports cover a specific period (say, January 1 through December 31). If your customer's fiscal year doesn't align with your report period, or if your next report is still being audited, there's a gap.

A **bridge letter** (also called a gap letter) is a management self-assertion that covers this interim period. It states that the system description remains accurate and that no material changes have occurred to the control environment since the report end date.

Bridge letters are not audited by the CPA firm. They're signed by your management and should cover no more than three months. They don't replace a SOC 2 report; they provide interim assurance until the next report is ready.

## Common Mistakes

After working through SOC 2 engagements, the same mistakes come up repeatedly:

**Skipping the readiness assessment.** Going straight to audit without one risks discovering major gaps mid-engagement. The readiness assessment costs a fraction of what a delayed or exception-heavy report costs.

**Under-scoping.** Excluding systems or processes that handle customer data to reduce audit scope. Auditors will notice, and prospects will question why key systems were carved out.

**Treating it as an annual sprint.** Companies that scramble before the audit rather than operating controls continuously end up with evidence gaps and exceptions. SOC 2 Type II specifically evaluates sustained operation; you can't cram for it.

**Ignoring subservice organizations.** If you use AWS, GCP, Stripe, or any third-party service that handles data on your behalf, the auditor will check whether you've obtained and reviewed their SOC 2 reports. This is a control that many first-time companies miss.

**No single owner.** Without one person coordinating information flow across engineering, HR, legal, and operations, the process fragments. The auditor ends up chasing documentation team by team, extending the timeline and cost.

**Confusing SOC 2 with full regulatory compliance.** A SOC 2 report demonstrates that your security controls meet AICPA criteria. It does not prove compliance with the GDPR, HIPAA, CCPA, or any other regulation. Those require separate analysis. If you're also selling internationally, you'll likely need to evaluate [whether ISO 27001 makes more sense for your market](/blog/soc-2-vs-iso-27001/), or whether you need both.

## Frequently Asked Questions

**How much does SOC 2 cost?**
All-in costs typically range from $20,000-$60,000 for Type I and $30,000-$150,000 for Type II, including readiness assessment, gap remediation, compliance tooling, and audit fees. The wide range reflects differences in company size, scope, and existing security maturity. Compliance automation platforms ($10,000-$30,000/year) significantly reduce the manual effort. For a detailed cost and timeline comparison with ISO 27001, see [SOC 2 vs ISO 27001: Which Certification Do You Actually Need?](/blog/soc-2-vs-iso-27001/)

**How long does it take?**
Type I: 2-5 months from start to report. Type II: 6-12 months, primarily constrained by the minimum six-month observation period. Many companies get a Type I first to address immediate sales needs, then begin the Type II observation period.

**Can I use a SOC 2 report from my cloud provider instead?**
No. Cloud providers like AWS, Azure, and GCP have their own SOC 2 reports covering their infrastructure controls. Your SOC 2 report covers your controls: how you configure, access, and operate within that infrastructure. This is the shared responsibility model: the provider secures the infrastructure, you secure your application and data handling.

**What happens if we have exceptions in the report?**
Exceptions appear in Section 4 of the report. They don't automatically mean failure; SOC 2 has no pass/fail. What matters is the nature and severity of the exceptions and how management responds. Minor exceptions (e.g., one missed quarterly access review) are common and usually acceptable to prospects. Systemic exceptions (e.g., no access reviews conducted at all) are deal-breakers.

**Do we need to share the full report with prospects?**
SOC 2 reports are typically shared under NDA. Most companies share Section 1 (auditor's opinion) and Section 4 (test results) with prospects during vendor due diligence. If you want to publicly demonstrate your security posture, get a SOC 3 report, which is a summary designed for public distribution.

**Is SOC 2 a one-time thing?**
No. SOC 2 Type II reports are renewed annually. Each year, you undergo a new audit covering the latest observation period. The expectation from buyers is a current report; a report more than 12 months old raises questions.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does SOC 2 cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All-in costs typically range from $20,000-$60,000 for Type I and $30,000-$150,000 for Type II, including readiness assessment, gap remediation, compliance tooling, and audit fees. Compliance automation platforms ($10,000-$30,000/year) significantly reduce the manual effort."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SOC 2 take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Type I: 2-5 months from start to report. Type II: 6-12 months, primarily constrained by the minimum six-month observation period. Many companies get a Type I first to address immediate sales needs, then begin the Type II observation period."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use a SOC 2 report from my cloud provider instead?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Cloud providers like AWS, Azure, and GCP have their own SOC 2 reports covering their infrastructure controls. Your SOC 2 report covers your controls: how you configure, access, and operate within that infrastructure. This is the shared responsibility model."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if we have exceptions in the SOC 2 report?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exceptions appear in Section 4 of the report. They don't automatically mean failure; SOC 2 has no pass/fail. What matters is the nature and severity of the exceptions and how management responds. Minor exceptions are common and usually acceptable to prospects. Systemic exceptions are deal-breakers."
      }
    },
    {
      "@type": "Question",
      "name": "Do we need to share the full SOC 2 report with prospects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SOC 2 reports are typically shared under NDA. Most companies share Section 1 (auditor's opinion) and Section 4 (test results) with prospects during vendor due diligence. For public distribution, get a SOC 3 report, which is a summary designed for that purpose."
      }
    },
    {
      "@type": "Question",
      "name": "Is SOC 2 a one-time thing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SOC 2 Type II reports are renewed annually. Each year, you undergo a new audit covering the latest observation period. Prospects expect a current report; a report more than 12 months old raises questions."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [How to Prepare for a SOC 2 Audit: A Practical Checklist](/blog/how-to-prepare-soc-2-audit/)
- [SOC 2 vs ISO 27001: Which Certification Do You Actually Need?](/blog/soc-2-vs-iso-27001/)
- [SOC 2 for Startups: When You Need It and How to Get There](/blog/soc-2-for-startups/)

*Need help navigating SOC 2 for the first time? [Let's talk](https://calendly.com/juanidrovo).*
