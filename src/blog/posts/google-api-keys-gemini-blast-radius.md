---
title: "Google Cloud API Keys Now Expose Gemini Access - And Most Teams Don't Know It"
description: "Thousands of leaked GCP API keys silently gained Gemini access after API enablement. Here's what developers and startups building with AI need to fix now."
date: 2026-03-02
lastModified: 2026-03-02
tags:
  - posts
  - security
  - ai
  - startups
  - secrets-management
---

You ship a Maps integration. You embed a Google Cloud API key in your frontend JavaScript because the docs say it's fine for client-side use. You add referrer restrictions and move on. Six months later, someone on your team enables the Gemini API on the same GCP project. That Maps key, sitting in your public JavaScript, now authenticates to Gemini endpoints. No warning. No confirmation dialog. No email.

This isn't a hypothetical. Truffle Security researcher Joe Leon just documented nearly 3,000 Google Cloud API keys embedded in client-side code that now authenticate to Gemini, even though they were never intended for it. Separately, mobile security company Quokka found over 35,000 unique Google API keys across 250,000 Android apps. The scale is staggering, but the mechanism is what should worry you.

## How the Blast Radius Expands Silently

The core issue is how Google Cloud handles API key scope. When you create a new API key in GCP, it defaults to "Unrestricted," meaning it applies to every API enabled on the project. Most teams know this in theory. In practice, they forget about it the moment the key works for its intended purpose.

Here's the sequence that creates the vulnerability:

1. A developer creates an API key for Google Maps or Translate
2. The key gets embedded in client-side code (common for Maps, Translate, and other browser-facing APIs)
3. The key is restricted by referrer or IP, which feels secure enough
4. Months or years later, someone enables the Gemini API on the same project
5. Every existing unrestricted key on that project silently gains Gemini access

The key never changed. The code never changed. But the blast radius expanded dramatically because enabling a new API retroactively grants access to every unrestricted credential on the project.

If you've read my breakdown on [secrets management patterns](/blog/secrets-management-developers/), you know that leaked credentials get exploited fast - 60% within 12 hours of exposure. The difference here is that these keys weren't even "leaked" in the traditional sense. They were intentionally placed in client-side code for legitimate reasons. The risk profile changed underneath them.

## What Attackers Can Actually Do

This isn't just about running up your Gemini bill (though that happens too - one Reddit user reported $82,314.44 in charges over two days from a single compromised key, compared to their normal $180/month spend).

With a valid API key authenticating to Gemini, attackers can:

- **Access uploaded files** through the `/files` endpoint, which may contain proprietary documents, training data, or customer information your team uploaded for fine-tuning or context
- **Read cached content** via the `/cachedContents` endpoint, potentially exposing conversation history, system prompts, or retrieval-augmented generation (RAG) context
- **Make API calls against your quota**, generating responses that get billed to your account with no rate limiting beyond your project's quota settings
- **Exfiltrate data indirectly** by using Gemini to summarize or extract information from files and cached content accessible through the project

The financial exposure alone is serious. But for teams building AI products, the data exposure is worse. If you've uploaded customer data, internal documents, or proprietary training sets to your GCP project for Gemini integration, an exposed API key is now a data breach vector.

## The Real Problem Is Structural

This isn't unique to Google. It's a pattern that emerges whenever a platform adds powerful new capabilities to existing infrastructure. The same thing happened with AWS when teams discovered that overly permissive IAM roles created for S3 access also granted Bedrock permissions after they enabled it. It will happen again as Azure, AWS, and GCP continue expanding their AI service offerings.

The structural issue is this: **credential scope and API enablement are managed separately, but they should be reviewed together.** Most teams have a process for creating and restricting API keys. Almost none have a process that re-evaluates existing credential scope when new APIs are enabled on a project.

This is the kind of architectural gap I wrote about in [building audit-ready LLM systems](/blog/audit-ready-llm-architecture/) - your access controls need to account for how permissions compound across layers. A key that was safe at the Maps layer becomes dangerous at the Gemini layer, and nothing in the default GCP configuration flags this transition.

## What to Do About It Right Now

If your team uses Google Cloud, here's a concrete checklist:

### 1. Audit Every API Key on Every Project

Run this in your terminal for each project:

```bash
gcloud services api-keys list --project=YOUR_PROJECT_ID --format="table(name,restrictions)"
```

Look for keys with no API restrictions or with restrictions that don't match their actual use. Any key showing "Unrestricted" is a candidate for exploitation if Gemini (or any sensitive API) is enabled on the project.

### 2. Apply API-Level Restrictions to Every Key

Never leave a key unrestricted. For every key, explicitly specify which APIs it can access:

```bash
gcloud services api-keys update KEY_ID \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=translate.googleapis.com
```

This ensures that even if someone enables Gemini on the project, existing keys won't automatically gain access to it.

### 3. Separate Projects by Risk Level

Stop using a single GCP project for everything. At minimum, maintain separate projects for:

