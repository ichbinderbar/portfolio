---
title: "The Courtroom is Writing the Rulebook: AI Copyright Lawsuits That Actually Matter"
description: "Over 50 active copyright lawsuits against AI companies are shaping what you can build. Here's what the rulings actually say and why they're product requirements in disguise."
date: 2026-02-01
lastModified: 2026-02-11
tags:
  - posts
  - legal-tech
  - ai
  - copyright
  - compliance
---

Last June, a federal judge in San Francisco called Anthropic's use of copyrighted books to train its AI models "spectacularly transformative." Two days later, a different judge in the same courthouse reached the same conclusion about Meta, but warned that this doesn't mean AI companies can do whatever they want.

Same court. Same week. Two opinions that agree on the headline but diverge on the details that will *actually* shape how AI products get built.

If you're building anything that touches AI (and at this point, who isn't?) these cases aren't academic. They're product requirements in disguise. They define what training data you can use, how you source it, what your outputs can look like, and what happens when your model spits out something a little too close to somebody else's work.

Here's what's really happening in the courtrooms, and why it matters more than the press releases suggest.

## Over 50 Lawsuits. Three Rulings That Actually Set Direction.

There are more than 50 active copyright lawsuits against AI companies in U.S. federal courts right now. Most are still grinding through discovery. But three decisions from 2025 have started to sketch the boundaries, and they don't all point the same way.

**Thomson Reuters v. ROSS Intelligence** came first, in February 2025. ROSS built an AI-powered legal research tool designed to compete with Westlaw. To train it, ROSS used thousands of Westlaw's copyrighted headnotes, editorial summaries of case law that Thomson Reuters writes and copyrights. Judge Stephanos Bibas rejected ROSS's fair use defense outright. The key? ROSS's tool did the same thing as Westlaw. It wasn't generative AI creating something new. It was a search engine trained on a competitor's proprietary content to compete directly with that competitor.

