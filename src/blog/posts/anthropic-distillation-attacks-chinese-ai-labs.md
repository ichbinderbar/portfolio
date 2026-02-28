---
title: "Anthropic Accuses Chinese AI Labs of Industrial-Scale Distillation Attacks on Claude"
description: "DeepSeek, Moonshot, and MiniMax used 24,000 fake accounts and 16 million exchanges to extract Claude's capabilities. Here's what distillation attacks mean for AI security and compliance."
date: 2026-02-28
lastModified: 2026-02-28
tags:
  - posts
  - ai
  - security
  - compliance
  - ai-regulation
---

Twenty-four thousand fake accounts. Sixteen million exchanges. Three Chinese AI labs running coordinated campaigns to extract Claude's most advanced capabilities, routing traffic through proxy networks designed to look like ordinary API usage.

Anthropic dropped this bombshell on February 23, 2026, naming DeepSeek, Moonshot AI, and MiniMax as the operators behind what the company calls "industrial-scale distillation attacks." The timing wasn't subtle. The announcement landed the same week U.S. lawmakers were debating stricter semiconductor export controls to China, and just days after OpenAI sent its own letter to Congress alleging similar activity from DeepSeek.

But the technical details are what caught my attention. This isn't a vague accusation. Anthropic published specific numbers, specific techniques, and specific capabilities that each lab targeted. And the implications go well beyond intellectual property theft. They touch national security, AI safety, and a compliance question that should keep every startup founder up at night: what happens when the model you're building on was trained with stolen reasoning?

## What Distillation Actually Is

Distillation is a legitimate machine learning technique. You take a large, expensive model (the "teacher") and use its outputs to train a smaller, cheaper model (the "student"). The student learns to mimic the teacher's behavior without needing the same computational resources. Every major AI lab does this internally. It's how companies like Anthropic and OpenAI create faster, cheaper versions of their flagship models.

The problem starts when a competitor does it without permission. Instead of spending billions on compute, training data, and research to develop frontier capabilities independently, you query someone else's model millions of times, collect the outputs, and use them to train your own. You get 80% of the capability at a fraction of the cost.

Think of it like this: building a frontier AI model from scratch is like doing original pharmaceutical research - years of work, billions in investment, uncertain outcomes. Distilling someone else's model is like reverse-engineering a drug from a competitor's pills. You skip the R&D entirely.

The legal frameworks haven't caught up. Distillation exists in a gray zone between terms-of-service violations, trade secret misappropriation, and potentially export control violations. There's no clear statute that says "you can't train Model B on Model A's outputs," which is exactly why Anthropic is pushing for regulatory action alongside its disclosure.

## The Three Campaigns

Anthropic didn't just accuse these labs in the abstract. They published detailed breakdowns of each campaign, including the specific capabilities targeted, the volume of exchanges, and the evasion techniques used.

### DeepSeek: 150,000+ Exchanges

DeepSeek's campaign was the smallest by volume but the most strategically focused. Their queries targeted Claude's foundational reasoning capabilities - chain-of-thought logic, rubric-based grading, and what Anthropic describes as "censorship-safe alternatives." They were essentially trying to extract the reasoning traces that make Claude's thinking process distinctive.

The operation used synchronized traffic patterns across coordinated accounts, effectively load-balancing their extraction across the network to avoid triggering rate limits. Anthropic traced the activity to specific lab researchers through metadata analysis.

The focus on reasoning is telling. DeepSeek's R1 model, released in January 2025, made waves for matching frontier performance at dramatically lower cost. If they were supplementing their own training with distilled reasoning from Claude, it would help explain how a lab with fewer resources could close the capability gap so quickly.

### Moonshot AI: 3.4 Million+ Exchanges

Moonshot's campaign was more ambitious in scope. They used hundreds of fraudulent accounts across multiple access pathways, targeting Claude's agentic reasoning, tool use capabilities, coding proficiency, computer vision, and computer-use agent development.

The targets reveal Moonshot's strategic priorities. Computer-use agents - AI that can interact with desktop applications and web browsers - are one of Claude's most differentiated capabilities. Extracting those capabilities through distillation could save years of independent development.