| Project | Contains | Risk Level |
|---------|----------|------------|
| `myapp-public` | Maps, Translate, other client-facing APIs | Low (keys expected to be public) |
| `myapp-ai` | Gemini, Vertex AI, AI Platform | High (keys must never be public) |
| `myapp-data` | BigQuery, Cloud Storage, Firestore | High (contains customer data) |
| `myapp-infra` | Compute, Networking, IAM | Critical (infrastructure control) |

This is the single most effective mitigation. Even if a client-side key leaks from `myapp-public`, it can't reach Gemini because Gemini isn't enabled on that project.

### 4. Add API Enablement to Your Change Management Process

Enabling an API should trigger the same review as modifying IAM policies. Before enabling any new API on a project, ask:

- What existing keys have access to this project?
- Are any of those keys embedded in client-side code or mobile apps?
- Does this API access data that's more sensitive than what existing keys were designed for?

### 5. Monitor API Key Usage

Set up alerts for unexpected API usage patterns:

```bash
gcloud logging read 'resource.type="api_keys" AND protoPayload.methodName="google.api.apikeys.v2.ApiKeys.LookupKey"' \
  --project=YOUR_PROJECT_ID \
  --limit=50
```

Better yet, use Cloud Monitoring to alert when any key makes calls to an API it hasn't historically accessed. A Maps key suddenly calling Gemini endpoints is a clear signal.

### 6. Rotate Client-Side Keys Regularly

Keys embedded in client-side code should be treated as semi-public. Rotate them on a schedule (quarterly at minimum) and automate the process. If you're not sure how to build rotation into your deployment pipeline, the [secrets management guide](/blog/secrets-management-developers/) covers the dual-secret pattern for zero-downtime rotation.

## The Compliance Dimension

For teams operating under SOC 2, ISO 27001, or the EU AI Act, this exposure has specific compliance implications:

**SOC 2 (CC6.1 - Logical Access Controls):** Your controls need to demonstrate that access to AI services is intentionally granted, not inherited by default. An auditor finding unrestricted API keys on a project with Gemini enabled will flag this as a control gap.

**ISO 27001 (A.9.4 - System and Application Access Control):** The principle of least privilege applies to API keys just as it applies to user accounts. Keys scoped to Maps that also access Gemini violate this control.

**EU AI Act (Article 15 - Accuracy, Robustness, and Cybersecurity):** If you're deploying a high-risk AI system, you're required to ensure it's resilient against unauthorized access. Exposed API keys that authenticate to your AI endpoints are a direct cybersecurity gap under this article.

The pattern of [data poisoning through compromised inputs](/blog/ai-training-data-poisoning/) gets more dangerous when attackers can access your AI infrastructure directly. If an attacker can reach your Gemini endpoints through a leaked key, they can potentially poison cached context, manipulate file uploads, or extract training data - all without ever touching your application layer.

## Google's Response and What's Missing

Google has acknowledged the issue, stating they've "implemented proactive measures to detect and block leaked API keys attempting Gemini API access." That's a start, but it doesn't solve the structural problem. Detection after the fact is a safety net, not a fix.

What would actually fix this:

- **Default-deny for new API enablement:** When a new API is enabled on a project, existing keys should not automatically gain access. Teams should have to explicitly grant each key access to the new API.
- **Client-side key warnings:** If a key is configured with referrer restrictions (indicating client-side use), enabling a sensitive API like Gemini should trigger a warning or require confirmation.
- **Scope drift alerts:** GCP should notify project owners when the effective scope of existing keys changes due to API enablement.

Until Google implements these changes, the responsibility falls on your team. The good news is that the mitigations are straightforward - project separation, key restriction, and change management for API enablement. The bad news is that most teams haven't done any of them yet.

## The Bigger Picture for AI Builders

This incident is a preview of a broader pattern. As AI capabilities get added to every major cloud platform, the attack surface of existing infrastructure expands. Every unrestricted credential, every overly permissive IAM role, every shared project becomes a potential entry point to AI services that handle sensitive data.

The teams that will navigate this well are the ones treating AI service integration as a security event, not just a feature toggle. Enabling Gemini on a project isn't the same as enabling a logging library. It's adding a service that can access, process, and generate content based on your data. That deserves the same scrutiny as adding a new database or opening a new network path.

If you're building with AI right now, take 30 minutes this week to audit your GCP projects. Check your API keys. Separate your projects by risk level. Add API enablement to your change management process. The next time someone on your team enables a new AI API, you'll know exactly what credentials can reach it - and you'll have made sure the answer is "only the ones that should."

---

**Keep reading:**
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)
- [AI Training Data Poisoning: When Your LLM Can't Tell Fact From Fiction](/blog/ai-training-data-poisoning/)
- [Audit-Ready LLM Architecture](/blog/audit-ready-llm-architecture/)

*Building AI features and not sure if your cloud security posture is keeping up? [Let's talk](https://calendly.com/juanidrovo).*
