---
title: "Post-Quantum Cryptography: The 'Harvest Now, Decrypt Later' Threat Is Already Here"
description: "Adversaries are stealing encrypted data today to decrypt when quantum computers arrive. Here's what PQC means for your encryption strategy and compliance posture."
date: 2026-02-27
lastModified: 2026-02-27
tags:
  - posts
  - security
  - compliance
  - data-protection
---

Someone is probably recording your encrypted traffic right now. Not to read it today, but to store it until quantum computers can break the encryption protecting it. This isn't a theoretical risk from some distant future. It's an active intelligence-gathering strategy called "Harvest Now, Decrypt Later," and it turns the timeline for post-quantum cryptography from "eventually" into "yesterday."

A [recent analysis by Mohammed Meziani at Orange Cyberdefense](https://thehackernews.com/2026/02/expert-recommends-prepare-for-pqc-right.html) lays out the case plainly: a cryptographically relevant quantum computer (CRQC) could break RSA and ECC encryption within minutes, potentially by 2030-2035. That sounds like a decade away. But if the data you're encrypting today needs to stay confidential for ten years (healthcare records, financial data, trade secrets, legal communications), the window for action has already closed.

I've been watching this unfold from the compliance side, where SOC 2 and ISO 27001 auditors are starting to ask pointed questions about encryption strategies. The question isn't "are you quantum-safe?" yet. It's "what's your plan?" And if you don't have one, that's a finding.

## Why This Is a Present-Day Risk

The mental model most teams carry is: quantum computers don't exist yet, so quantum threats don't exist yet. That framing misses the entire point of Harvest Now, Decrypt Later (HNDL).

Here's how it works:

1. A state actor or well-resourced adversary intercepts and stores encrypted data in transit (TLS sessions, VPN tunnels, encrypted emails)
2. They archive it, cheaply, on commodity storage
3. When a sufficiently powerful quantum computer becomes available, they decrypt everything at once

The cost of step 2 is effectively zero. Storage is cheap and getting cheaper. The intercepted data doesn't expire. And the adversary doesn't need to break your encryption today; they just need to be patient.

This matters most for data with a long confidentiality lifespan:

| Data Type | Typical Confidentiality Requirement | HNDL Risk Level |
|---|---|---|
| Trade secrets and IP | 10-20+ years | Critical |
| Healthcare records (HIPAA) | Lifetime of patient | Critical |
| Financial records | 7-10 years | High |
| Legal communications | Duration of matter + retention | High |
| Government/classified data | 25-75+ years | Critical |
| Customer PII | Duration of relationship + regulatory retention | Medium-High |
| Session tokens and short-lived secrets | Hours to days | Low |

If your data's required confidentiality period extends past 2035, the HNDL threat applies to you today. Meziani's analysis references Mosca's theorem for calculating urgency: if the time to migrate (T) plus the time your data needs to remain secure (S) is greater than the time until a CRQC is available (Q), you're already late. For most organizations handling sensitive data, T + S > Q right now.

## What NIST Has Already Done

NIST didn't wait for quantum computers to arrive. They've been running a post-quantum cryptography standardization process since 2016, and in August 2024, they finalized the first three PQC standards:

- **ML-KEM (FIPS 203)** - A key encapsulation mechanism based on Module-Lattice cryptography, replacing RSA and ECDH for key exchange
- **ML-DSA (FIPS 204)** - A digital signature algorithm, replacing RSA and ECDSA for authentication
- **SLH-DSA (FIPS 205)** - A stateless hash-based signature scheme as a backup approach

These aren't experimental. They're finalized federal standards. TLS libraries are already integrating them. Chrome and Firefox have shipped experimental support for hybrid key exchange using ML-KEM. AWS, Google Cloud, and Cloudflare have begun offering PQC-enabled TLS endpoints.

The "we'll deal with it when the standards are ready" excuse expired in 2024.

## The Compliance Angle: SOC 2 and ISO 27001

This is where the HNDL threat intersects with frameworks your auditors already care about.

### SOC 2 CC6.1: Logical Access and Encryption

SOC 2's Common Criteria 6.1 covers logical access controls, including encryption of data in transit and at rest. The Trust Services Criteria don't specify which algorithms you must use, but they do require that your encryption controls are "appropriate" for the risk.

Here's the question an auditor could ask today: "Given the known HNDL threat to RSA and ECC-based encryption, how has your organization assessed the appropriateness of its current encryption controls for data with long-term confidentiality requirements?"

If your answer is "we haven't thought about it," that's a gap. Not necessarily a qualified opinion today, but a documented observation that will escalate as PQC adoption becomes the industry baseline.

If you're [preparing for your first SOC 2 audit](/blog/soc-2-for-startups/), encryption strategy is already part of the conversation. Adding a PQC migration timeline to your security roadmap costs nothing and demonstrates forward-looking risk management, exactly the kind of thing auditors like to see.

### ISO 27001 A.8.24: Use of Cryptography

ISO 27001 Annex A control A.8.24 requires organizations to define and implement rules for the effective use of cryptography, including key management. The 2022 revision explicitly requires organizations to consider cryptographic algorithm lifecycle, including the risk of algorithms becoming insufficient due to advances in computing.

That language is broad enough to encompass quantum computing threats today. An ISO 27001 auditor reviewing your Statement of Applicability could reasonably ask whether your cryptography policy addresses algorithm obsolescence risk and what your migration plan looks like.

### What Auditors Want to See

You don't need to be quantum-safe today. You need to demonstrate awareness and planning:

1. **Cryptographic inventory** - A documented list of where you use cryptography, which algorithms, and for what purpose
2. **Risk assessment** - An analysis of which data has long-term confidentiality requirements and is therefore exposed to HNDL
3. **Migration roadmap** - A timeline for evaluating and adopting PQC algorithms, even if execution is years away
4. **Vendor engagement** - Evidence that you've asked your infrastructure providers (cloud, CDN, certificate authorities) about their PQC timelines

This is the compliance equivalent of buying insurance. The premium is small (documentation and planning), and the payoff is avoiding a scramble when PQC becomes a hard requirement.

## A Practical Five-Step PQC Migration Framework

Meziani's analysis outlines a structured migration approach that maps well to how engineering organizations actually work. I've adapted it below with specific actions for each phase.

### Step 1: Preparation (Weeks 1-4)

**Goal:** Align leadership and establish ownership.

- Appoint a PQC migration lead (this can be your CISO, Head of Engineering, or whoever owns your encryption strategy)
- Brief leadership on the HNDL threat and compliance implications
- Start conversations with your primary vendors (cloud providers, certificate authorities, security tooling) about their PQC roadmaps
- Allocate budget for assessment (this phase is mostly staff time, not tooling)

### Step 2: Diagnosis (Weeks 4-12)

**Goal:** Understand your cryptographic exposure.

- Build a cryptographic inventory: every system, protocol, library, and key that uses RSA, ECC, DSA, or DH
- Categorize data by confidentiality lifespan (use the table above as a starting point)
- Identify your highest-risk systems: those protecting long-lived data with pre-quantum algorithms
- Map your dependency chain: which third-party libraries, APIs, and services make cryptographic choices on your behalf

This is where most organizations discover they have far more cryptographic dependencies than they realized. Your [secrets management infrastructure](/blog/secrets-management-developers/) is one piece of the puzzle, but encryption is everywhere: TLS termination, database encryption, API authentication, code signing, document encryption, backup encryption.

### Step 3: Planning (Weeks 8-16)

**Goal:** Create a migration strategy with timelines.

- Prioritize systems by risk (long-lived data + high exposure = migrate first)
- Evaluate hybrid approaches: running classical and PQC algorithms simultaneously during the transition
- Estimate costs for library upgrades, key size changes (PQC keys are larger), and infrastructure modifications
- Define success criteria for each phase of migration
- Build a technical timeline that accounts for testing, rollback capability, and vendor dependencies

### Step 4: Execution (Ongoing)

**Goal:** Implement PQC, starting with the highest-risk systems.

- Begin with hybrid cryptography: combine classical algorithms with PQC algorithms so that security isn't degraded even if one approach has undiscovered vulnerabilities
- Start with non-critical systems to build operational experience before touching production infrastructure
- Update TLS configurations to support PQC key exchange where your infrastructure providers offer it
- Implement cryptographic agility: design your systems so you can swap algorithms through configuration changes, not code rewrites

Cryptographic agility is the most important engineering principle here. If your encryption choices are hardcoded throughout your codebase, every algorithm migration is a major engineering project. If they're abstracted behind a configuration layer, migration becomes a deployment exercise.

### Step 5: Continuous Monitoring (Permanent)

**Goal:** Stay current as the landscape evolves.

- Review your cryptographic inventory quarterly
- Track NIST, ETSI, and BSI guidance for updates to PQC recommendations
- Monitor your vendor ecosystem for PQC support announcements
- Conduct periodic security assessments that include PQC readiness
- Update your risk assessment as quantum computing timelines become clearer

## What to Do Right Now

If you're a CTO or engineering lead at a startup or mid-size company, here's the minimum viable response:

**This week:**
- Read the [NIST PQC standards](https://csrc.nist.gov/projects/post-quantum-cryptography) summary
- Check whether your TLS provider supports hybrid PQC key exchange (Cloudflare, AWS, and Google Cloud already do)
- Add "PQC migration assessment" to your next quarterly security review agenda

**This month:**
- Start your cryptographic inventory (even a spreadsheet listing "system / algorithm / data sensitivity" is better than nothing)
- Review your encryption policies for SOC 2 or ISO 27001 and add a section addressing algorithm obsolescence risk
- Ask your certificate authority about their PQC roadmap

**This quarter:**
- Complete the cryptographic inventory and risk assessment
- Evaluate hybrid PQC options for your highest-risk data flows
- If you're building [audit-ready AI architecture](/blog/audit-ready-llm-architecture/), factor PQC into your encryption strategy for model data, training data, and inference logs, especially if you handle data subject to long retention requirements

**This year:**
- Enable hybrid PQC key exchange on external-facing TLS endpoints where supported
- Implement cryptographic agility in new systems (abstract algorithm choices behind configuration)
- Document your PQC roadmap and include it in your next compliance audit evidence package

## The Three Challenges You'll Hit

Meziani's research identifies three categories of migration challenges that match what I've seen in practice:

**Organizational challenges:** Lack of urgency is the biggest blocker. Quantum computing feels theoretical. The HNDL framing helps, but many leadership teams still discount future risks. Skill gaps are real too; most engineering teams haven't worked with lattice-based cryptography or PQC key sizes.

**PQC-specific challenges:** The new algorithms are mature enough for standardization but young enough that the security community is still building confidence. PQC key sizes are significantly larger than RSA/ECC equivalents, which affects network performance and storage. Some constrained environments (IoT devices, embedded systems) may struggle with the computational overhead.

**Technical challenges:** Legacy systems that hardcode cryptographic choices are the hardest to migrate. PKI infrastructure changes are slow and risky. And the supply chain matters: you can't go PQC if your certificate authority, cloud provider, and client libraries don't support it yet.

The good news is that hybrid approaches (running classical + PQC simultaneously) address the confidence concern. If the PQC algorithm turns out to have an unforeseen weakness, the classical algorithm still protects you. If a quantum computer breaks the classical algorithm, the PQC algorithm protects you. You only lose if both fail simultaneously, which is an astronomically unlikely scenario.

## Why Cryptographic Agility Is the Real Deliverable

If you take one thing from this post, let it be this: the most valuable investment isn't adopting a specific PQC algorithm today. It's designing your systems so you can change algorithms without a major engineering effort.

Cryptographic agility means:
- Encryption algorithms are configured, not hardcoded
- Key management supports multiple algorithm types simultaneously
- TLS configurations can be updated without application code changes
- Your secrets management infrastructure supports algorithm migration without re-encrypting everything manually
- Testing includes validation of cryptographic configuration changes

This principle protects you regardless of which specific algorithms prevail. The PQC landscape is still evolving. NIST may standardize additional algorithms. Existing algorithms may need parameter adjustments. Cryptographic agility means you're prepared for any of those outcomes without another multi-year migration project.

---

**Keep reading:**
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)
- [SOC 2 for Startups: When You Need It and How to Get There](/blog/soc-2-for-startups/)
- [Audit-Ready LLM Architecture: How to Build AI Products That Pass SOC 2, EU AI Act, and ISO 42001](/blog/audit-ready-llm-architecture/)

*Evaluating your encryption strategy for long-term data protection? [Let's talk](https://calendly.com/juanidrovo).*