The ruling was narrow (ROSS's AI was non-generative) but the reasoning hit a nerve. Factor four of the fair use test, market harm, was decisive. Build a competing product with someone else's copyrighted content, and fair use won't save you.

That case is now on interlocutory appeal to the Third Circuit, which will be the *first* appellate court to weigh in on fair use and AI training. Every AI company's legal team is watching.

**Bartz v. Anthropic**, decided in June 2025, was the first ruling to directly tackle fair use for generative AI training on copyrighted books. Judge William Alsup split the baby in a way that made nobody completely happy, which usually means the analysis is right.

Training an LLM on copyrighted works? Fair use. "Spectacularly transformative," Alsup wrote. The model doesn't reproduce books. It learns statistical patterns and generates something different. He compared it to a person reading books to learn how to write.

Digitizing print books Anthropic legally purchased? Also fair use. A format change. They bought the books, scanned them, shredded the originals. Just converting from paper to digital for internal use.

But downloading millions of pirated books from shadow libraries like LibGen to build a permanent research library? *Not* fair use. No doctrinal shortcut excuses piracy, even if what you eventually do with the pirated copies is transformative.

That distinction, between the act of training and the act of *acquiring* training data, is the product-shaping insight. The ruling basically says: *what* you do with copyrighted content can be fair use; *how* you got it can still get you sued into oblivion.

And the numbers confirmed it. Anthropic settled the class action for up to $1.5 billion, the largest known copyright settlement in history, driven primarily by the piracy exposure.

**Kadrey v. Meta** landed two days after Bartz, and Judge Vince Chhabria went further in some ways and pulled back in others. He agreed Meta's use of books to train its Llama models was highly transformative. But he explicitly pushed back on Alsup's reasoning, calling the analogy to schoolchildren learning creative writing "inapt."

Where Chhabria got interesting, and arguably more useful for anyone building products, was on market harm. He warned that "market dilution will often cause plaintiffs to decisively win the fourth factor, and thus win the fair use question overall." In plain language: if your AI's outputs compete with the works it trained on, even indirectly, fair use might not protect you.

Meta won this round only because the plaintiffs didn't bring evidence of actual market harm. Chhabria practically drew a map for future plaintiffs, calling it a "roadmap" more than a victory.

He also dismissed the argument that ruling against AI companies would kill innovation. His word: "ridiculous." These companies are expected to generate trillions. If they need copyrighted content, they'll figure out how to pay for it.

## The "Fair Use Triangle," and Why It's Unstable

Legal commentators have started calling these three decisions the "Fair Use Triangle." Two for AI developers, one against. But that framing is misleading.

Even the wins come with asterisks the size of building permits.

**Bartz:** Fair use for training, but not for piracy. If your data supply chain includes anything unauthorized, your fair use defense has a hole in it.

**Kadrey:** Fair use this time, but only because plaintiffs didn't prove market harm. Next time, with better evidence, the result could flip.

**Thomson Reuters:** No fair use when your AI product directly competes with the source material's purpose. This matters enormously for anyone building AI tools in specialized domains: legal tech, medical, financial research.

No appellate court has ruled on any of this yet. The Third Circuit's eventual opinion in Thomson Reuters v. ROSS will be the first, and it could reshape everything below it. We're building products on case law that might not survive 2026.

## The NYT v. OpenAI: The One That Could Change Everything

The New York Times sued OpenAI and Microsoft in December 2023, and the case has become the highest-profile AI copyright battle in the world.

Judge Sidney Stein let most of the Times' claims proceed in March 2025, including the core allegation: that OpenAI copied millions of articles to train ChatGPT without permission. OpenAI and Microsoft never even challenged the direct copyright infringement claims. They're fighting on fair use and the scope of secondary liability.

The discovery phase has been a war of its own. The Times demanded 120 million ChatGPT conversation logs to show how users interact with copyrighted news content. OpenAI countered with 20 million, then tried to walk it back to only keyword-searched results. Judge Stein sided with the Times. OpenAI has to produce the full 20 million anonymized logs.

The privacy implications alone are staggering. Magistrate Judge Ona Wang issued a preservation order requiring OpenAI to retain *all* ChatGPT conversation logs, affecting over 400 million users worldwide. It's the first time a court has mandated mass preservation of AI-generated content at this scale.

From a product perspective, this case asks the question every AI company is trying to avoid: does ChatGPT substitute for reading the original source? If the answer is yes, even partially, the market substitution argument kicks in, and fair use gets a lot harder to defend.

The case won't reach summary judgment until at least 2026. But its discovery disputes are already setting precedents for how AI companies handle data governance, user privacy, and litigation readiness.

## Hollywood Enters the Ring: Disney v. Midjourney

When Disney, Universal, and DreamWorks filed a 110-page complaint against Midjourney in June 2025, the dynamic shifted. This wasn't authors or journalists suing. This was the combined legal weight of Hollywood's biggest studios targeting a single AI image generator.

The complaint is visually devastating. Side-by-side comparisons of copyrighted characters (Darth Vader, Elsa, Shrek, Homer Simpson) next to Midjourney outputs generated from nothing more than a character name prompt. No prompt engineering needed. Just type "Yoda" and you get Yoda.

Warner Bros. followed with its own suit in September 2025. Three of the "Big Five" studios have now sued Midjourney, with Sony and Paramount still on the sidelines.

Disney's case differs from the text-based lawsuits in a critical way: the infringement is *visual*. A jury can see it. You don't need to parse statistical relationships between token sequences. You just look at the pictures.

Midjourney reportedly has about $200 million in revenue. Enough to make it worth suing, not enough to survive a loss. Disney's general counsel didn't mince words: "This is our first case, but it likely won't be the last."

The studios also filed suit against AI video generation companies in late 2025, marking the first copyright cases involving AI-generated video content. The frontier keeps expanding.

## Music's Multi-Front War

The music industry opened its own front and hasn't stopped advancing.

**Concord Music v. Anthropic** started in October 2023 when music publishers sued Anthropic for mass infringement of copyrighted song lyrics. The publishers alleged Claude could reproduce near-identical copies of lyrics when prompted. The case narrowed after the court dismissed contributory and vicarious infringement claims, finding the publishers hadn't shown actual third-party users (as opposed to their own investigators) generating infringing outputs. But the direct infringement claim survives, and as of late January 2026, the publishers filed a separate lawsuit alleging Anthropic pirated over 20,000 musical works, with potential damages exceeding $3 billion.

**UMG v. Suno** and **UMG v. Udio** were filed simultaneously in June 2024 by all three major record labels. The cases allege the AI music generators trained on copyrighted recordings at massive scale. Suno admitted to using "essentially all music files accessible on the open internet." Udio settled with UMG in October 2025. Suno's case continues, with the labels now alleging the company pirated content via BitTorrent, the same piracy angle that cost Anthropic $1.5 billion.

The music cases add a dimension the book and news cases don't: market substitution is more intuitive. AI-generated music competes in the *same market* as the originals. It shows up on Spotify. People listen to it instead of licensed tracks. That makes the fourth fair use factor, market harm, much easier for plaintiffs to prove.

## Getty Images v. Stability AI: The UK Wildcard

Meanwhile, across the Atlantic, the first AI copyright trial happened in the UK. Getty Images sued Stability AI for scraping over 12 million copyrighted photographs to train Stable Diffusion.

The ruling, released in November 2025, was a split decision. Getty won on trademark infringement (Stability's outputs sometimes reproduced Getty's watermarks, which is hard to explain away). But Getty lost on secondary copyright infringement, with the judge noting the training technically happened on Amazon servers outside the UK.

Both sides claimed victory. But the real takeaway for product builders is jurisdictional: where your training happens, where your servers live, and where your users are. All of these matter. AI training is a global activity governed by local laws. That mismatch is a product risk most companies haven't fully modeled.

## The MDL: Where Cases Go to Wait (and Consolidate)

Sixteen copyright lawsuits against OpenAI have been consolidated into a multi-district litigation (MDL) before Judge Sidney Stein in the Southern District of New York. The plaintiffs include the New York Times, Chicago Tribune, and numerous individual authors and publishers.

The MDL is the gravitational center of AI copyright litigation. When it eventually produces summary judgment opinions and potentially goes to trial, those decisions will carry enormous weight. Not because they bind other courts, but because the sheer volume of claims and the quality of the legal teams involved will produce opinions that other judges cite.

The problem? It's slow. Discovery is ongoing, and no summary judgment decisions on fair use from the MDL are expected until summer 2026 at the earliest.

## What This Actually Means If You're Building Product

I've spent enough time in both codebases and compliance frameworks to know that legal uncertainty doesn't mean you get to ignore the risk. It means you build for it.

Here's what these cases tell product builders *right now*:

**Data provenance is a product requirement.** Bartz drew a hard line between lawfully acquired and pirated training data. If you can't trace the source of every dataset in your training pipeline, you're carrying risk you haven't priced. This isn't a nice-to-have audit. It's table stakes for any company that might face discovery.

**Output filtering isn't optional.** Judge Alsup noted approvingly that Anthropic had implemented filtering mechanisms to prevent Claude from reproducing copyrighted books. Judge Chhabria flagged the absence of infringing outputs as a key factor. If your model can reproduce copyrighted content on demand, like Midjourney reproducing Darth Vader from a one-word prompt, you're building the plaintiff's exhibit.

**Market substitution is the real test.** The fourth fair use factor, market harm, is emerging as the decisive question. Thomson Reuters lost because its product competed directly. The NYT case will hinge on whether ChatGPT substitutes for reading the news. AI music generators are in trouble because they compete in the same streaming market. If your product can plausibly replace the original, fair use gets thin.

**Licensing is becoming the cost of doing business.** Judge Chhabria dismissed arguments that paying for content would kill AI innovation. Meta itself explored paying up to $100 million for book licensing before hitting rights fragmentation problems. Disney licensed characters to OpenAI while simultaneously suing Midjourney. The market is sorting into companies that pay and companies that get sued.

**Don't assume any of this is settled.** No appellate court has ruled on generative AI fair use. The "Fair Use Triangle" is three district court opinions from two courthouses. Different judges, different facts, different reasoning. Everything could change with a single circuit court opinion.

## The Uncomfortable Truth

Here's what nobody building AI products wants to hear: the legal framework for AI and copyright is being written in real time by judges who are, by their own admission, learning how these systems work as they go. Judge Alsup compared LLM training to a person reading books. Judge Chhabria called that comparison "inapt." They're both guessing, informed by expert testimony and imperfect analogies to technologies that didn't exist when copyright law was written.

That uncertainty is itself a product constraint. You can't wait for the law to settle before shipping. But you can build systems that respect the direction these rulings are pointing: acquire data cleanly, filter outputs carefully, monitor for market substitution, and assume that someone with a $500-an-hour legal team is going to scrutinize every shortcut you took.

The courtroom *is* writing the rulebook. It's just writing it one motion at a time, with no table of contents and no estimated completion date.

If you're building at the intersection of AI and content, that ambiguity isn't a reason to wait. It's a reason to build compliance into the product from day one, because by the time the rules are clear, the companies that didn't will already be defendants.

---

**Keep reading:**
- [NYT v. OpenAI: The Case That's Quietly Rewriting the Rules for Every AI Product](/blog/nyt-v-openai-ai-product-rules/)
- [The Direct Effect of the EU AI Act: Why Local Compliance Isn't Enough](/blog/direct-effect-ai-act/)

*Building AI products and need help navigating copyright risk? [Let's talk](https://calendly.com/juanidrovo).*
