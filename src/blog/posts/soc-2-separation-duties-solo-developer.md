---
title: "How to Handle SOC 2 Separation of Duties When You're a Team of One"
description: "Segregation of duties is the control that sounds impossible for solo developers. It isn't. Here's what the standards actually require, what compensating controls auditors accept, and how to document it."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - compliance
  - security
  - soc-2
  - startups
---

Segregation of duties is the first objection every solo developer hears when they start a SOC 2 conversation: "You can't be the person who writes the code, reviews the code, approves the deployment, and monitors production. That's a fundamental control failure."

On the surface, this sounds like a dealbreaker. If you're one person, you do all of those things. Every day. There's nobody else to separate duties with.

But the objection is based on a misunderstanding of what SOC 2 actually requires. The standard doesn't mandate that different humans perform different roles. It mandates that the risk -- unauthorized or unreviewed changes reaching production undetected -- is addressed through appropriate controls. For a 500-person company, traditional role separation is the obvious answer. For a solo developer, compensating controls are the answer. And both SOC 2 and ISO 27001 explicitly accommodate this.

## What the Standards Actually Say

### SOC 2's position

SOC 2 evaluates controls under the Trust Services Criteria. The relevant criteria here are:

- **CC5.1**: The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels
- **CC6.1**: Logical and physical access controls
- **CC8.1**: Change management controls

None of these criteria specify that different people must perform different steps. They require that controls exist to mitigate risk. The AICPA's guidance explicitly acknowledges that the nature and extent of controls should be appropriate to the size and complexity of the organization.

When a SOC 2 auditor evaluates a solo developer's environment, they're not checking whether you have separate people for development, review, and deployment. They're checking whether the risk of unauthorized changes is adequately mitigated -- through whatever mechanisms are available.

### ISO 27001's position

ISO 27001 is more explicit. Annex A Control 5.3 addresses segregation of duties directly:

> "Conflicting duties and areas of responsibility shall be segregated."

But the implementation guidance adds a critical qualifier:

> "For small organizations with a limited number of employees where such controls are not possible, activity monitoring, audit trails, and management supervision can be used."

This isn't a loophole. It's a designed accommodation. The standard's authors understood that small organizations exist and that rigid role separation is infeasible with limited headcount. The alternative -- monitoring, audit trails, supervision -- is a legitimate path to compliance.

## The Risk You're Actually Mitigating

Before diving into compensating controls, it's worth understanding what segregation of duties is designed to prevent:

1. **Unauthorized changes.** Someone deploys malicious or unapproved code to production without oversight
2. **Undetected errors.** A bug or misconfiguration reaches production because nobody reviewed it
3. **Fraud.** A single individual manipulates systems for personal gain without anyone noticing
4. **Scope creep.** Changes accumulate without documentation or approval, creating an unauditable state

In a traditional organization, having different people write, review, approve, and deploy code prevents all four. In a solo environment, you need different mechanisms that achieve the same outcome. The goal isn't role separation for its own sake -- it's preventing these four failure modes.

## Compensating Controls That Auditors Accept

I've seen all of the following accepted by SOC 2 auditors for solo and micro-team organizations. The key is implementing them consistently and documenting everything.

### 1. AI code review

This is the most relevant development in solo compliance. AI code review tools -- GitHub Copilot's review features, automated code analysis in CI/CD, and dedicated AI review platforms -- provide an independent review of every code change before it reaches production.

**How to implement:**
- Configure your CI/CD pipeline to run AI code review on every pull request
- Require the AI review to pass before merging is allowed
- Store the review output as evidence (most tools log this automatically)

**Why auditors accept it:** The purpose of code review is to catch defects, security issues, and unauthorized changes before they reach production. An AI reviewer accomplishes this. The review is documented, timestamped, and tied to a specific code change. This is a stronger audit trail than many companies have with human reviewers who approve PRs with a quick "LGTM."

**What to document:** Your change management policy should state that all code changes undergo automated AI review prior to merge. Reference the specific tools and their configuration. Keep evidence of reviews -- screenshots or logs -- for the observation period.

### 2. Protected branches and mandatory PR workflows

Even as a solo developer, configure your repository to require pull requests for all changes to the main branch.

