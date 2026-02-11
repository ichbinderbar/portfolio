---
title: "How to Prepare for a SOC 2 Audit: A Practical Checklist"
description: "A step-by-step guide to SOC 2 audit preparation - from scoping and readiness assessments to evidence collection and fieldwork. Includes timelines, cost breakdowns, and the controls most companies miss."
date: 2026-02-13
tags:
  - posts
  - compliance
  - security
  - soc-2
---

Preparing for a SOC 2 audit is less about knowing what SOC 2 is and more about knowing what to do next. You've read the overview. You know about the Trust Services Criteria. Your sales team has a deal blocked until you can produce a report. Now what?

This is the practical version: what to do, in what order, how long it takes, and what it costs - with specific attention to the controls that trip up first-time companies.

## The Timeline: What to Expect

Before diving into the checklist, here's the honest timeline. Most first-time SOC 2 engagements take longer than companies expect.

**Type I (design effectiveness at a point in time):**
- Preparation and readiness: 8-12 weeks
- Gap remediation: 4-8 weeks
- Fieldwork: 2-4 weeks
- Report issuance: 2-6 weeks
- **Total: 4-7 months**

**Type II (operating effectiveness over time):**
- Everything above, plus a 6-12 month observation period
- **Total: 9-15 months from start to final report**

The observation period is the bottleneck. Your controls must operate consistently for a minimum of six months before the auditor can evaluate them. You can't compress this. Many companies start with a Type I to unblock immediate deals, then begin the Type II observation period the same day.

## Step 1: Define Your Scope

Scoping determines what systems, processes, people, and Trust Services Criteria are included in the audit. Get this wrong and you either waste money auditing systems that don't matter or leave gaps that auditors and prospects will notice.

### Which Trust Services Criteria to include

**Security is mandatory.** Every SOC 2 audit includes it. The other four - Availability, Processing Integrity, Confidentiality, and Privacy - are optional and selected based on your service commitments and customer expectations.

For most B2B SaaS companies on their first audit, **Security alone is the right starting point.** Add Availability if you have SLA commitments. Add Confidentiality if you handle trade secrets or sensitive business data beyond personal information. Add Privacy only if you handle PII and your customers specifically require it - many companies address privacy through separate compliance frameworks like the GDPR or CCPA instead.

### Which systems to include

**In scope:** Any system that stores, processes, or transmits customer data, or that supports the delivery of your service.
- Production infrastructure (AWS, GCP, Azure accounts)
- Application code and databases
- Authentication and identity management systems (Okta, Google Workspace)
- Monitoring and logging infrastructure
- CI/CD pipelines and deployment tools
- Critical third-party services (Stripe, SendGrid, Twilio)

**Out of scope:** Internal systems that don't touch customer data or service delivery.
- Corporate HR tools (unless they process customer data)
- Internal wikis and project management tools
- Marketing automation
- Office facilities (unless you run your own data center)

**Start narrow on your first audit.** A tighter scope means faster preparation, lower cost, and fewer controls to maintain. You can expand scope in subsequent years as your compliance program matures.

### Which people to include

Anyone with access to in-scope systems is an in-scope person. This typically includes:
- Engineering and DevOps teams
- IT administrators
- Security personnel
- Customer support staff with production data access
- Executives with administrative access

Resist the urge to exclude roles to reduce scope. If someone has SSH access to production, they're in scope regardless of whether they use it.

## Step 2: Run a Readiness Assessment

A readiness assessment is a pre-audit evaluation where an auditor or consultant walks through your current control environment, maps existing controls to the applicable criteria, and identifies gaps. Think of it as a practice run.

**Cost:** $10,000-$25,000 depending on scope and firm.

**Duration:** 4-8 weeks, including stakeholder interviews, documentation review, and deliverable preparation.

**What you get:** A gap analysis report listing every control that's missing, incomplete, or insufficient - along with remediation recommendations and a prioritized timeline.

