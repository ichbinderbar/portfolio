---
title: "NYT v. OpenAI: The Case That's Quietly Rewriting the Rules for Every AI Product"
description: This copyright lawsuit has become the case that will define how AI companies handle data, privacy, and litigation for the next decade. Here's why the discovery orders matter more than the fair use question.
date: 2026-02-02
tags:
  - posts
  - legal-tech
  - ai
  - copyright
  - litigation
---

A copyright lawsuit filed in December 2023 has turned into something nobody expected: the case that will define how AI companies handle data, privacy, and litigation for the next decade.

Not because of the copyright question. Every AI lawsuit asks that. NYT v. OpenAI matters because of everything *around* the copyright question. The discovery orders alone are reshaping what it means to ship an AI product.

Here's why, if you're building anything that touches a language model, this is the one case you can't afford to ignore.

## A Copyright Case That Became a Data Governance Crisis

The New York Times sued OpenAI and Microsoft in the Southern District of New York, alleging that OpenAI scraped millions of copyrighted articles to train ChatGPT without permission. The core copyright claim is straightforward enough: training on our content without a license is infringement, not fair use.

But the case stopped being "just" about copyright somewhere around mid-2025.

On May 13, 2025, Magistrate Judge Ona Wang issued a preservation order that sent shockwaves through every AI company's legal and engineering teams. OpenAI was ordered to retain *all* ChatGPT conversation logs, covering over 400 million users worldwide. No deletion. No standard data retention policies. Everything preserved.

It was the first time any court had mandated mass preservation of AI-generated content at this scale. And it immediately collided with OpenAI's privacy commitments, its product architecture, and data protection obligations across multiple jurisdictions.

Judge Sidney Stein affirmed the order on June 26, 2025, noting that OpenAI's own terms of use already permitted data retention for legal requirements. Privacy concerns, he said, didn't override the preservation needs of the case.

The preservation obligation eventually ended for new content on September 26, 2025. But OpenAI still holds a massive corpus of historical user data from April through September 2025, and the Times is fighting to keep that data in play.

Think about what that means for product architecture. One court order turned a chatbot's conversation logs into litigation evidence. If you're building an AI product and your data retention policies aren't designed with litigation holds in mind, you're already behind.

## 20 Million Logs and the Death of the Privacy Shield

The preservation order was just the opening move. The real fight was over discovery.

The Times initially demanded 120 million ChatGPT conversation logs to prove that users routinely interact with copyrighted news content through ChatGPT, and that those interactions substitute for reading the original articles. OpenAI countered with 20 million, roughly 0.5% of its preserved logs, framing it as a reasonable compromise.

The plaintiffs accepted the 20 million number. Then OpenAI tried to walk it back.

In October 2025, OpenAI proposed running keyword searches on the 20 million logs and producing only conversations that specifically referenced the plaintiffs' works. In other words: let us filter what you see.

Judge Wang rejected that approach in November 2025. Judge Stein affirmed the ruling on January 5, 2026. The full 20 million anonymized logs must be produced, unfiltered.

The court's reasoning matters. Wang found that even logs *without* reproductions of the plaintiffs' works are relevant. Fair use analysis looks at market harm. If ChatGPT's outputs across a broad range of queries show patterns of competing with or substituting for copyrighted works, that's evidence. Limiting discovery to only the conversations that mention the Times would let OpenAI control the narrative.

On privacy, Stein acknowledged that users have "sincere" privacy interests. But he found those interests adequately protected by three safeguards: the sample reduction from billions to 20 million, OpenAI's de-identification process, and the existing protective order. The clincher? ChatGPT users "voluntarily submitted their communications" to OpenAI. They weren't wiretapped. They typed into a chatbox.

That distinction killed OpenAI's privacy objection.

