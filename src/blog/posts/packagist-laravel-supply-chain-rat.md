---
title: "Fake Laravel Packages on Packagist Show Supply Chain Attacks Have Evolved Past Typosquatting"
description: "Malicious Packagist packages used dependency chaining to deploy a cross-platform RAT. What developers and CTOs need to know about modern supply chain defense."
date: 2026-03-04
lastModified: 2026-03-04
tags:
  - posts
  - security
  - supply-chain
  - engineering
  - startups
---

A developer installs a Swagger documentation helper for their Laravel project. The package name looks legitimate. The code inside looks clean. But buried in a transitive dependency that Composer pulls in automatically, there's a remote access trojan waiting to phone home to a command-and-control server.

That's exactly what happened this week. Security researchers at Socket discovered three malicious packages on Packagist - PHP's central package registry - masquerading as Laravel utilities. The packages had innocuous names like `nhattuanbl/lara-helper`, `nhattuanbl/simple-queue`, and `nhattuanbl/lara-swagger`. Combined, they racked up over 100 downloads before being flagged.

The download numbers look small. But the technique they used is what makes this story worth paying attention to.

## Dependency Chaining Is the New Typosquatting

Most developers have heard of typosquatting - publishing `lod-ash` hoping someone misspells `lodash`. Registry maintainers have gotten better at catching these. Automated scanners flag names that are too close to popular packages, and developers are more cautious.

The Packagist attackers skipped that playbook entirely. Instead, they published `lara-swagger`, a package that contained zero malicious code. It looked like a legitimate Swagger integration. But its `composer.json` listed `lara-helper` as a dependency. When Composer resolved the dependency tree, it silently pulled in the trojan.

This is dependency chaining: using a clean-looking package as a delivery mechanism for a malicious one buried deeper in the dependency graph. The developer never sees the malicious package in their `require` block. It just shows up in `vendor/` after `composer install`.

The attacker also published three additional clean packages - `lara-media`, `snooze`, and `syslog` - to build credibility on the account. A profile with six packages looks more legitimate than one with a single suspicious upload.

## What the RAT Actually Does

The payload lived in a file called `src/helper.php` inside `lara-helper`. On installation, it established a persistent connection to `helper.leuleu[.]net` on port 2096 and supported a full menu of remote access commands:

| Command | Capability |
|---------|-----------|
| `ping` | Heartbeat to confirm the implant is alive |
| `info` | System reconnaissance - OS, hostname, user context |
| `cmd` | Shell execution (PowerShell on Windows, shell on Linux/macOS) |
| `screenshot` | Capture screen contents |
| `download/upload` | Exfiltrate or stage files |
| `close` | Terminate the socket connection |

The RAT worked across Windows, macOS, and Linux. It ran with the same permissions as the web application, which means it had direct access to everything your Laravel app could touch: database credentials, API keys, environment variables, session tokens, and the filesystem.

The payload used control flow obfuscation, encoded domain names and command identifiers, and randomized variable names to avoid static analysis. This isn't a script kiddie pasting code from a tutorial. It's a deliberate, multi-stage attack designed to evade automated scanning.

## Why Composer and Packagist Are Particularly Vulnerable

npm gets most of the supply chain attack headlines, but PHP's ecosystem has structural characteristics that make these attacks effective:

**No lockfile enforcement by default.** While `composer.lock` exists, many teams run `composer update` in CI/CD pipelines or don't commit their lockfile. Every `composer update` re-resolves the dependency tree and can pull in new transitive dependencies.

**Packagist doesn't require 2FA.** Account takeover of legitimate maintainers is a known vector. The attacker here created a fresh account, but the lack of mandatory 2FA across the ecosystem means hijacking established accounts remains viable.

**No package signing.** Unlike npm's provenance attestations or Python's Trusted Publishers, Packagist has no built-in mechanism for verifying that a package was built from a specific source repository by a verified author.

**Transitive dependency visibility is poor.** `composer show --tree` exists but few developers run it regularly. Most teams don't audit what gets pulled into `vendor/` beyond their direct dependencies.

## The Compliance Angle: SOC 2 and ISO 27001 Care About This

If you're working toward SOC 2 or ISO 27001, supply chain attacks aren't just a security concern - they're a compliance gap waiting to be flagged.

SOC 2's Common Criteria CC7.1 requires organizations to identify and respond to changes in their environment, including third-party components. If a malicious package enters your dependency tree and you have no process to detect it, that's a control failure.

ISO 27001 Annex A.8.28 (Secure coding) and A.15 (Supplier relationships) both expect documented procedures for evaluating and monitoring third-party software. "We trust Packagist" is not a documented procedure.