What impressed (and probably alarmed) Anthropic was Moonshot's speed. When Anthropic released new model versions, Moonshot pivoted their extraction campaigns within 24 hours. They weren't running a static operation. They had teams actively monitoring Claude's capabilities and redirecting their distillation efforts toward whatever was newest and most valuable.

### MiniMax: 13 Million+ Exchanges

MiniMax ran the largest campaign by far, accounting for over 80% of the total exchange volume. Their focus was agentic coding, tool use, and orchestration - the capabilities that let AI systems break complex tasks into subtasks, select appropriate tools, and coordinate multi-step workflows.

Anthropic says they detected MiniMax's campaign while it was still active, before MiniMax had even launched the model they were training. Nearly half of MiniMax's traffic redirected within 24 hours of new Claude releases, suggesting the same real-time monitoring and adaptation pattern as Moonshot.

## The Proxy Network Problem

The labs didn't connect to Claude directly. They used what Anthropic calls "hydra cluster" architectures - commercial proxy services that resell access to frontier AI models at scale. These services manage 20,000+ fraudulent accounts simultaneously, mixing distillation traffic with legitimate requests to make detection harder.

This is a significant security challenge. Anthropic geofences its services, restricting access from certain regions. But proxy networks route traffic through compliant jurisdictions, effectively laundering the origin of the requests. It's the AI equivalent of IP spoofing, and it means that geographic restrictions alone can't prevent this kind of extraction.

The proxy services create a layer of deniability. The Chinese labs can claim they weren't directly accessing Claude. They were using a third-party service that happened to provide Claude access. Whether that distinction holds up legally is an open question, but it complicates enforcement significantly.

For Anthropic and other frontier labs, the proxy problem is existential. If you can't control who accesses your model, you can't prevent your capabilities from being extracted. And the economics are brutally asymmetric: Anthropic spent billions developing those capabilities. Extracting them through distillation costs orders of magnitude less.

## The Irony Problem

Here's where the story gets uncomfortable. Anthropic settled a class-action copyright lawsuit in September 2025 for up to $1.5 billion - the largest copyright settlement in history. The claim? Anthropic downloaded millions of pirated books from shadow libraries like LibGen to train Claude. In *Bartz v. Anthropic*, Judge William Alsup ruled that while training an LLM on copyrighted works could qualify as fair use, downloading pirated copies to build a permanent research library was not.

I covered the broader landscape of [AI copyright lawsuits](/blog/ai-copyright-lawsuits-that-matter/) when the rulings came down, and the pattern is clear: how you acquire training data matters as much as what you do with it.

So when Anthropic accuses Chinese labs of extracting Claude's capabilities without permission, critics are quick to point out the parallels. Reddit commenters invoked *The Office*: "How the turn tables." Futurism ran a headline calling the accusation "pretty ironic when you consider how it built Claude in the first place."