**How to implement:**
- Enable branch protection on your main/production branch
- Require at least one approval before merge (this can be the AI review, or your own approval after reviewing the diff)
- Require status checks to pass (automated tests, linting, security scanning)
- Disable force pushes to protected branches

**Why it works:** This creates a mandatory checkpoint between writing code and deploying it. Every change has a PR, a diff, a review, and test results -- all documented in the version control system. The auditor can pull any PR from the observation period and see the full history.

**What this prevents:** Direct pushes to production. Even if you're the only person, the workflow enforces a pause-and-review step that catches mistakes and creates accountability.

### 3. Automated CI/CD pipelines with approval gates

Your deployment pipeline should not allow code to reach production without passing through explicit gates.

**A strong solo developer pipeline:**
1. Code pushed to feature branch
2. PR created, triggering:
   - Automated unit and integration tests
   - AI code review
   - Security scanning (SAST/DAST)
   - Linting and style checks
3. All checks pass → PR eligible for merge
4. Developer reviews the diff and merges
5. Merge triggers deployment pipeline
6. Deployment to staging for smoke testing
7. Manual promotion to production (explicit approval step)
8. Deployment notification sent to monitoring channel

**Why auditors accept it:** Each step is logged. The pipeline creates an immutable record of what was deployed, when, by whom, and what checks it passed. This is segregation of process, not segregation of people -- and it achieves the same outcome.

### 4. Infrastructure as Code

When all infrastructure is declared in version-controlled code, every change to your environment has a commit message, a diff, and a timestamp.

**How to implement:**
- Use Terraform, CloudFormation, Pulumi, or CDK for all infrastructure
- Apply changes only through the CI/CD pipeline, never through the cloud console
- Require PR reviews for infrastructure changes (same workflow as application code)
- Enable drift detection to alert you when manual changes occur

**What this prevents:** Undocumented infrastructure changes. One of the most common SOC 2 findings is configuration changes made directly in the AWS/GCP/Azure console without any record. IaC eliminates this entirely. The auditor can see every infrastructure change, what it modified, and when it was applied.

### 5. Enhanced logging and monitoring

Log everything. Monitor everything. Alert on anything unusual.

**What to log:**
- All authentication events (successful and failed)
- All administrative actions in cloud consoles
- All deployment events
- All configuration changes
- All database access and queries against customer data
- All access control modifications

**How to monitor:**
- Centralized logging (CloudWatch, Datadog, or equivalent)
- Automated alerts for high-risk events:
  - Failed authentication attempts exceeding threshold
  - Privilege escalations
  - Production configuration changes outside deployment pipeline
  - Access from unusual locations or IP ranges
  - New user accounts created
- Retention of at least 90 days (12 months preferred)

**Why this matters for SoD:** When you're the only person, monitoring is your safety net. If something goes wrong -- whether through error, compromise, or anything else -- the logs provide detection and accountability. This is the core of what ISO 27001 means by "activity monitoring" as an alternative to role separation.

### 6. External fractional review

Engage an external security professional for periodic independent review. This doesn't need to be a full-time hire or even a regular consultant. Quarterly reviews are sufficient.

**Options:**
- **Virtual CISO services:** $150-$300 per hour, typically 4-8 hours per quarter
- **Fractional security consultant:** Similar pricing, more hands-on
- **Peer review exchange:** Find another solo developer in a similar situation and review each other's security practices

**What they review:**
- Access control configurations
- Deployment pipeline and change management evidence
- Policy compliance
- Log review for anomalies
- Security tool configurations

**Why auditors value it:** This provides genuine third-party oversight. Even though it's not continuous, it demonstrates that someone outside the organization periodically validates your controls. Document every review session: date, reviewer, scope, findings, and any remediation actions taken.

### 7. Documented risk acceptance

Formally acknowledge the limitation and document your response. This isn't a workaround -- it's a risk management practice that auditors expect.

**Create a document that states:**
- Traditional segregation of duties is limited due to organization size (1 person)
- The specific risks this creates (unauthorized changes, undetected errors)
- The compensating controls in place (list all of the above)
- The residual risk assessment (low, given compensating controls)
- Management acceptance of the residual risk (your signature)

