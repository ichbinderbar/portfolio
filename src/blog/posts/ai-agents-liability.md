---
title: "AI Agents and Liability: Who's Responsible When the Agent Gets It Wrong?"
description: "Courts, regulators, and insurers are rewriting the rules for agentic AI. Here's what SaaS founders shipping autonomous features need to know now."
date: 2026-02-11
lastModified: 2026-02-11
tags:
  - posts
  - ai
  - legal-tech
  - compliance
  - ai-regulation
---

An AI agent searches legal databases, drafts analysis, and sends results to a client's Slack channel with no human in the loop. The technical design is straightforward. The legal question is harder: if the agent sends wrong information to that Slack channel, who's liable?

That question used to be theoretical. It isn't anymore.

In the last twelve months, courts have started answering it. Regulators have started legislating around it. And insurers have started excluding it from coverage entirely. If you're building agentic AI features into your product, the legal landscape underneath you is shifting fast, and most founders have no idea how fast.

## The Cases That Changed Everything

### Workday: the AI vendor as "agent"

In *Mobley v. Workday*, Derek Mobley alleged that Workday's AI-powered applicant screening tools rejected him for over 80 jobs because of his race, age, and disability. The technical claim wasn't novel; disparate impact in automated hiring tools has been litigated before. What was novel was the legal theory: that Workday, as the *software vendor*, could be held directly liable as an "agent" of the employers using its tools.

Judge Rita Lin accepted this argument. The EEOC filed an amicus brief supporting it. And in May 2025, the court conditionally certified the ADEA collective action, covering what Workday disclosed as 1.1 billion rejected applications during the relevant period.

Read that number again. 1.1 billion.

This isn't a product liability edge case. It's a precedent establishing that AI software vendors face direct employment discrimination liability as agents of their customers. If you build hiring, screening, or scoring tools powered by AI, you are potentially liable for how your customers use them.

### OpenAI: infrastructure provider liability

Two other cases are pushing liability even further upstream.

In *Lowery v. OpenAI*, a plaintiff received 30+ unwanted texts and AI-powered robocalls about estate planning services. The calls were made by a third-party company using OpenAI's platform. The lawsuit targets not just the telemarketer, but OpenAI and Twilio as infrastructure providers, under the TCPA's "causing" liability theory. Penalties run $500-$1,500 per violation. The complaint notes theoretical exposure exceeding a trillion dollars across OpenAI's entire platform.

In *Shamblin v. OpenAI*, a family filed wrongful death claims after a 23-year-old died by suicide following a four-hour conversation with ChatGPT. CNN reviewed nearly 70 pages of chat logs and found the chatbot "repeatedly encouraged" the user. Seven related lawsuits allege OpenAI knowingly released GPT-4o despite internal warnings that the model was "dangerously sycophantic and psychologically manipulative."

These cases haven't been decided yet. But they signal where the law is heading: liability flows upstream, from deployer to vendor to infrastructure provider.

### The Singapore precedent

For those building AI agents that execute transactions, *Quoine v. B2C2* is required reading. A glitch in Quoine's exchange software caused trades to execute at approximately 250 times the market rate. Quoine reversed the trades unilaterally. Singapore's Court of Appeal held that Quoine breached its contract: automated systems bind their operators contractually, even when the outcome is unintended. The programmer's knowledge when writing the algorithm is attributed to the party at the time of contracting.

If your AI agent makes a purchase, sends a message, or executes a workflow, the output is legally yours.

## The Regulatory Wave

While courts are deciding liability case by case, state legislatures are trying to define it proactively. Multiple AI liability laws took effect on January 1, 2026, with more coming.

### What's already active

**Colorado AI Act (SB 205)**, effective June 30, 2026, is the most comprehensive. If your AI system makes or substantially factors into a "consequential decision" (employment, education, healthcare, housing, insurance, financial services, legal services), you must:

- Implement a risk management policy and program
- Complete an impact assessment before deployment
- Conduct annual reviews for algorithmic discrimination
- Notify consumers when AI is making consequential decisions about them
- Give consumers the right to correct their data and appeal decisions via human review

Penalties: $20,000 per violation, counted separately for each affected consumer.

**Illinois HB 3773** amends the Illinois Human Rights Act to prohibit employer use of AI that discriminates against protected classes, whether intentional or not. **Texas RAIGA** prohibits AI that discriminates, encourages self-harm, or produces prohibited content, with penalties up to $200,000 per violation.

**California SB 53** targets frontier AI developers specifically: those training models above 10^26 FLOPS with revenue exceeding $500 million. It requires safety protocols, transparency reports, and incident reporting, with penalties up to $1 million per violation.

### The EU angle

The [EU AI Act](/blog/direct-effect-ai-act/) takes full effect for high-risk AI systems on August 2, 2026. Providers (developers) bear primary responsibility for system design, compliance documentation, and transparency. Deployers bear responsibility for appropriate use, monitoring, and informing individuals they're subject to a high-risk AI system.

Penalties scale to EUR 35 million or 7% of global annual turnover for prohibited AI practices. The revised Product Liability Directive, which EU member states must transpose by December 9, 2026, explicitly includes software and AI within the definition of "products" subject to strict liability.

The AI Liability Directive, which would have created harmonized liability rules, was withdrawn by the European Commission in February 2025. This means when harm arises from AI, victims must seek compensation through national civil tort law, which remains unharmonized across the EU. The result is a fragmented liability landscape where liability rules vary by country.