Skipping the readiness assessment is the most expensive mistake companies make. Discovering a major gap mid-audit - like the absence of a formal change management process or incomplete access reviews - extends the audit timeline and multiplies costs. A readiness assessment costs a fraction of what a delayed or exception-heavy audit costs.

### What the assessor evaluates

- **Policies and procedures:** Do they exist? Are they current? Do they reflect actual practice?
- **Technical controls:** MFA, encryption, logging, vulnerability management, endpoint protection
- **Access management:** User provisioning, deprovisioning, role-based access, periodic access reviews
- **Change management:** How changes move from development to production
- **Incident response:** Documented procedures, escalation paths, and evidence of testing
- **Vendor management:** Inventory of third-party services, risk assessments, SOC 2 report collection
- **HR processes:** Background checks, onboarding procedures, security awareness training

## Step 3: Remediate the Gaps

The readiness assessment tells you what's missing. Now you fix it. Gap remediation is where most of the work - and most of the cost - lives.

Here's what first-time companies typically need to implement or formalize, organized by the areas that generate the most audit findings.

### Access controls (the #1 failure point)

Access control issues are the most common finding in SOC 2 audits with qualified opinions. This is where auditors look hardest.

**What to implement:**

- **Multi-factor authentication** on all in-scope systems. Not optional. Use an authenticator app or hardware key - SMS-based MFA is acceptable but increasingly frowned upon. Cover production infrastructure, identity providers, code repositories, and cloud consoles.

- **Role-based access control (RBAC).** Define roles with minimum necessary permissions. Document who has access to what and why. The principle of least privilege isn't theoretical here - auditors test for it by examining actual permission sets.

- **User provisioning and deprovisioning.** Document your process for granting access when someone joins, changes roles, or leaves. Deprovisioning is the critical one: auditors will check whether former employees still have active accounts. Aim for same-day deprovisioning.

- **Quarterly access reviews.** Every quarter, review who has access to in-scope systems and confirm their access is still appropriate. Document the review, the reviewer, and any changes made. This is one of the most commonly missed controls and one of the easiest to fix.

- **Eliminate shared accounts.** Every person gets their own credentials. No shared service accounts for human users. Shared accounts make it impossible to attribute actions to individuals, which undermines the entire access control framework.

### Encryption

- **At rest:** AES-256 for databases, file storage, and backups. Most cloud providers enable this by default, but verify it's active and document it.
- **In transit:** TLS 1.2 minimum, TLS 1.3 preferred. All data transmitted over networks - internal and external - should be encrypted. Disable older protocols (TLS 1.0, 1.1, SSL).
- **Key management:** Document your key rotation policy. Use your cloud provider's key management service (AWS KMS, GCP Cloud KMS, Azure Key Vault) rather than managing keys yourself.

### Logging and monitoring

- **Centralized logging** across all in-scope systems. Application logs, infrastructure logs, access logs, and authentication logs should flow into a single platform.
- **SIEM or equivalent.** You need the ability to detect anomalies, correlate events, and alert on suspicious activity. Tools range from cloud-native (AWS CloudTrail + CloudWatch, GCP Cloud Logging) to dedicated platforms (Datadog, Splunk, Sumo Logic).
- **Log retention.** Define a retention period - 90 days is the minimum most auditors expect, 12 months is safer. Document the policy and verify logs are actually retained for the stated period.
- **Alerting.** Configure alerts for critical events: failed authentication attempts, privilege escalations, configuration changes to production infrastructure, and unauthorized access attempts.

### Change management

Auditors evaluate change management under CC8, which requires that changes to infrastructure, data, software, and procedures are authorized, designed, tested, approved, and documented.

**What this looks like in practice:**

