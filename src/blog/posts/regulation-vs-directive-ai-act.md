---
title: "Regulation vs. Directive: Why the EU's Choice of Legal Instrument Shapes Your AI Compliance Timeline"
description: "The AI Act is a Regulation. The Product Liability Directive is a Directive. The AI Liability Directive was withdrawn entirely. Here's why the legal instrument matters for your compliance planning."
date: 2026-02-13
lastModified: 2026-02-13
tags:
  - posts
  - eu-law
  - ai-regulation
  - compliance
  - legal-tech
---

The EU AI Act takes effect for high-risk systems on 2 August 2026. On the same timeline, the revised Product Liability Directive must be transposed into national law by 9 December 2026. The proposed AI Liability Directive was withdrawn entirely in February 2025.

Three instruments. Three different legal statuses. Three different compliance implications. If you're building AI products that touch the EU market - directly or through the [contractual infection vector](/blog/direct-effect-ai-act/) - the distinction between a Regulation and a Directive isn't academic. It determines whether you face one set of rules or twenty-seven.

## The Fundamental Distinction: Article 288 TFEU

Article 288 of the Treaty on the Functioning of the European Union defines the EU's legislative instruments. Two definitions matter here:

**Regulations** "shall have general application. [They] shall be binding in [their] entirety and directly applicable in all Member States."

**Directives** "shall be binding, as to the result to be achieved, upon each Member State to which [they are] addressed, but shall leave to the national authorities the choice of form and methods."

The practical difference is significant:

| Feature | Regulation | Directive |
|---------|-----------|-----------|
| Application | Directly applicable, no national legislation needed | Requires transposition into national law |
| Uniformity | Identical rules in all 27 member states | Each state implements differently |
| Compliance target | One set of rules | Potentially 27 variations |
| Timeline certainty | Fixed date, known in advance | Depends on each state's transposition schedule |
| Legal basis for claims | Can be invoked directly in national courts | Generally cannot be invoked until transposed (with exceptions) |

When the EU chooses a Regulation, it's choosing uniformity. When it chooses a Directive, it's choosing flexibility for member states - at the cost of compliance complexity for cross-border businesses.

## Why the AI Act Is a Regulation

The AI Act (Regulation (EU) 2024/1689) was published in the Official Journal on 12 July 2024 and entered into force on 1 August 2024. As a Regulation, it is directly applicable in all member states without transposition.

The Commission's choice was deliberate. AI systems are inherently cross-border - a system developed in Ireland gets deployed across the EU. Divergent national rules would undermine the single market for AI and create the exact fragmentation the regulation was designed to prevent.

The European Parliament's own framing stated the purpose: "to provide for one single set of safety rules across the European Union - 450 million people - instead of 27 different national regulations."

For compliance planning, this means:

- **One rulebook.** The obligations under Articles 6 through 49 for high-risk systems, the transparency requirements under Article 50, and the prohibitions under Article 5 are identical whether your customer is in Germany, Spain, or Estonia.
- **Fixed deadlines.** Prohibited practices took effect on 2 February 2025. GPAI model governance applies from 2 August 2025. High-risk system requirements apply from 2 August 2026. These dates don't move based on national politics.
- **No transposition risk.** You won't find yourself compliant in France but non-compliant in Germany because the two countries transposed the same rule differently.

## The GDPR Precedent: Why Regulations Work for Cross-Border Tech

The GDPR (Regulation (EU) 2016/679) provides the clearest precedent for why the Commission chose a Regulation for AI governance.

Before the GDPR, EU data protection was governed by Directive 95/46/EC. The results were instructive. The GDPR's own Recital 9 documents the problems:

> "Directive 95/46/EC has not prevented fragmentation in the implementation of data protection across the Union, legal uncertainty or a widespread public perception that there are significant risks to the protection of natural persons... Differences in the level of protection... may prevent the free flow of personal data throughout the Union. Those differences may therefore constitute an obstacle to the pursuit of economic activities at the level of the Union, distort competition and impede authorities."

Under the old Directive, multinationals had to navigate up to 28 different national data protection regimes. Definitions of consent varied across member states. Notification requirements differed. Cross-border data transfer rules were inconsistent. The fragmentation was so severe that companies often couldn't build a single privacy architecture that worked everywhere.