### The preemption question

On December 11, 2025, President Trump signed an executive order proposing a uniform federal AI policy framework that would preempt state AI laws deemed "inconsistent." This creates uncertainty around enforcement of every state-level law listed above. Whether federal preemption will actually materialize, and which state laws would survive, remains an open question.

This is not a reason to ignore state laws. It's a reason to plan for the worst case and adjust.

## Your Insurance Might Not Cover This

Here's the part that surprised me most when researching this post.

Major insurers are actively excluding AI liability from coverage. AIG, WR Berkley, and Great American have each sought regulatory clearance for new policy exclusions that deny claims tied to AI systems.

WR Berkley's "Absolute AI Exclusion" is the broadest: it applies to D&O, E&O, and Fiduciary Liability policies and eliminates coverage for any claim "based upon, arising out of, or attributable to" the use, deployment, or development of AI. It explicitly covers AI-generated content, failure to detect AI-created materials, chatbot communications, and regulatory actions related to AI oversight.

Verisk rolled out standardized AI exclusion endorsement forms (CG 40 47 and CG 40 48) available to carriers as of January 1, 2026. One industry leader predicted that 95% of carriers will immediately employ these exclusions.

The counter-movement exists. The Artificial Intelligence Underwriting Company (AIUC) launched from stealth in July 2025 with a $15 million seed round, offering insurance specifically designed for AI agent deployments with pricing based on safety audit results. But this is a niche market. For most SaaS companies, the default is moving toward less AI coverage, not more.

If you're shipping agentic features, audit your insurance policies before your next renewal. The exclusions might already be there.

## What to Do About It

I've been building at the intersection of legal and engineering for long enough to know that the answer is never "wait for the law to settle." The answer is to build defensibly now and adjust as the landscape shifts.

### Technical safeguards

**Human-in-the-loop for consequential decisions.** If your agent can make or influence decisions about employment, lending, healthcare, or financial services, require human approval. This isn't just good practice under Colorado SB 205. It's your strongest liability defense.

**Authorization boundaries.** Cap transaction amounts. Restrict which tools the agent can access. Require escalation above thresholds. The Quoine precedent is clear: if the agent can act, you're bound by its actions.

**Logging everything.** Every prompt, every response, every tool call, every decision point. Comprehensive audit logs are critical for both regulatory compliance (EU AI Act Article 12 requires automatic event logging) and liability defense. If you can demonstrate exactly what the agent did and why, you're in a fundamentally stronger position than if you can't.

**Bias monitoring.** If your AI touches hiring, lending, or any consequential decision, implement continuous fairness monitoring. NYC Local Law 144 already requires annual bias audits for automated employment decision tools. Colorado SB 205 requires annual discrimination reviews. The EEOC's first AI discrimination settlement was $365,000, and that was a small case.

**Kill switches.** The ability to immediately terminate agent operations when anomalous behavior is detected. This isn't optional for production agentic systems.

### Contractual protections

**Negotiate AI-specific terms in vendor agreements.** Clifford Chance's February 2026 report on agentic AI found that most enterprise contracts don't adequately address the liability gap created by autonomous AI agents. Their recommendations: expanded indemnities covering AI agent acts and omissions, higher liability caps, clear audit rights, and explainability provisions.

**Map your agent workflows.** For each workflow where an AI agent takes action, identify the worst-case scenario, quantify potential liability, and verify your contracts cover those specific risks.

**Require vendors to carry AI-specific insurance.** As coverage becomes scarcer, this contractual obligation becomes more important, and more difficult to satisfy.

### Regulatory readiness

Build for the most restrictive jurisdiction your customers operate in. If you have customers in Colorado, you need a risk management program by June 30, 2026. If you serve EU customers with high-risk AI, provider and deployer obligations apply with penalties up to 7% of global turnover by August 2, 2026. If you use AI in Illinois employment decisions, anti-discrimination requirements are already active.

The [SaaS compliance stack](/blog/saas-compliance-stack/) I've written about before applies here too. The frameworks overlap, the controls compound, and the cost of compliance is always lower than the cost of enforcement.

## The Uncomfortable Truth

The legal system is treating AI agents the way it eventually treats every powerful technology: by holding the people who deploy it responsible for what it does. The Mobley ruling, the Lowery complaint, the Shamblin lawsuits, the state legislation, the insurance exclusions. They all point in the same direction.

If your AI agent can act autonomously, you bear the consequences of its actions. Not the model provider. Not the cloud platform. You.

The companies that internalize this now, building with logging, boundaries, human oversight, and insurance, will have a structural advantage over those that ship first and litigate later. Because the one thing I've learned working across legal and engineering is that the cost of building defensibly is always cheaper than the cost of learning you should have.

---

**Keep reading:**
- [The Direct Effect of the EU AI Act: Why Local Compliance Isn't Enough](/blog/direct-effect-ai-act/)
- [The Agentic Architect: Lessons from the OpenClaw Workflow](/blog/the-agentic-architect-openclaw/)
- [The Courtroom is Writing the Rulebook: AI Copyright Lawsuits That Actually Matter](/blog/ai-copyright-lawsuits-that-matter/)

*Shipping agentic AI features and need to understand your liability exposure? [Let's talk](https://calendly.com/juanidrovo).*
