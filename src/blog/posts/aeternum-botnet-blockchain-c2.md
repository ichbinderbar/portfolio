---
title: "Aeternum C2: When Botnets Move to the Blockchain, Your Takedown Playbook Breaks"
description: "The Aeternum botnet stores encrypted C2 commands on Polygon smart contracts. Here's why blockchain-based C2 changes the threat model and what security teams should do now."
date: 2026-03-04
lastModified: 2026-03-04
tags:
  - posts
  - security
  - engineering
  - startups
---

A botnet that costs a dollar to operate, can't be taken down by law enforcement, and survives every server seizure in the playbook. That's not a hypothetical. That's Aeternum C2, and it's been advertised on underground forums since December 2025.

I've spent years helping teams build [security into their development workflows from day one](/blog/security-first-development-guide/). Most of that work focuses on what you control: your code, your pipelines, your secrets. But Aeternum represents a shift in the threat landscape that makes even solid defensive postures harder to maintain. When the attacker's infrastructure lives on a public blockchain, replicated across thousands of nodes, the traditional incident response assumption that you can "take down the C2 server" simply doesn't apply anymore.

## What Aeternum Actually Does

Aeternum C2 is a botnet loader first identified by Outpost24's KrakenLabs team. The threat actor behind it, tracked as LenAI, started advertising the malware on underground forums in late 2025. Researchers at Qrator Labs and Ctrl Alt Intel published detailed technical analyses shortly after.

Here's the architecture in plain terms:

1. **Smart contract deployment.** The operator deploys a smart contract to the Polygon blockchain (a Layer 2 Ethereum network). This contract contains functions that return encrypted commands when called.

2. **Command writing.** Through a Next.js-based web panel, the operator writes commands as blockchain transactions. These get confirmed on-chain and become permanent. Commands can target all infected machines or specific endpoints.

3. **Command retrieval.** Infected machines query public RPC endpoints to read the smart contract. They decrypt the commands locally and execute whatever payload the operator specified.

4. **Payload delivery.** The botnet supports clippers (cryptocurrency address swapping), info-stealers, RATs (remote access trojans), and cryptocurrency miners. The operator picks the payload type and URL through the panel.

The key insight: once a command is written to the Polygon blockchain, it's replicated across thousands of validator nodes. There's no single server to seize, no domain to sinkhole, no hosting provider to pressure. The commands are immutable and publicly accessible.

## The Economics Are Alarming

What struck me most about Aeternum isn't the blockchain angle alone. It's how cheap and accessible the whole operation is.

| Component | Cost |
|-----------|------|
| Panel access + configured build | $200 |
| Full C++ codebase + updates | $4,000 |
| Entire toolkit with resale rights | $10,000 |
| Operating 100-150 command transactions | ~$1 in MATIC |
| Traditional C2 server hosting (monthly) | $50-500+ |
| Bulletproof hosting (monthly) | $200-2,000+ |

Compare that last row to the Aeternum model. Traditional botnets need bulletproof hosting, domain rotation, fast-flux DNS, or Tor hidden services. All of those have ongoing costs and operational overhead. All of them can be disrupted. Aeternum's operator needs a crypto wallet and about a dollar's worth of MATIC tokens to issue over a hundred commands.

The barrier to entry for running a resilient, takedown-resistant botnet just dropped to the cost of a coffee.

## Why Traditional Defenses Fall Short

Most incident response playbooks assume that botnet takedowns follow a pattern: identify the C2 infrastructure, coordinate with hosting providers or registrars, and sinkhole or seize the servers. This model has worked reasonably well against centralized C2, and it's been used successfully against major botnets like Emotet, TrickBot, and QakBot.

Blockchain-based C2 breaks every step of that model:

**No servers to seize.** There's no hosting provider to subpoena. The Polygon network is a public, permissionless blockchain maintained by thousands of independent validators worldwide.

**No domains to sinkhole.** Infected machines connect through public RPC endpoints (like Infura, Alchemy, or any Polygon node). Blocking one endpoint doesn't help when dozens of alternatives exist.

**Immutable commands.** Once written to the blockchain, commands can't be altered or removed by anyone other than the wallet holder. Even if the operator loses access to the panel, previously issued commands remain permanently available on-chain.