This document goes into your risk register and becomes part of your SOC 2 evidence. Auditors appreciate transparency about known limitations far more than attempts to pretend the limitation doesn't exist.

## Building a Compensating Control Matrix

Here's how to map traditional SoD requirements to compensating controls in a format auditors understand:

| Traditional SoD Requirement | Solo Developer Compensating Control | Evidence |
|---|---|---|
| Code written by one person, reviewed by another | AI code review + automated security scanning on all PRs | CI/CD logs, PR review records |
| Deployment approved by someone other than developer | Protected branches + mandatory status checks + manual promotion gate | Git branch protection settings, deployment logs |
| Access changes reviewed by manager | Quarterly self-review with documented results + external fractional review | Access review documents, consultant reports |
| Configuration changes authorized by IT admin | Infrastructure as Code with PR workflow + drift detection | Terraform/IaC commit history, drift alerts |
| Monitoring reviewed by security team | Automated alerting + centralized logging + periodic external review | Alert configuration, log retention evidence, review notes |
| Incident response tested by independent party | Annual tabletop exercise facilitated by external consultant | Exercise documentation, findings report |

Present this matrix to your auditor during the planning phase. Most auditors will review it, suggest adjustments, and confirm that the approach is acceptable before the formal audit begins. This avoids surprises during fieldwork.

## What Auditors Actually Look At

During a SOC 2 audit of a solo developer's environment, auditors focus on:

**Evidence of consistent process.** They'll sample PRs, deployments, and access reviews across the observation period. They want to see that your documented process was followed every time -- not just most of the time. One deployment that bypassed the pipeline becomes an exception.

**Automated controls over manual ones.** Auditors trust automated controls more than manual ones because they're harder to circumvent and easier to verify. A branch protection rule that prevents direct pushes is stronger evidence than a policy that says "don't push directly."

**Documentation.** Every compensating control must be documented in your policies. If your change management policy says "all code changes are reviewed by a peer," but you don't have a peer, you have a policy violation. Rewrite it: "All code changes undergo automated AI review and security scanning, with results documented in the CI/CD pipeline, before being eligible for deployment to production."

**Consistency between policy and practice.** The single most common audit finding is policies that don't match what actually happens. Write policies that describe your actual process. If your process changes, update the policy. Auditors will test both.

## Common Mistakes

**Pretending you have segregation when you don't.** Writing a policy that describes a multi-person review process when you're one person is worse than documenting your compensating controls. Auditors test whether the policy matches reality.

**Not implementing any compensating controls.** "I'm a solo developer, so segregation of duties doesn't apply to me" is not an acceptable position. The risk still exists. You need controls that address it, even if they're different from traditional SoD.

**Relying entirely on manual processes.** Manual quarterly reviews are fine as a supplement, but your primary controls should be automated -- branch protection, CI/CD gates, automated monitoring. Manual controls are inherently less reliable and harder to prove during an audit.

**Skipping the risk acceptance documentation.** Without formal acknowledgment of the SoD limitation and your compensating controls, the auditor may flag it as an unaddressed gap. The documentation takes 30 minutes to write and prevents this.

## The Bigger Point

Segregation of duties is not about having multiple people. It's about having multiple checkpoints. A solo developer with a properly configured pipeline -- protected branches, automated testing, AI code review, deployment approval gates, comprehensive logging, and external periodic review -- has more effective controls than a 20-person team where developers routinely push directly to production because "we trust each other."

The controls exist to prevent failure modes, not to employ additional people. If you can demonstrate that unauthorized or unreviewed changes cannot reach production undetected, you've satisfied the intent of segregation of duties regardless of your headcount.

For the full picture on which [compliance certifications are achievable solo](/blog/compliance-certifications-solo-developers/), including costs and timelines, start there.

---

**Keep reading:**
- [Compliance Certifications for Solo Developers: What's Actually Possible](/blog/compliance-certifications-solo-developers/)
- [How to Prepare for a SOC 2 Audit: A Practical Checklist](/blog/how-to-prepare-soc-2-audit/)
- [SOC 2 Alternatives: What to Do When You Can't Afford Full Certification](/blog/soc-2-alternatives-small-companies/)

*Figuring out how to structure your controls as a solo developer? [Let's talk](https://calendly.com/juanidrovo).*