For anyone building AI products, this ruling establishes something uncomfortable: user-privacy arguments will not automatically shield your internal data from discovery. If someone sues you for copyright infringement, your conversation logs are fair game, provided the court imposes de-identification and protective orders. Your product's chat history isn't a vault. It's a filing cabinet that a judge can open.

## The Pirated Books Problem: OpenAI's LibGen Exposure

Here's where the case gets really dangerous for OpenAI.

The class plaintiffs in the MDL, a group that includes the Authors Guild, George R.R. Martin, John Grisham, and dozens of other authors, allege that an OpenAI employee downloaded copyrighted books from Library Genesis in 2018. LibGen is the same shadow library that cost Anthropic $1.5 billion in the Bartz settlement.

During discovery, plaintiffs found that OpenAI had deleted two training datasets called "Books1" and "Books2," believed to contain over 100,000 books, back in 2022. A year before anyone sued. OpenAI initially said the deletion was due to "non-use."

When plaintiffs dug deeper, OpenAI claimed attorney-client privilege over the reasons for the deletion. Judge Wang wasn't having it. In November 2025, she ordered OpenAI to produce internal Slack messages from channels called "project-clear" and "excise-libgen," where employees discussed deleting the datasets. She also ordered disclosure of all communications with in-house counsel about the deletion and all previously redacted references to LibGen.

Wang's reasoning was sharp: OpenAI can't claim good faith while simultaneously blocking all inquiry into its state of mind. If you put your intent at issue by denying willfulness, you can't use privilege to hide the evidence that might contradict you.

This matters enormously for damages. Willful infringement under the Copyright Act can trigger statutory damages up to $150,000 per work. Regular infringement caps at $30,000. If the Slack messages show OpenAI knew it was using pirated content and tried to cover its tracks, the damages multiplier kicks in.

For context: Anthropic's $1.5 billion settlement covered about 500,000 works at roughly $3,000 each. OpenAI's exposure could be larger. Much larger.

And the piracy theory has teeth. Judge Alsup's Bartz ruling established that downloading from shadow libraries isn't protected by fair use, even if the training itself is transformative. Judge Stein has already allowed the class plaintiffs to pursue downloading as a separate infringement claim. The same legal theory that broke open the Anthropic case is now aimed at OpenAI.

## Market Substitution: The Question That Matters Most

Strip away the discovery battles and the piracy exposure, and you're left with the question at the center of this case. The one that will determine whether fair use protects AI training on copyrighted content or doesn't.

Does ChatGPT substitute for reading the New York Times?

This is the fourth factor in the fair use test, market harm, and it's emerging as the decisive one across all AI copyright litigation. Thomson Reuters v. ROSS turned on direct competition. Judge Chhabria warned in Kadrey v. Meta that "market dilution will often cause plaintiffs to decisively win." The music cases are straightforward because AI-generated tracks compete in the same streaming market as the originals.

NYT v. OpenAI is the purest test.

The Times will argue that users ask ChatGPT questions they would otherwise answer by reading Times articles. That ChatGPT provides news summaries, analysis, and factual reporting drawn from copyrighted journalism. That this reduces readership, undermines subscriptions, and competes with the Times' own digital products.

OpenAI will argue that ChatGPT is transformative. It doesn't regurgitate articles. It synthesizes information across billions of data points and generates original responses. A user asking ChatGPT about a news event isn't reading the Times, the argument goes. They're interacting with a fundamentally different product.

The 20 million logs could decide this. If the logs show that users regularly ask ChatGPT for news and receive responses that make reading the original article unnecessary, the market substitution argument gets very strong. If the logs show something else, maybe scattered references with no pattern of substitution, OpenAI's defense holds.

That's why OpenAI fought so hard to limit what gets produced. And that's why the court said no.

## The MDL Is the Gravitational Center

NYT v. OpenAI doesn't exist in isolation. It's part of a consolidated multi-district litigation that includes 16 copyright lawsuits funneled before Judge Stein. The plaintiffs span news organizations, individual authors, publishers, and the Authors Guild.