**Transparent but encrypted.** Anyone can read the raw blockchain transactions, but the command payloads are encrypted. Researchers can see that commands were issued, but decrypting them requires access to the malware's encryption keys.

This isn't entirely new. Glupteba used Bitcoin blockchain transactions as a backup C2 mechanism to recover server addresses if its primary infrastructure went down. But Aeternum takes it further by making the blockchain the primary and only C2 channel. There's no fallback infrastructure to target because the blockchain is the infrastructure.

## The Anti-Analysis Layer

Aeternum doesn't just innovate on infrastructure. It also ships with features designed to extend the lifespan of each deployed build:

**Virtual machine detection.** The loader checks for virtualized environments commonly used by malware analysts and automated sandboxes. If it detects a VM, it can alter its behavior or refuse to execute, making dynamic analysis harder.

**Pre-deployment AV scanning.** The toolkit integrates with Kleenscan (a multi-scanner service similar to VirusTotal, but designed for malware authors). Operators can test their builds against multiple antivirus engines before deployment, ensuring their payloads evade detection at launch time.

These aren't groundbreaking techniques individually. But combined with takedown-resistant infrastructure, they create a threat that's both harder to detect and harder to disrupt once detected.

## What This Means for Your Security Posture

If you're building software, managing infrastructure, or responsible for security at a startup or growing company, Aeternum should change how you think about a few things.

### 1. Assume C2 Infrastructure Is Persistent

Your threat models probably assume that botnet infections have a limited lifespan because C2 servers eventually get taken down. With blockchain-based C2, that assumption breaks. An infected endpoint could remain under attacker control indefinitely, receiving new commands from an immutable source that nobody can shut down.

**What to do:** Shift your detection focus from C2 takedown to endpoint-level detection. Monitor for unusual RPC calls to blockchain endpoints (Polygon, Ethereum, etc.) from machines that have no business interacting with Web3 infrastructure. If your development workstations or CI/CD runners are making calls to Polygon RPC endpoints, that's a red flag.

### 2. Secrets Are the Primary Target

Aeternum deploys info-stealers as one of its core payload types. Once a machine is compromised, every secret on that system is at risk: API keys, database credentials, cloud provider tokens, signing keys, session tokens.

This is where [secrets management hygiene](/blog/secrets-management-developers/) becomes critical. If your secrets live in `.env` files on developer machines, a single Aeternum infection means full credential compromise. If you're using runtime secret injection from a vault with short-lived tokens and automatic rotation, the blast radius shrinks dramatically.

**What to do:** Audit where your secrets actually live right now. Not where they're supposed to live according to your documentation, but where they actually are. Check developer machines, CI/CD environment variables, Docker build args, and local config files. The 2024 GitGuardian report found 23.8 million secrets leaked on GitHub alone, and 60% were exploited within 12 hours. Aeternum's info-stealers make local secret theft just as dangerous.

### 3. Your CI/CD Pipeline Is Both Shield and Target

Here's what keeps me up at night about a botnet like Aeternum targeting development environments. If a developer's machine gets compromised, the attacker potentially gains access to:

- Source code repositories
- CI/CD pipeline credentials
- Cloud deployment keys
- Package registry tokens
- Code signing certificates

A compromised developer machine could inject malicious code that passes through your entire [CI/CD security pipeline](/blog/cicd-security-pipeline/) if the attacker is careful enough. This is especially true if your pipeline doesn't verify the integrity of build artifacts or if secrets are accessible at build time rather than injected at runtime.