- All production changes tracked in an issue tracker (Jira, Linear, GitHub Issues)
- Code reviewed by at least one other engineer before merge
- CI/CD pipeline with automated testing (unit, integration)
- Deployment approval process - who can deploy to production, and is there a record of approval?
- Rollback procedures documented and tested
- Separation of duties between development and production deployment (the person who wrote the code shouldn't be the only one who can deploy it)

### Policies and documentation

SOC 2 requires formal policies for:
- Information security
- Acceptable use
- Access control
- Change management
- Incident response
- Business continuity and disaster recovery
- Data classification and retention
- Vendor management
- Risk management

These policies must be reviewed and approved by management, communicated to employees, and actually followed. The most common readiness finding is policies that don't match practice - either because they were copied from a template and never customized, or because practices changed without updating documentation.

**Pro tip:** Write policies that describe what you actually do, not what you aspire to do. An auditor would rather see a simple, accurate policy than an ambitious one you don't follow. You can mature your controls over time and update policies accordingly.

### Vendor management

If you use third-party services that process customer data on your behalf - and every SaaS company does - you need a vendor management program.

- **Vendor inventory.** List every subservice organization: cloud providers, payment processors, email services, analytics platforms, monitoring tools.
- **Risk assessment.** Evaluate each vendor's security posture. For critical vendors, obtain and review their SOC 2 report. For lower-risk vendors, a security questionnaire or assessment may suffice.
- **Annual review.** Download and review vendor SOC 2 reports at least annually. Document the review: who reviewed it, when, what exceptions were noted, and whether any action was required.
- **Contracts.** Ensure agreements with vendors include security and confidentiality obligations. This is often a checkbox exercise but one that auditors verify.

AWS, GCP, and Azure SOC 2 reports are available through their respective portals (AWS Artifact, GCP Compliance Reports Manager, Microsoft Service Trust Portal). Download them. Read them. Note any exceptions. File them as evidence.

### HR and personnel controls

- **Background checks** within 30 days of hire for all employees with access to in-scope systems. For international employees where traditional background checks aren't available, document alternative verification (reference checks, credential verification).
- **Security awareness training** for all employees, completed within 30 days of hire and refreshed annually. Track completion dates - auditors sample employee records and verify training was completed on time.
- **Documented onboarding and offboarding procedures.** What access is granted during onboarding? What's revoked during offboarding? Is there a checklist? Is it followed?

### Incident response

- **Documented incident response plan** covering identification, classification, containment, eradication, recovery, and post-incident review.
- **Communication and escalation procedures.** Who gets notified? When? Through what channel?
- **Annual tabletop exercise.** Run a simulated incident scenario with stakeholders from engineering, security, legal, and communications. Document the exercise, participants, findings, and improvements identified. This is a requirement, not a nice-to-have.

### Vulnerability management

While SOC 2 doesn't mandate specific scanning or testing frequencies, auditors evaluate your vulnerability management program under CC7.1 (detection and monitoring procedures).

- **Vulnerability scanning:** Monthly minimum. Weekly or continuous is better. Use tools like Qualys, Nessus, or cloud-native scanners.
- **Penetration testing:** Annually at minimum. Semi-annually is becoming the expectation for companies handling sensitive data. Engage an external firm - internal-only testing doesn't carry the same weight with auditors.
- **Remediation tracking.** Scan results mean nothing without a process for triaging, prioritizing, and remediating findings. Document your remediation SLAs (critical: 24 hours, high: 7 days, medium: 30 days, etc.) and track against them.

## Step 4: Choose Your Compliance Tooling

Compliance automation platforms reduce the manual burden of evidence collection, monitoring, and audit preparation. They don't replace the auditor or eliminate all manual work, but they compress the timeline significantly.

### What automation platforms actually do

**They automate:**
- Evidence collection (screenshots, configuration snapshots, log extraction) from integrated systems
- Continuous monitoring of cloud configurations, access controls, and policy compliance
- Automated tests that run hourly or daily against your connected systems
- Dashboard showing real-time compliance status across all criteria

**They don't automate:**
- Writing and customizing policies to match your actual practices
- Running tabletop exercises (incident response, BCDR)
- Vendor risk assessments and SOC 2 report reviews
- Physical security controls
- Background check processes (they track completion, not execution)
- Writing the system description for your SOC 2 report

### Platform options

The three dominant platforms are Vanta, Drata, and Secureframe. All three integrate with major cloud providers, identity platforms, code repositories, and HR systems.

- **Vanta:** Fast setup, clean interface. Popular with early-stage startups pursuing SOC 2 for the first time.
- **Drata:** Deep integrations, automation-first approach. Favored by technical teams and growth-stage companies.
- **Secureframe:** Hands-on support model with dedicated onboarding teams. Good fit for less technical organizations.

**Annual cost:** $10,000-$50,000 depending on company size, number of integrations, and contract terms.

All three offer audit-readiness assessments and can connect you with CPA firms in their partner network, which sometimes includes discounted audit fees.

## Step 5: The Observation Period (Type II)

For Type II audits, your controls must operate effectively for a defined observation period - typically six to twelve months. During this window, every control you've implemented needs to generate evidence continuously.

### What "operating effectively" means

It's not enough to have controls in place. They must be executed consistently throughout the observation period.

- Access reviews must happen every quarter, on schedule, with documented results.
- Background checks must be completed for every new hire within the defined window.
- Change management procedures must be followed for every production deployment - no exceptions.
- Vulnerability scans must run at the frequency stated in your policy.
- Training must be completed on time by every employee.

One missed quarterly access review doesn't necessarily sink your audit. But a pattern of missed controls - or a complete absence of evidence for any period during the observation window - results in exceptions that weaken your report and raise questions with prospects.

### Evidence collection strategy

**Collect evidence continuously, not retroactively.** The biggest operational pain in SOC 2 is scrambling to assemble evidence after the fact. If your compliance platform doesn't capture it automatically, create a recurring process:

- Screenshots must include timestamps. An undated screenshot proves nothing.
- Meeting notes from access reviews, tabletop exercises, and policy reviews should be saved immediately.
- Training completion records should export automatically from your training platform.
- Vulnerability scan results should be archived after each scan cycle.

Auditors test controls by sampling. For quarterly controls, they'll likely review all four quarters. For monthly controls, they'll sample a subset. For daily or continuous controls, they'll pull representative samples across the observation period. If evidence is missing for any sampled period, it's an exception.

## Step 6: Select Your Auditor

Choosing a CPA firm matters more than most companies realize. The firm's reputation, thoroughness, and industry experience affect how prospects perceive your report.

### Firm tiers and pricing

- **Boutique CPA firms** specializing in SOC 2: $20,000-$40,000 for Type II. Faster turnaround, more personalized attention. May not carry name recognition with large enterprise prospects.
- **Mid-tier regional firms:** $30,000-$60,000 for Type II. Good balance of credibility and cost.
- **Big Four (Deloitte, PwC, EY, KPMG):** $60,000-$150,000+ for Type II. Maximum credibility for large enterprise sales but significantly higher cost and longer timelines.

For most companies under 500 employees, a reputable mid-tier firm provides the best value. Your prospects are reading the report content, not the firm's logo. The exception is if your largest customers specifically require a Big Four auditor - some financial institutions and government contracts have this requirement.

### What to ask before engaging

- How many SOC 2 Type II audits did you complete last year?
- What's your typical timeline from engagement to report delivery?
- Can you perform the readiness assessment and the audit, or do I need separate firms? (Many firms offer both, but the same engagement team should not perform the readiness assessment and the formal audit to maintain independence.)
- Do you have experience with our tech stack and industry?
- What does your sampling methodology look like?
- What's your process when you identify an exception during fieldwork?

## Step 7: The Audit Itself

Fieldwork typically takes 4-8 weeks for a Type II audit. Here's what happens.

### What auditors do during fieldwork

- **Interview key personnel.** Engineering leads, IT administrators, HR representatives, and security staff. They're verifying that people understand and follow documented procedures.
- **Inspect configurations.** Direct examination of cloud configurations, access controls, encryption settings, and monitoring infrastructure.
- **Sample and test evidence.** Pull samples of access reviews, change management tickets, training records, vulnerability scan results, and incident response documentation. Compare actual evidence against documented policies.
- **Review vendor management.** Verify you've obtained and reviewed subservice organization SOC 2 reports. Check for documented risk assessments.
- **Evaluate system description.** Your management writes the system description (Section 3 of the report). The auditor verifies it's accurate and complete.

### Common fieldwork surprises

- **Orphaned accounts.** Former employees or contractors who still have active access. Run a comprehensive access audit before fieldwork begins.
- **Undocumented changes.** Production deployments that bypassed the change management process. Even one undocumented change becomes an exception.
- **Missing training records.** An employee hired eight months ago who never completed security awareness training. Auditors sample employee records - if they pull that person, it's a finding.
- **Stale vendor reviews.** A vendor SOC 2 report from two years ago. Reviews should be current - within the last 12 months.

## The Preparation Checklist

Here's the consolidated checklist. Each item maps to the section above where it's discussed in detail.

### Scoping
- [ ] Select Trust Services Criteria (Security + applicable optional criteria)
- [ ] Inventory all in-scope systems and third-party services
- [ ] Identify all in-scope personnel by role
- [ ] Document scope boundaries and exclusion rationale

### Readiness
- [ ] Complete readiness assessment with qualified assessor
- [ ] Receive and review gap analysis report
- [ ] Create prioritized remediation plan with timeline

### Access Controls
- [ ] MFA enabled on all in-scope systems
- [ ] RBAC implemented with documented role definitions
- [ ] User provisioning and deprovisioning procedures documented and operational
- [ ] Quarterly access review process established (first review completed)
- [ ] Shared accounts eliminated

### Encryption and Data Protection
- [ ] Encryption at rest (AES-256) verified for all data stores
- [ ] Encryption in transit (TLS 1.2+) verified for all transmissions
- [ ] Key management policy documented
- [ ] Data classification policy in place
- [ ] Data retention policy defined and implemented

### Logging and Monitoring
- [ ] Centralized logging operational across all in-scope systems
- [ ] SIEM or equivalent alerting configured
- [ ] Log retention policy defined and verified (minimum 90 days, 12 months preferred)
- [ ] Critical event alerts tested and functional

### Change Management
- [ ] All production changes tracked in issue tracker
- [ ] Code review required before merge to main branch
- [ ] CI/CD pipeline with automated testing
- [ ] Deployment approval process documented
- [ ] Rollback procedures documented and tested

### Policies
- [ ] Information security policy
- [ ] Acceptable use policy
- [ ] Access control policy
- [ ] Change management policy
- [ ] Incident response policy/plan
- [ ] Business continuity and disaster recovery plan
- [ ] Data classification and retention policy
- [ ] Vendor management policy
- [ ] Risk management policy
- [ ] All policies reviewed, approved, and communicated to employees

### Vendor Management
- [ ] Complete vendor inventory
- [ ] Risk assessment for each critical vendor
- [ ] SOC 2 reports obtained for critical subservice organizations
- [ ] Annual review process established
- [ ] Contracts include security and confidentiality clauses

### HR and Personnel
- [ ] Background checks completed for all in-scope personnel
- [ ] Security awareness training completed by all employees
- [ ] Onboarding checklist documented and followed
- [ ] Offboarding checklist documented and followed
- [ ] Training completion tracked and auditable

### Incident Response
- [ ] Incident response plan documented and approved
- [ ] Escalation and communication procedures defined
- [ ] Annual tabletop exercise completed and documented
- [ ] Post-incident review process established

### Vulnerability Management
- [ ] Vulnerability scanning running at documented frequency (monthly minimum)
- [ ] Penetration test completed (external firm, annual minimum)
- [ ] Remediation SLAs defined and tracked
- [ ] Scan results archived

### Evidence and Documentation
- [ ] Evidence collection process operational (automated or scheduled)
- [ ] Screenshots include timestamps
- [ ] Meeting notes saved for all compliance-relevant activities
- [ ] Evidence organized by control and criterion

### Audit Preparation
- [ ] CPA firm selected and engaged
- [ ] System description drafted
- [ ] Observation period started (Type II)
- [ ] Pre-fieldwork access audit completed (verify no orphaned accounts)

## What It Costs: A Realistic Budget

Total cost varies by company size, scope, and existing security maturity. Here's a realistic breakdown for a SaaS company of 50-200 employees pursuing SOC 2 Type II for the first time.

| Cost Component | Range |
|---|---|
| Readiness assessment | $10,000-$25,000 |
| Gap remediation (policies, tooling, configurations) | $10,000-$30,000 |
| Compliance automation platform (annual) | $10,000-$50,000 |
| Auditor fees (Type II, mid-tier firm) | $30,000-$60,000 |
| Security awareness training | $2,000-$15,000 |
| Penetration testing (external firm) | $10,000-$30,000 |
| Legal review of policies and contracts | $5,000-$10,000 |
| **Total first year** | **$77,000-$220,000** |
| **Annual renewal (subsequent years)** | **$50,000-$120,000** |

The wide range reflects real variation. A company with mature engineering practices - version control, code review, CI/CD, centralized logging already in place - will spend far less on remediation than one building those processes from scratch. The compliance platform and auditor fees are the fixed-cost floor.

If you're evaluating whether to pursue SOC 2 or [ISO 27001](/blog/soc-2-vs-iso-27001/) (or both), the cost comparison matters - ISO 27001 certification has a different cost structure and three-year cycle that can be more economical for internationally-focused companies.

## Frequently Asked Questions

**Can we do SOC 2 without a compliance automation platform?**
Yes, but it's significantly more painful. Before these platforms existed, companies managed evidence collection in spreadsheets and shared drives. It works, but it requires dedicated headcount for evidence gathering, monitoring, and audit coordination. For companies with fewer than 50 employees, the time cost of manual compliance often exceeds the platform subscription cost within the first year.

**Should we start with Type I or go straight to Type II?**
If you have a deal blocked by a SOC 2 requirement, get a Type I first - it takes 4-7 months versus 9-15 months for Type II. Start the Type II observation period immediately after the Type I engagement. If there's no immediate sales pressure, going straight to Type II is more cost-efficient since you avoid paying for two separate audits.

**How do we handle subservice organizations like AWS?**
Almost all SOC 2 audits use the carve-out method: your report acknowledges that certain controls (physical security, infrastructure) are the responsibility of the subservice organization and excluded from your audit scope. You document which subservice organizations you rely on, obtain and review their SOC 2 reports annually, and implement complementary controls on your side (access management, configuration, encryption). The inclusive method - where your auditor examines the subservice organization's controls directly - is rarely practical with large cloud providers.

**What happens if we have exceptions in the report?**
Exceptions appear in Section 4 of the SOC 2 report. They don't automatically disqualify you - [SOC 2 has no pass/fail](/blog/what-is-soc-2-compliance/). Minor exceptions (one missed quarterly access review, a single late training completion) are common and typically acceptable to prospects. Systemic exceptions (no access reviews conducted, no change management process) signal fundamental control weaknesses and will cost you deals. What matters most is the nature, severity, and your management's documented response.

**Do we need separate readiness and audit firms?**
The same CPA firm can perform both your readiness assessment and your formal audit, but the same engagement team typically cannot do both - this would compromise auditor independence. Many firms handle this by having separate teams for advisory (readiness) and attest (audit) engagements. Alternatively, you can hire a consulting firm for readiness and a CPA firm for the audit.

**How often do we need to renew?**
SOC 2 Type II reports are renewed annually. Each year, you undergo a new audit covering the latest observation period. Prospects expect a current report - anything more than 12 months old raises questions. Between reports, you can issue bridge letters (management self-assertions covering the gap), but these are temporary and should cover no more than three months.

---

**Keep reading:**
- [SOC 2 Compliance Explained: What It Is, Who Needs It, and How to Get Certified](/blog/what-is-soc-2-compliance/)
- [SOC 2 vs ISO 27001: Which Certification Do You Actually Need?](/blog/soc-2-vs-iso-27001/)
- [How to Prepare for a Compliance Audit in Ecuador](/blog/ecuador-compliance-audit-guide/)

*Getting ready for your first SOC 2 audit? [Let's talk](https://calendly.com/juanidrovo).*