The MDL is where the big questions will get answered. When Judge Stein eventually rules on summary judgment, that opinion won't technically bind courts in California or Delaware. But it will carry massive persuasive weight. The factual record is deeper, the legal teams are stronger, and the volume of claims is larger than in any other AI copyright proceeding.

And unlike Bartz v. Anthropic, which settled before trial for $1.5 billion, or Udio, which settled with UMG in October 2025, this case is pushing toward a ruling on the merits. A confidential settlement conference happened on October 31, 2025. As of early 2026, there's been no announced settlement. The Times appears to want a precedent, not a payout.

That's what makes this case different. Settlements resolve individual disputes. They don't create law. If NYT v. OpenAI goes to summary judgment, and potentially to trial, we get a judicial opinion on generative AI, market substitution, and fair use from the Southern District of New York. That opinion becomes the reference point every other court cites for the next decade.

Summary judgment isn't expected until at least summer 2026. But the case is already producing binding rulings on discovery, data preservation, and privilege that are reshaping how AI companies operate today.

## What This Means If You're Shipping Product

I've built compliance modules and triaged security vulnerabilities for long enough to know that you don't get to wait for legal certainty before making product decisions. You build for the risk as it exists right now. Here's what NYT v. OpenAI is telling product builders:

**Your conversation logs are discoverable.** Design data retention policies with litigation in mind. The question isn't whether you'll face a preservation order. It's whether you'll be ready when it comes. If your architecture can't isolate, preserve, and produce anonymized conversation logs on a court's timeline, you have a gap.

**De-identification isn't optional. It's your defense.** The court allowed the 20 million logs to be produced because OpenAI had a de-identification process and a protective order in place. Without those safeguards, the privacy objection might have stuck. Build de-identification into your pipeline before you need it.

**Piracy exposure is existential.** If any part of your training data supply chain touches shadow libraries, torrented datasets, or unauthorized scraped content, you're carrying Bartz-level risk. The "downloading as separate infringement" theory is winning. It doesn't matter if your training process is transformative. How you got the data matters independently.

**Market substitution analysis is a product exercise, not just a legal one.** If your AI product can plausibly replace the need to read, watch, or listen to the original copyrighted content, you're in the danger zone on factor four. This isn't something your legal team figures out in response to a lawsuit. It's something your product team should be evaluating during design.

**Settlement isn't guaranteed.** The Times appears to want precedent, not money. If you're an AI company operating under the assumption that every copyright case settles before reaching a ruling, NYT v. OpenAI should make you reconsider. Plan for a world where there's an actual judicial opinion on generative AI fair use, and it might not go your way.

## The Case That Won't Settle Quietly

Every other major AI copyright case has either produced a narrow ruling (Thomson Reuters v. ROSS, non-generative AI), settled before trial (Bartz v. Anthropic, $1.5 billion), or settled mid-litigation (UMG v. Udio). The Disney and Warner Bros. cases against Midjourney are still in early stages. The music publishers' $3 billion suit against Anthropic was filed just days ago.

NYT v. OpenAI is the one with the deepest factual record, the highest-profile plaintiffs, and the strongest likelihood of producing a real opinion on the merits. It's being litigated in the Southern District of New York, one of the most influential courts in the country, before a judge who has already shown he's willing to compel broad discovery and reject OpenAI's privacy arguments.

The discovery fights aren't sideshows. They're writing the de facto rules for AI data governance in real time. Every preservation order, every ruling on log production, every decision on privilege waiver becomes a template that other courts follow and other plaintiffs cite.

If you're building AI products and you're only tracking this case for the fair use ruling, you're missing most of the story. The procedural decisions are the ones that will hit your engineering roadmap first. The fair use opinion, whenever it comes, will confirm or reshape the direction. But by then, the companies that weren't paying attention to the discovery orders will already be scrambling.

The courtroom is writing the rulebook. In this case, it's writing the infrastructure requirements too.