The irony is real, but it's also a distraction from the substantive issue. What the Chinese labs allegedly did isn't analogous to training on copyrighted books. It's more like a pharmaceutical company buying a competitor's pills at retail and reverse-engineering the formula. The inputs (Claude's outputs) are being used to replicate the product itself, not to create something transformatively different.

That distinction matters legally. The [NYT v. OpenAI case](/blog/nyt-v-openai-ai-product-rules/) is establishing that market substitution - creating outputs that compete directly with the source material - is the line that separates fair use from infringement. Distillation is pure market substitution. You're training a competing model on the outputs of the model you're competing with.

But the optics problem is real, and Anthropic knows it. When your own origin story includes a copyright settlement larger than most companies' valuations, your credibility as a victim of IP theft takes a hit, even if the legal analysis supports the distinction.

## The Safety Problem Nobody's Talking About

The national security framing gets all the headlines, but there's a more immediate concern that should worry anyone building with AI.

When you distill a model, you extract capabilities but not safety training. Frontier models like Claude have extensive alignment work baked in - constitutional AI, RLHF, red-teaming, content policies, refusal behaviors. These safety layers are designed to prevent the model from helping with dangerous tasks like bioweapon synthesis, cyberattack development, or mass surveillance.

Distilled models inherit the capability without the guardrails. The Chinese labs get Claude's reasoning power, agentic capabilities, and coding proficiency, but not the months of safety work that constrains how those capabilities can be used. As Anthropic puts it: "Models built through illicit distillation are unlikely to retain necessary safeguards, meaning dangerous capabilities can proliferate with many protections stripped out entirely."

This isn't hypothetical. If a distilled model can reason at Claude's level but lacks Claude's refusals, it becomes a more effective tool for generating malware, planning cyberattacks, or creating targeted disinformation. The capability-safety gap in distilled models is a real and underappreciated risk.

I wrote about the [data poisoning problem](/blog/ai-training-data-poisoning/) recently - how a single fake blog post can corrupt what AI systems believe. Distillation attacks are the inverse problem: instead of injecting bad data into a model, you're extracting good capabilities and deploying them without the controls that were designed to keep them safe.

## What This Means for Companies Building with AI

If you're a startup building on top of frontier AI models, Anthropic's disclosure raises practical questions you need to think through.

### Model Provenance Matters

When you evaluate AI providers, ask where their capabilities come from. If a model's reasoning quality seems disproportionate to the company's known R&D investment, that's a signal worth investigating. I'm not saying every efficient model is built on distillation, but the provenance of your AI infrastructure is becoming a compliance consideration.

The EU AI Act's transparency requirements under Article 53 require providers of general-purpose AI models to disclose training methodologies and data sources. If a model was trained partly through illicit distillation, that creates a compliance chain problem for everyone downstream. Your product inherits the legal exposure of your model provider's training practices.

### Supply Chain Risk

If you're building on a model that was distilled from a frontier model without authorization, you may be building on a foundation with legal risk. Today, there's no practical way to verify whether a given model's capabilities were developed independently or extracted from another model. But that's changing. Anthropic and OpenAI are both investing in detection methods, and regulatory frameworks are evolving to address model provenance.

For now, the practical advice is straightforward: use models from providers with clear, documented training practices. If you're evaluating a model that offers frontier-level capabilities at a fraction of the expected cost, understand why before you build your product on it.

### Safety Assumptions

If you're relying on your model provider's safety training to prevent harmful outputs, understand that distilled models may not carry those protections forward. Your content moderation, your abuse prevention, and your compliance with AI safety regulations all depend on the underlying model's alignment work being intact.

This is especially relevant for companies operating in regulated industries. If your AI system is classified as high-risk under the EU AI Act, you need to demonstrate that the model you're using meets safety requirements. A model built through illicit distillation, with safety guardrails stripped out, probably doesn't qualify - even if the capability level looks right.

## The Bigger Picture

Anthropic's disclosure is part of a larger pattern in the AI industry. As frontier capabilities become more valuable, the incentive to extract them through distillation grows. OpenAI has made similar allegations against DeepSeek. The U.S. government is tightening export controls on semiconductors. And the legal frameworks for protecting AI intellectual property are still being written.

What we're watching is the emergence of a new category of industrial espionage. Traditional IP theft involved stealing blueprints, source code, or trade secrets. AI distillation steals capabilities through the product itself, one API call at a time. The model's own outputs become the weapon used against it.

For frontier AI labs, this creates an impossible tension. They need to provide API access to generate revenue and build ecosystems. But every API call is a potential data point for a distillation campaign. Rate limiting and access controls help, but as Anthropic discovered, determined adversaries will route through proxy networks to circumvent them.

The industry's response will likely involve a combination of technical countermeasures (watermarking outputs, detecting coordinated extraction patterns), legal action (terms-of-service enforcement, trade secret claims), and regulatory advocacy (export control expansion, international IP frameworks).

But the fundamental economics haven't changed. Developing frontier AI capabilities costs billions. Extracting them through distillation costs millions. As long as that gap exists, the incentive for distillation attacks will remain, and the AI industry will need to get significantly better at detecting and preventing them.

---

**Keep reading:**
- [The Courtroom is Writing the Rulebook: AI Copyright Lawsuits That Actually Matter](/blog/ai-copyright-lawsuits-that-matter/)
- [NYT v. OpenAI: The Case That's Quietly Rewriting the Rules for Every AI Product](/blog/nyt-v-openai-ai-product-rules/)
- [AI Training Data Poisoning: When Your LLM Can't Tell Fact From Fiction](/blog/ai-training-data-poisoning/)

*Concerned about AI model provenance and compliance in your stack? [Let's talk](https://calendly.com/juanidrovo).*