For startups pursuing compliance certifications, the practical implication is clear: you need automated dependency scanning in your CI/CD pipeline, and you need it before your auditor asks for it. I covered exactly how to set this up - including free tools - in my [CI/CD security pipeline guide](/blog/cicd-security-pipeline/). The dependency review job described there would have caught a new, unvetted transitive dependency before it reached production.

## What to Do Right Now

If you're a developer, CTO, or founder running Laravel (or any PHP project), here's a concrete checklist:

### 1. Audit Your Current Dependencies

Run `composer show --tree` and actually look at your transitive dependencies. If you see packages from authors you don't recognize, investigate them.

```bash
# List all installed packages with their dependencies
composer show --tree

# Check for known vulnerabilities
composer audit
```

### 2. Lock Down Your Lockfile

Commit `composer.lock` to version control. In CI/CD, use `composer install` (which respects the lockfile) instead of `composer update` (which re-resolves everything).

```bash
# CI/CD: install from lockfile only
composer install --no-dev --prefer-dist
```

### 3. Add Dependency Review to Your Pipeline

If you're using GitHub Actions, the [dependency review action](https://github.com/actions/dependency-review-action) can block PRs that introduce packages with known vulnerabilities or suspicious characteristics. This is the single highest-leverage security control you can add to a PHP project today.

For a complete pipeline setup including dependency scanning, secret detection, and SAST, see our [CI/CD security pipeline walkthrough](/blog/cicd-security-pipeline/).

### 4. Pin Dependencies to Exact Versions

In `composer.json`, use exact version constraints for critical packages instead of ranges:

```json
{
    "require": {
        "laravel/framework": "11.43.2",
        "vendor/package": "2.1.0"
    }
}
```

Version ranges like `^11.0` are convenient but let Composer resolve to newer versions - including potentially compromised releases.

### 5. Rotate Secrets If You Were Affected

If you installed any package from the `nhattuanbl` account, assume full compromise. The RAT had access to your application's environment, which means every secret in your `.env` file, every database credential, and every API key your app uses may have been exfiltrated.

Follow a structured rotation process. Don't just change passwords - revoke and reissue API keys, rotate database credentials, invalidate sessions, and audit outbound network traffic for connections to `helper.leuleu[.]net`. I've written a [complete secrets management guide](/blog/secrets-management-developers/) that includes an incident response playbook for exactly this scenario.

### 6. Monitor Outbound Traffic

Add network-level monitoring for unexpected outbound connections from your application servers. The C2 server used port 2096, which is unusual for web traffic. Egress filtering - allowing only expected outbound connections - would have blocked the RAT's communication channel entirely.

## AI Is Making This Worse (and Better)

There's an emerging dimension to supply chain attacks that most coverage misses: AI-assisted package generation. Large language models can generate plausible-looking packages with realistic READMEs, docblocks, and even unit tests. The social engineering aspect of publishing credible-looking packages is getting cheaper.

At the same time, AI is improving defense. Socket (the company that caught this attack) uses machine learning to analyze package behavior - looking for patterns like obfuscated code, network connections in install scripts, and dependency graph anomalies. Traditional signature-based scanning would have missed the clean `lara-swagger` package entirely. Only behavioral analysis of the full dependency chain caught the hidden RAT.

For teams building AI into their development workflows, this creates an important principle: treat AI-suggested dependencies with the same scrutiny as AI-generated code. If your coding assistant recommends a package you haven't heard of, verify it before adding it. Check the author's profile, the repository's history, and the download count relative to the package's age.

## The Bigger Picture: Your Dependency Tree Is Your Attack Surface

This Packagist incident is a data point in a larger trend. The [tj-actions/changed-files compromise](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-attack) in March 2025 hit 23,000 GitHub repositories through a poisoned GitHub Action. The [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) showed how attackers target abandoned packages with high download counts. The [xz utils backdoor](https://tukaani.org/xz-backdoor/) demonstrated that even core infrastructure maintainers can be socially engineered over years.

What connects all of these is a fundamental reality: modern applications are mostly other people's code. A typical Laravel project pulls in 100+ packages. Each one is a trust decision. And as I wrote in our [security-first development guide](/blog/security-first-development-guide/), the cheapest time to catch a malicious dependency is before it enters your codebase - not after your SOC analyst spots suspicious traffic six months later.

Supply chain security isn't a checkbox. It's a practice. Pin your versions, audit your trees, scan your pipelines, and assume that someone is trying to sneak something into your `vendor/` directory. Because as this week proved, someone is.

---

**Keep reading:**
- [CI/CD Security Pipeline: How to Automate Security Checks Before Code Reaches Production](/blog/cicd-security-pipeline/)
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)
- [Security-First Development: A Practical Guide That Will Save You Months](/blog/security-first-development-guide/)

*Need help hardening your dependency pipeline or preparing for a compliance audit? [Let's talk](https://calendly.com/juanidrovo).*