The GDPR's shift to a Regulation eliminated most of that fragmentation. One definition of consent. One set of data subject rights. One breach notification timeline (72 hours). One consistency mechanism through the European Data Protection Board.

The result was exactly what the [ISO 27001 vs GDPR analysis](/blog/iso-27001-not-gdpr-compliant/) on this blog describes: a single, enforceable standard that companies can architect against, rather than a moving target of national variations.

The AI Act follows the same logic. Lesson learned.

(A caveat: even the GDPR retains roughly 70 "opening clauses" where member states have discretion - the age of consent for children's data, employee data processing rules, and exemptions for journalism. A Regulation reduces fragmentation. It doesn't eliminate it entirely.)

## The Product Liability Directive: Where Transposition Creates Uncertainty

The revised Product Liability Directive (Directive (EU) 2024/2853) is the counterpoint. Published on 18 November 2024, it entered into force on 9 December 2024. Member states must transpose it by **9 December 2026**.

This Directive matters for AI builders because it explicitly includes software - whether embedded, standalone, or delivered as a service - within the definition of "product." AI systems are now products subject to strict (no-fault) liability for defects. The key changes from the old Directive 85/374/EEC are substantial:

- **Software is now a product.** AI systems, digital manufacturing files, and software updates/upgrades are all covered.
- **No maximum liability cap.** The old Directive allowed member states to set caps (Germany's was EUR 85 million). The new one removes the ceiling entirely.
- **Rebuttable presumptions.** If a manufacturer fails to disclose evidence ordered by a court, defectiveness is presumed. If the product breaches mandatory safety requirements, defectiveness is presumed. If the defect is established and the damage is "typically consistent" with that type of defect, causation is presumed.
- **Expanded liability chain.** Online platforms acting beyond mere intermediation, logistics providers, and entities substantially modifying products can now be held liable.
- **Continuing obligation.** Manufacturers must keep software free of defects and cybersecure via updates, even after initial placement on the market.

Because this is a Directive, each member state will transpose these rules into national legislation. And that's where compliance complexity enters.

### The Transposition Problem

History shows what happens when 27 countries implement the same Directive: they don't implement it the same way.

**The Copyright Directive (EU) 2019/790** is the cautionary tale. Article 17, which requires platforms to prevent copyright infringement while protecting lawful uses, contained inherently vague terms like "best efforts" and "high industry standards of professional diligence." The transposition deadline was 7 June 2021. The results diverged dramatically:

- **France and the Netherlands** largely copied the Directive text verbatim, deferring the hard questions.
- **Germany** took an innovative approach with its Urheberrechts-Diensteanbieter-Gesetz (UrhDaG), creating quantitative thresholds for presumptively lawful uploads - under 15 seconds of video, under 160 characters of text, under 125 KB of images could not be automatically blocked. The European Commission referred Germany to the CJEU for exceeding the Directive's requirements.
- **Austria** included similar anti-overblocking safeguards.
- **Italy and Spain** implemented without such safeguards.

The CJEU's own ruling in Case C-401/19 (Republic of Poland v European Parliament, 26 April 2022) added another layer: the Court held that member states must ensure automated filtering doesn't block lawful content - but by that point, many countries had already transposed without such protections. The result is an uneven playing field where your copyright liability exposure depends on which member state your users are in.

**The NIS2 Directive (EU) 2022/2555** on cybersecurity is an even starker example. The transposition deadline was 17 October 2024. Twenty-three of twenty-seven member states missed it. The Commission opened infringement proceedings in November 2024 and escalated to reasoned opinions against 19 member states - including Germany, France, Spain, and Ireland - in May 2025. As of January 2026, seven member states still hadn't completed transposition. Companies operating across borders faced different cybersecurity obligations depending on which member state had actually transposed the rules.

This is the compliance reality of a Directive: you don't just need to know the EU-level rules. You need to track which member states have transposed, how each one interpreted the flexible provisions, and whether the transposition is even complete.

For the revised Product Liability Directive, expect similar dynamics. The core principles - software as a product, rebuttable presumptions, expanded liability - will be consistent. But the procedural details, the evidentiary standards, and the specific mechanics of how courts handle disclosure orders and presumptions will vary by jurisdiction. If you sell AI products across multiple EU member states, your liability exposure won't be uniform.

## The AI Liability Directive: What Withdrawal Means

The proposed AI Liability Directive (COM(2022) 496 final, proposed 28 September 2022) would have harmonized fault-based civil liability rules for AI across the EU. It contained two key innovations:

1. **Disclosure of evidence.** Courts could order AI providers or deployers to disclose relevant evidence to claimants, with defectiveness presumed if they refused.
2. **Rebuttable presumption of causality.** If a defendant breached a duty of care under the AI Act, courts would presume a causal link between the AI system and the harm - addressing the "opacity barrier" that makes it nearly impossible for claimants to prove how a complex AI system caused their injury.

The Commission withdrew it in February 2025, stating there was "no foreseeable agreement." The formal withdrawal was published in the Official Journal on 6 October 2025.

The withdrawal creates a gap that maps directly onto the Regulation/Directive distinction. The AI Act (a Regulation) establishes safety obligations uniformly across the EU. But when those obligations are breached and someone is harmed, the liability rules for seeking compensation fall back to **national civil tort law** - which is entirely unharmonized.

This is the scenario the [AI agents liability post](/blog/ai-agents-liability/) on this blog flagged: the liability landscape is fragmented. French tort law, German tort law, and Spanish tort law each have different standards of care, different burdens of proof, and different available remedies. Without the AI Liability Directive, there is no consistency mechanism for how national courts handle AI-related harm claims.

The practical consequence: if your AI agent [makes an error that causes harm](/blog/ai-agents-liability/), the legal outcome depends heavily on which member state's courts hear the case. A claimant-friendly jurisdiction like France (where courts have been willing to impose strict liability for defective things under Article 1242 of the Civil Code) may yield a different result than Germany (which requires proving specific fault elements).

For compliance planning, this means the AI Act's safety obligations under Articles 8 through 15 aren't just regulatory requirements. They're your strongest defense in any tort claim, regardless of jurisdiction. If you can demonstrate that your system met the AI Act's requirements for risk management, data governance, human oversight, and logging, you've built the strongest available defense against liability claims in any member state. Without harmonized liability rules, compliance with the Regulation becomes your shield.

## What This Means for Your Product

Three takeaways for teams building AI for EU markets:

**1. The AI Act gives you certainty. Use it.** As a Regulation, the AI Act provides one rulebook with fixed deadlines. The [proportionality-based risk tiers](/blog/proportionality-ai-act-risk-tiers/) tell you exactly what's required at each level. Don't overengineer compliance for the wrong tier, and don't underinvest for the right one. August 2026 is the deadline for high-risk system compliance.

**2. The Product Liability Directive requires jurisdiction tracking.** By December 2026, software and AI become products subject to strict liability - but the specific mechanics depend on how each member state transposes the Directive. If you ship AI products to multiple EU countries, track the transposition process in your key markets. The rebuttable presumptions on defectiveness and causation are the provisions most likely to diverge in national implementation.

**3. The absence of the AI Liability Directive makes AI Act compliance more important, not less.** Without harmonized liability rules, your compliance posture under the AI Act is the single most consistent defense you can build. Logging, human oversight, data governance documentation, conformity assessments - these aren't just regulatory checkboxes. They're the evidence you'll need if a tort claim lands in a national court.

The choice between a Regulation and a Directive isn't an obscure legal technicality. It determines whether you're building against one standard or twenty-seven. For the AI Act, the EU chose uniformity. For product liability, it chose flexibility. For AI-specific liability, it chose nothing at all. Plan accordingly.

---

**Keep reading:**
- [The Direct Effect of the EU AI Act: Why Local Compliance Isn't Enough](/blog/direct-effect-ai-act/)
- [AI Agents and Liability: Who's Responsible When the Agent Gets It Wrong?](/blog/ai-agents-liability/)
- [Your ISO 27001 Certificate Doesn't Make You GDPR Compliant](/blog/iso-27001-not-gdpr-compliant/)

*Navigating AI regulation across multiple EU jurisdictions? [Let's talk](https://calendly.com/juanidrovo).*