**What to do:** Implement pipeline hardening with artifact attestation (GitHub's Artifact Attestations or Sigstore for SLSA compliance), pin your CI/CD action dependencies to SHA hashes instead of tags, and ensure your security scanning actually runs on every commit, not just on main branch merges.

### 4. Network Monitoring Needs a Web3 Awareness Upgrade

Most network monitoring tools and SIEM rules aren't configured to flag blockchain RPC traffic as suspicious. Polygon RPC calls use standard HTTPS on port 443, making them blend in with normal web traffic. The actual data is JSON-RPC formatted, which looks like any other API call on the wire.

**What to do:** Add detection rules for known public RPC endpoints. Services like Infura, Alchemy, QuickNode, and direct Polygon RPC URLs (rpc.polygon.technology, polygon-rpc.com) should be flagged when accessed from endpoints that don't have a legitimate Web3 use case. This won't catch everything (operators can run their own nodes), but it raises the bar.

### 5. Endpoint Hardening Becomes Non-Negotiable

Aeternum's VM detection means it's specifically designed to evade sandbox analysis. Your first line of defense has to be preventing the initial infection, because post-infection detection and C2 disruption are both harder with this architecture.

**What to do:** Enforce application whitelisting on critical systems. Keep endpoint detection and response (EDR) tools updated. Disable unnecessary browser extensions, which are a common initial infection vector. And treat developer workstations as high-value targets - because they are.

## The Bigger Picture: Blockchain as Attacker Infrastructure

Aeternum isn't an isolated experiment. It's a proof of concept that's already being sold commercially. The threat actor behind it (LenAI) also operates ErrTraffic, a crimeware platform that automates ClickFix social engineering attacks through fake error messages on compromised websites. This is someone building a full-service attack platform, not a one-off tool.

The blockchain C2 model will be copied. The economics are too favorable and the resilience is too high for other threat actors to ignore. We should expect to see:

- **More chains targeted.** Polygon is cheap and fast, but Ethereum, Solana, Base, Arbitrum, and other chains could serve the same purpose.
- **Encrypted data in NFT metadata.** Smart contract storage isn't the only on-chain data structure. NFT metadata, event logs, and even transaction memo fields could carry encoded commands.
- **Decentralized storage integration.** IPFS, Arweave, or Filecoin could host encrypted payloads, with blockchain transactions pointing to the content addresses.
- **DeFi integration for automated payment.** Operators could use smart contracts to automatically distribute funds, making financial tracking harder.

The security community and blockchain ecosystem will need to collaborate on new detection and response models. On-chain analytics firms (Chainalysis, Elliptic, TRM Labs) already track illicit cryptocurrency flows. Extending that analysis to identify C2 smart contracts is a natural next step, but it requires new tooling and new partnerships.

## Practical Checklist: Hardening Against Blockchain-Based C2

Here's a condensed action list you can take to your team today:

**Endpoint layer:**
- Deploy and maintain EDR on all developer workstations and build servers
- Enable application whitelisting on CI/CD runners
- Implement hardware security keys for critical system access
- Run regular malware scans on development machines (not just servers)

**Network layer:**
- Add SIEM rules for blockchain RPC endpoint access from non-Web3 systems
- Monitor for unusual outbound HTTPS patterns to known RPC providers
- Flag JSON-RPC traffic patterns from unexpected sources
- Consider DNS filtering for known Polygon/Ethereum RPC domains on corporate networks

**Secrets layer:**
- Move from file-based secrets to runtime injection from a vault
- Implement automatic secret rotation with short TTLs
- Use the dual-secret pattern for zero-downtime rotation
- Run secret scanning in pre-commit hooks and CI (TruffleHog, Gitleaks)
- Audit for secrets in Docker build args, environment variables, and local configs

**Pipeline layer:**
- Pin all CI/CD dependencies to SHA hashes
- Implement artifact attestation for build provenance
- Ensure security scanning runs on every PR, not just main
- Use environment protection rules for deployment gates
- Require CODEOWNERS review for security-critical paths

**Incident response:**
- Update playbooks to account for persistent, non-disruptable C2
- Plan for scenarios where C2 takedown is not an option
- Focus on endpoint isolation and credential rotation as primary response actions
- Establish relationships with on-chain analytics firms for threat intelligence

## Don't Wait for the Next Evolution

Aeternum C2 is a clear signal that botnet infrastructure is evolving faster than most defensive playbooks. The combination of blockchain immutability, negligible operating costs, and commercial availability means this approach will proliferate.

The good news: the defenses that matter most are things you should already be doing. Strong secrets management, hardened CI/CD pipelines, endpoint detection, and network monitoring aren't new concepts. But Aeternum raises the stakes on all of them by removing the safety net of "we can just take down the C2 server."

If your security posture relies on the assumption that threats have a shelf life, it's time to update that assumption.

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)
- [CI/CD Security Pipeline: Automate Security Checks Before Code Reaches Production](/blog/cicd-security-pipeline/)

*Building a security-hardened development environment and need help prioritizing what to tackle first? [Let's talk](https://calendly.com/juanidrovo).*
