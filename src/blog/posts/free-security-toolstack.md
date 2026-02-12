---
title: "The Free Security Toolstack: Every Security Tool You Need for $0"
description: "Build a complete security pipeline for $0 with free tools for SAST, SCA, DAST, secrets detection, containers, IaC, and monitoring."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - tools
---

GitHub Advanced Security costs $49 per committer per month. For a team of ten developers, that is $5,880 per year, and it only covers SAST (via CodeQL), secret scanning, and dependency review. It does not include DAST, container scanning, IaC auditing, penetration testing, or monitoring.

Here is what most teams do not realize: you can build a security toolstack that covers every one of those categories for exactly $0. The tools are open source, actively maintained, and used in production by organizations ranging from solo developers to Fortune 100 companies. Some of them are better than their paid alternatives.

This guide covers every category of security tooling you need, recommends the best free option in each, and shows you how to install and configure them. By the end, you will have a complete [CI/CD security pipeline](/blog/cicd-security-pipeline/) that catches vulnerabilities across your entire stack without spending a dollar on licensing.

## Why Free Tools Are Good Enough

The common assumption is that free security tools are inferior to commercial alternatives. That assumption is wrong in most cases, and here is why.

Open-source security tools like Trivy, ZAP, and Semgrep are maintained by dedicated security companies (Aqua Security, Checkmarx, and Semgrep Inc. respectively) who offer commercial products built on top of the free tools. The free versions are not abandoned side projects. They are the core engines that power the paid platforms. The commercial layer adds dashboards, team management, and enterprise support, but the scanning engines themselves are identical.

The second factor is community. Trivy has thousands of contributors. Nuclei has 6,500+ community-maintained vulnerability templates. Checkov ships with 750+ built-in security policies. These numbers represent a collective security intelligence that no single vendor can match.

The trade-off is real but manageable: free tools require more setup time, more configuration, and more operational knowledge. You are your own support team. But the detection capabilities are world-class, and for any team building on a budget, the ROI is unbeatable.

There is also a strategic advantage to using open-source security tools: no vendor lock-in. If Semgrep changes its licensing (which they did in December 2024, prompting the Opengrep fork), you can switch to an alternative without losing your security coverage. If your commercial SAST vendor doubles their pricing, you are stuck unless you want to re-integrate an entirely new tool. With open-source tools, the switching cost is a configuration file change.

## SAST: Static Application Security Testing

Static analysis scans your source code for vulnerabilities without executing it. It catches injection flaws, hardcoded credentials, insecure cryptography, and hundreds of other patterns. If you read the [security-first development guide](/blog/security-first-development-guide/), you know this is the first layer of defense in your CI/CD pipeline.

### Top Pick: Semgrep Community Edition

Semgrep is a lightweight static analysis tool that supports 30+ languages and ships with 2,800+ community rules. It runs locally, in CI, or as a pre-commit hook. The rules are written in a pattern syntax that looks like source code, which makes them readable and customizable.

**What it catches:** OWASP Top 10 vulnerabilities, injection flaws, XSS, hardcoded credentials, insecure crypto, and framework-specific issues.

**License:** Engine is LGPL 2.1. Rules are under the Semgrep Rules License v1.0 (free for internal use).

**Setup:**

```bash
# Install
pip install semgrep

# Run with auto-config (picks rules based on your project)
semgrep --config auto .

# Run with specific rulesets
semgrep --config p/owasp-top-ten .
semgrep --config p/javascript .
```

**GitHub Actions integration:**

```yaml
name: Semgrep
on: [push, pull_request]
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/javascript
```

**Limitation:** The free Community Edition analyzes one file at a time. It cannot trace data flows across function or file boundaries. The Pro engine (free for up to 10 contributors) unlocks cross-file analysis.

### Alternatives

| Tool | License | Languages | Best For |
|---|---|---|---|
| SonarQube Community Build | LGPL v3 | 16+ (Java, JS, TS, Python, Go, C#, PHP, more) | Teams wanting a self-hosted dashboard with code quality metrics |
| CodeQL | MIT (libraries), proprietary CLI | C/C++, C#, Go, Java, JS/TS, Python, Ruby, Rust, Swift | Public repos on GitHub (100% free). Private repos require GitHub Code Security ($30/committer/month) |
| Bearer CLI | Elastic License 2.0 | Go, Java, JS, TS, PHP, Python, Ruby | Privacy-focused scanning (GDPR/HIPAA data flow tracking) |

SonarQube Community Build is a strong choice if you want a centralized dashboard. Deploy it with Docker in five minutes:

```yaml
# docker-compose.yml
services:
  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
volumes:
  sonarqube_data:
```

CodeQL is arguably the most powerful free SAST tool available, but it is only free for public repositories. If your code is open source and hosted on GitHub, enable it immediately. For private repos, you will need GitHub Code Security at $30 per active committer per month, which is cheaper than GitHub Advanced Security's old $49 pricing but still not free.

## SCA: Software Composition Analysis

Your dependencies have vulnerabilities. The average JavaScript project pulls in hundreds of transitive dependencies, and each one is a potential attack surface. SCA tools scan your dependency tree against vulnerability databases and tell you what needs updating.

### Top Pick: Trivy

Trivy is the Swiss Army knife of security scanning. It handles SCA, container scanning, IaC scanning, secrets detection, and SBOM generation in a single binary. For dependency scanning specifically, it covers OS packages and language-specific dependencies across every major ecosystem.

**What it catches:** Known CVEs in direct and transitive dependencies across npm, pip, Maven, Go, Cargo, Composer, Bundler, NuGet, and more.

**License:** Apache 2.0. Fully open source with no feature restrictions.

**Setup:**

```bash
# Install
brew install trivy

# Scan current directory for dependency vulnerabilities
trivy fs .

# Scan with severity filter
trivy fs --severity CRITICAL,HIGH .

# Output as JSON for CI processing
trivy fs --format json --output results.json .
```

**GitHub Actions integration:**

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    scan-ref: '.'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### Alternatives

| Tool | License | Ecosystems | Best For |
|---|---|---|---|
| Dependabot | Proprietary (GitHub) | 30+ | GitHub users who want automatic PR updates. Free for all repos |
| Grype | Apache 2.0 | OS + language packages | Container-focused SCA, pairs with Syft for SBOM |
| npm audit | Free (built-in) | npm only | Zero-config for Node.js projects (runs on every `npm install`) |
| pip-audit | Apache 2.0 | Python only | Python projects. Auto-fix with `pip-audit --fix` |
| Snyk Free | Proprietary | Multi-language | 400 SCA tests/month free, useful as a secondary scanner |

Dependabot deserves special mention because it is completely free on GitHub and requires almost zero setup. Add this file to your repository and you are done:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

Over 846,000 repositories have Dependabot configured, with 137% year-over-year adoption growth. It draws from the GitHub Advisory Database with 28,000+ reviewed advisories.

For comprehensive coverage, run Trivy in CI for vulnerability detection and enable Dependabot for automated dependency updates. They serve complementary purposes: Trivy fails your build when critical vulnerabilities are present, while Dependabot opens pull requests to fix them. Together they ensure that vulnerabilities are both detected and remediated.

The Snyk free plan is worth mentioning as a secondary scanner. With 400 SCA tests, 100 SAST tests, 300 IaC tests, and 100 container tests per month, it is too limited for primary use but valuable as a second opinion. Different tools use different vulnerability databases and detection heuristics, so running two scanners catches more than running one. Tests on public (open-source) projects do not count against Snyk's free limits.

## DAST: Dynamic Application Security Testing

DAST tools attack your running application from the outside, the same way a real attacker would. They find vulnerabilities that static analysis misses: runtime misconfigurations, authentication bypasses, and issues that only manifest when the application is running.

### Top Pick: ZAP

ZAP (formerly OWASP ZAP, now maintained by Checkmarx) is the industry standard for free web application security testing. It has been the go-to DAST tool for over a decade, and in September 2024 Checkmarx hired all three project leaders and committed to keeping it free and open source forever.

**What it catches:** XSS, SQL injection, CSRF, directory traversal, broken authentication, insecure headers, and dozens of other [OWASP Top 10](/blog/owasp-top-10-practice/) vulnerability categories.

**License:** Apache 2.0. No paid tiers, no feature restrictions.

**Setup:**

```bash
# Run ZAP baseline scan against your staging URL
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://your-staging-site.com

# Full active scan (more aggressive, takes longer)
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
  -t https://your-staging-site.com
```

**GitHub Actions integration:**

```yaml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.14.0
  with:
    target: 'https://your-staging-site.com'
    fail_action: true
```

ZAP ships with an AJAX spider that uses a headless browser to crawl JavaScript-heavy applications, and an active scanner that fires real attack payloads at discovered endpoints. Version 2.17.0 shipped in December 2025 with 14,700+ GitHub stars and 229+ contributors.

The distinction between the baseline scan and the full scan matters. The baseline scan is passive: it spiders your application and checks for issues without sending attack payloads. This is safe to run against production. The full scan is active: it sends malicious inputs to test how your application handles them. Run that against staging only, never against production, because it can modify data, trigger alerts, and potentially cause denial of service on vulnerable endpoints.

### Alternatives

| Tool | License | Type | Best For |
|---|---|---|---|
| Nuclei | MIT | Template-based scanner | Infrastructure scanning, API testing, network services. 6,500+ templates |
| Nikto | GPLv3 | Web server scanner | Quick web server configuration audits (8,000+ checks) |

Nuclei is the complement to ZAP. Where ZAP focuses on web application vulnerabilities, Nuclei excels at infrastructure scanning. It supports HTTP, DNS, TCP, SSL, and WebSocket protocols, and its 6,500+ community templates cover known CVEs, misconfigurations, exposed panels, and default credentials. It even supports AI-powered template generation with the `-ai` flag.

```bash
# Install Nuclei
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Scan a target with all templates
nuclei -u https://your-site.com

# Scan with specific template categories
nuclei -u https://your-site.com -tags cve,misconfig
```

## Secrets Detection

A single leaked API key can compromise your entire infrastructure. Once a secret is committed to Git, it lives in the repository history forever unless you rewrite the entire history. Prevention is the only practical strategy, and it starts with pre-commit scanning.

### Top Pick: TruffleHog

TruffleHog has 700+ credential detectors that support active verification. That last part is critical: TruffleHog does not just pattern-match. It actually calls APIs to confirm whether a detected credential is live. This dramatically reduces false positives compared to tools that rely solely on regex and entropy.

**What it catches:** API keys, tokens, passwords, private keys, and cloud credentials across 800+ secret types. Scans Git repos, Docker images, filesystems, S3 buckets, Slack, Jira, and more.

**License:** AGPL v3.

**Setup:**

```bash
# Install
brew install trufflehog

# Scan current Git repo
trufflehog git file://. --only-verified

# Scan entire Git history
trufflehog git file://. --since-commit HEAD~100

# Scan a GitHub org
trufflehog github --org=your-org --only-verified
```

**Pre-commit hook:**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/trufflesecurity/trufflehog
    rev: main
    hooks:
      - id: trufflehog
        name: TruffleHog
        entry: trufflehog git file://. --since-commit HEAD --only-verified --fail
```

Install the hook:

```bash
pip install pre-commit
pre-commit install
```

### Alternatives

| Tool | License | Detectors | Best For |
|---|---|---|---|
| Gitleaks | MIT | 160+ types | Lightweight scanning, easy CI integration. 19k+ GitHub stars |
| detect-secrets (Yelp) | Apache 2.0 | Heuristic-based | Enterprise baseline approach (low false positives) |
| git-secrets (AWS Labs) | Apache 2.0 | AWS-focused | AWS-heavy environments |
| GitHub Secret Scanning | Proprietary | 100+ providers | Free push protection on all public repos (enabled by default) |

GitHub's built-in secret scanning deserves mention: it blocks pushes containing secrets before they reach the repository on all public repos, at no cost, enabled by default since February 2024. For private repos, GitHub Secret Protection costs $19 per active committer per month.

For the best coverage at $0, combine TruffleHog as a pre-commit hook (catches secrets before they are committed) with Gitleaks in CI (catches anything that slips through).

## Container Security

If you ship containers, you need to scan them. Container images inherit vulnerabilities from their base images, and a single unpatched Alpine or Debian package can open a critical attack path.

### Top Pick: Trivy

Trivy is the top pick here too, because it handles container scanning alongside everything else. One tool, one vulnerability database, one CI integration.

**What it catches:** OS package CVEs, language dependency vulnerabilities in container images, Dockerfile misconfigurations, and embedded secrets.

**Setup:**

```bash
# Scan a Docker image
trivy image your-app:latest

# Scan with severity filter
trivy image --severity CRITICAL,HIGH your-app:latest

# Scan a remote image from Docker Hub
trivy image nginx:latest

# Generate an SBOM
trivy image --format spdx-json --output sbom.json your-app:latest
```

**GitHub Actions integration:**

```yaml
- name: Build Docker image
  run: docker build -t your-app:${{ github.sha }} .

- name: Scan Docker image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'your-app:${{ github.sha }}'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### Alternatives

| Tool | License | Best For |
|---|---|---|
| Grype | Apache 2.0 | Dedicated container/filesystem scanner. Pairs with Syft for SBOMs |
| Docker Scout | Proprietary | Built into Docker CLI. Free for 1 private repo + unlimited public images |
| Snyk Container | Proprietary | 100 free container tests/month. Recommends base image upgrades |

Grype is the strongest alternative if you want a tool dedicated purely to vulnerability scanning without Trivy's broader scope:

```bash
# Install Grype
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Scan a Docker image
grype your-app:latest

# Scan with SBOM from Syft
syft your-app:latest -o spdx-json > sbom.json
grype sbom:sbom.json
```

## IaC Scanning: Infrastructure as Code

If your infrastructure is defined in Terraform, CloudFormation, Kubernetes manifests, or Dockerfiles, those files can contain misconfigurations that create security vulnerabilities. An S3 bucket left public, a security group with `0.0.0.0/0` ingress, a Kubernetes pod running as root: these are all preventable with IaC scanning.

### Top Pick: Checkov

Checkov is the most comprehensive free IaC scanner available. It ships with 750+ built-in policies covering common security and compliance best practices across every major cloud provider and IaC platform.

**What it catches:** Cloud misconfigurations, compliance violations (CIS, SOC 2, HIPAA, PCI-DSS), insecure defaults, and missing encryption settings.

**License:** Apache 2.0. Fully open source, no feature restrictions.

**Platforms:** Terraform (HCL and plan JSON), CloudFormation, AWS SAM, Kubernetes YAML, Helm charts, Kustomize, Docker Compose, Dockerfile, Serverless, Bicep, OpenAPI, ARM Templates, and OpenTofu.

**Setup:**

```bash
# Install
pip install checkov

# Scan current directory
checkov -d .

# Scan specific Terraform directory
checkov -d ./infrastructure --framework terraform

# Scan a Dockerfile
checkov -f Dockerfile

# Output as JSON
checkov -d . -o json > checkov-results.json
```

**GitHub Actions integration:**

```yaml
- name: Run Checkov
  uses: bridgecrewio/checkov-action@master
  with:
    directory: .
    framework: terraform
    soft_fail: false
```

Checkov 2.0 introduced graph-based analysis, making it the first open-source tool to provide dependency-aware IaC scanning. It understands relationships between resources, not just individual resource configurations.

### Alternatives

| Tool | License | Policies | Best For |
|---|---|---|---|
| KICS (Checkmarx) | Apache 2.0 | 2,400+ Rego-based queries | Broad platform support (15+). First OSS project with CIS Level 2 Certification |
| Trivy IaC | Apache 2.0 | Incorporates all former tfsec rules | Teams already using Trivy for SCA/containers |

Note that tfsec, previously a popular Terraform scanner, has been merged into Trivy. If you are currently using tfsec, migrate to Trivy for continued support.

KICS is a strong alternative with 2,400+ security queries, and it is notably the only open-source project to achieve CIS Level 2 Certification:

```bash
# Run KICS with Docker
docker run -v $(pwd):/path checkmarx/kics:latest scan -p /path

# Using the GitHub Action
# - uses: checkmarx/kics-github-action@master
#   with:
#     path: '.'
#     fail_on: high
```

## Security Headers and SSL

Your web server configuration is part of your security posture. Missing security headers and misconfigured SSL/TLS are low-hanging fruit that attackers check first.

### Top Pick: Mozilla Observatory + SSL Labs

These are complementary tools that together provide a complete picture of your web server security.

**Mozilla Observatory** (developer.mozilla.org/en-US/observatory) analyzes 20+ HTTP security headers including HSTS, CSP, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy. It grades your site from A+ to F.

**SSL Labs** (ssllabs.com/ssltest/) by Qualys is the industry standard for SSL/TLS configuration testing. It checks protocol support, cipher suites, certificate chains, and known vulnerabilities. As of 2025, TLS 1.3 is required for an A+ grade, and HSTS is required for an A.

**Security Headers** (securityheaders.com) by Scott Helme (now part of Snyk) provides a quick-check focused specifically on HTTP response headers. Over 250 million scans conducted.

**Setup:** All three are web-based. Paste your URL and get results. No installation required.

**Automation:** SSL Labs provides a free API and an open-source CLI tool (`ssllabs-scan`) on GitHub for automated and bulk testing.

| Tool | What It Tests | Grade Range | API Available |
|---|---|---|---|
| Mozilla Observatory | HTTP security headers, basic SSL | A+ to F | Yes |
| SSL Labs | SSL/TLS configuration, cipher suites, certificates | A+ to F | Yes |
| Security Headers | HTTP response headers | A+ to F | Yes |

Run all three against your production URL after every deployment. They are free, instant, and catch different things.

## Penetration Testing

Automated scanners catch known patterns. Penetration testing finds what scanners miss: business logic flaws, authentication bypasses, and chained vulnerabilities that require human creativity to discover.

### Top Pick: ZAP + sqlmap

ZAP serves double duty as both a DAST scanner and a penetration testing platform. Its intercepting proxy, manual request editor, and fuzzer give you the core tools for manual web application testing.

sqlmap is the definitive tool for SQL injection testing. It automates the process of detecting and exploiting SQL injection flaws across every major database system.

**sqlmap setup:**

```bash
# Install
pip install sqlmap

# Test a URL parameter for SQL injection
sqlmap -u "https://target.com/page?id=1" --batch

# Test with specific database
sqlmap -u "https://target.com/page?id=1" --dbms=postgresql --batch

# Crawl and test all parameters
sqlmap -u "https://target.com/" --crawl=3 --batch
```

**sqlmap details:** Supports MySQL, PostgreSQL, Oracle, SQL Server, SQLite, MariaDB, and 10+ more databases. Six injection techniques: boolean-based blind, error-based, UNION query, time-based blind, stacked queries, and out-of-band. Latest version 1.10.2 (February 2026). License: GPLv2.

### Alternatives

| Tool | License | Type | Best For |
|---|---|---|---|
| Burp Suite Community | Proprietary freeware | Intercepting proxy | Manual web testing. No automated scanner (that is the $449/year Pro limitation) |
| Nuclei | MIT | Template scanner | Automated infrastructure pen testing with 6,500+ templates |
| Nikto | GPLv3 | Web server scanner | Quick server audits (8,000+ checks) |

Burp Suite Community Edition provides an intercepting proxy with Repeater (manual request crafting), Decoder, and Sequencer. It is the industry-standard tool for manual web application testing. The critical limitation: the Community edition has no automated scanner, no project save files, and a rate-limited Intruder. These are the features that justify Burp Pro's $449 per year price tag. For automated scanning, use ZAP instead. For manual testing, Burp Community's proxy and Repeater are excellent and free.

## Monitoring and SIEM

Detection without monitoring is incomplete. You need visibility into what is happening on your systems to catch attacks that your preventive tools miss.

### Top Pick: Wazuh

Wazuh is a full SIEM and XDR platform that costs nothing. It provides everything a commercial SIEM does: log analysis, file integrity monitoring, vulnerability assessment, configuration auditing, rootkit detection, active response, and compliance reporting.

**What it catches:** Intrusions, unauthorized file changes, malware, rootkits, misconfigurations, compliance violations, and vulnerability exposure on endpoints.

**License:** GPLv2. Fully open source with no feature restrictions. Used by Fortune 100 companies.

**Key capabilities:**

- Real-time log analysis from endpoints, firewalls, and applications
- File integrity monitoring that detects unauthorized changes to critical files
- Vulnerability assessment that correlates installed software against CVE databases
- Active response that automatically blocks threat sources
- Compliance monitoring for PCI-DSS, HIPAA, GDPR, and SOC 2
- Threat intelligence integration with AlienVault OTX, VirusTotal, and MISP

**Setup complexity:** High. Wazuh requires a server component, agents on endpoints, and OpenSearch + OpenDashboard for visualization. Docker deployment is available but still requires significant configuration. This is an investment that pays off for teams with production infrastructure to protect.

**Quick-start Docker deployment:**

```bash
# Clone Wazuh Docker deployment
git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.0
cd wazuh-docker/single-node

# Generate certificates
docker compose -f generate-indexer-certs.yml run --rm generator

# Start the stack
docker compose up -d
```

After deployment, access the Wazuh dashboard at `https://localhost:443` (default credentials: admin/SecretPassword). Then install Wazuh agents on your endpoints to start collecting security data. The dashboard provides out-of-the-box views for security events, vulnerability assessment, compliance status, and file integrity changes.

### Alternatives

| Tool | License | Type | Best For |
|---|---|---|---|
| Grafana + Loki | AGPLv3 | Log aggregation + dashboards | Teams that need centralized logging with visualization. Grafana Cloud free tier: 50GB logs |
| OSSEC | GPLv2 | Host-based intrusion detection | Lightweight HIDS. Wazuh was originally forked from OSSEC |

Grafana + Loki is the better choice if you primarily need centralized log aggregation and alerting rather than a full SIEM. Loki indexes labels rather than log contents, making it cost-effective at scale. The self-hosted stack is completely free with no data limits.

OSSEC is the lighter-weight ancestor of Wazuh. If Wazuh's setup complexity is too high, OSSEC provides file integrity monitoring, log analysis, and rootkit detection with a simpler architecture. Version 3.8.0 was released in January 2025. It supports Linux, Windows, macOS, FreeBSD, and Solaris, and has been in production at organizations worldwide for over 15 years.

For teams that do not need a full SIEM but want runtime security visibility, the minimum viable monitoring setup is Grafana + Loki for log aggregation (free self-hosted, or Grafana Cloud's free tier with 50GB of logs) combined with structured application logging and alerting on authentication failures, rate limit hits, and error spikes. This gives you the observability layer that your CI/CD security pipeline cannot provide.

## The Complete Free Pipeline

Here is how all these tools fit together in a single GitHub Actions workflow. This pipeline runs on every push and pull request, covering SAST, SCA, secrets detection, container scanning, and IaC scanning.

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten

  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy Dependency Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: TruffleHog Secrets Scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  container:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - name: Build Image
        run: docker build -t app:${{ github.sha }} .
      - name: Trivy Container Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:${{ github.sha }}'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

  iac:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Checkov IaC Scan
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          soft_fail: false
```

Add the Dependabot configuration for automated dependency updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

And the TruffleHog pre-commit hook for local development:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/trufflesecurity/trufflehog
    rev: main
    hooks:
      - id: trufflehog
        name: TruffleHog
        entry: trufflehog git file://. --since-commit HEAD --only-verified --fail
```

This pipeline catches vulnerabilities at every stage: secrets before they are committed (pre-commit), code vulnerabilities on every push (SAST), dependency vulnerabilities continuously (SCA + Dependabot), infrastructure misconfigurations (IaC), and container vulnerabilities before deployment.

## The Cost Comparison

Here is what this free stack replaces in commercial tooling:

| Category | Commercial Tool | Commercial Cost | Free Replacement |
|---|---|---|---|
| SAST + Secrets | GitHub Advanced Security | $49/committer/month | Semgrep + TruffleHog |
| SAST + Secrets (unbundled) | GitHub Code Security + Secret Protection | $30 + $19/committer/month | Semgrep + TruffleHog |
| SCA | Snyk Team | $25/developer/month | Trivy + Dependabot |
| DAST | Burp Suite Pro | $449/year per user | ZAP |
| Container | Snyk Container | Included in Team plan | Trivy |
| IaC | Bridgecrew Platform | Custom pricing | Checkov (same engine, free CLI) |
| SIEM | Splunk, Datadog Security | $1,000+/month | Wazuh |

**For a 10-person team, the commercial stack costs roughly $15,000-$30,000 per year.** The free stack costs $0 in licensing. The only cost is your time to set it up and maintain it.

The trade-off is operational overhead. Commercial tools provide managed dashboards, SSO, team management, and dedicated support. Free tools require you to configure, integrate, and maintain them yourself. For a startup or small team, that trade-off is worth it. For an enterprise with 200 developers and a compliance team, the commercial tools may justify their cost in reduced operational burden.

## The Recommended Free Stack

| Category | Tool | License | Setup Time |
|---|---|---|---|
| SAST | Semgrep Community Edition | LGPL 2.1 | 10 minutes |
| SCA | Trivy + Dependabot | Apache 2.0 / GitHub | 15 minutes |
| DAST | ZAP | Apache 2.0 | 30 minutes |
| Secrets (pre-commit) | TruffleHog | AGPL v3 | 10 minutes |
| Secrets (CI) | Gitleaks | MIT | 10 minutes |
| Container Scanning | Trivy | Apache 2.0 | 10 minutes |
| IaC Scanning | Checkov | Apache 2.0 | 15 minutes |
| Headers/SSL | Mozilla Observatory + SSL Labs | Free | 5 minutes |
| Penetration Testing | ZAP + sqlmap | Apache 2.0 / GPLv2 | 30 minutes |
| Monitoring/SIEM | Wazuh | GPLv2 | 2-4 hours |

Total setup time for the full pipeline (excluding Wazuh): approximately 2 hours. Including Wazuh: half a day. The result is a security toolstack that covers every category in the [OWASP Top 10](/blog/owasp-top-10-practice/) and beyond, at zero licensing cost.

Trivy appears three times in this table because it genuinely excels at three different jobs: SCA, container scanning, and IaC scanning. Using one tool for multiple purposes reduces the number of vulnerability databases to track, the number of CI integrations to maintain, and the number of tools your team needs to learn.

## Frequently Asked Questions

**Are free security tools reliable enough for production?**
Yes. Tools like Trivy, ZAP, and Semgrep are maintained by well-funded security companies (Aqua Security, Checkmarx, and Semgrep Inc.) and used by thousands of organizations in production. The free versions are the same scanning engines that power the commercial products. The paid tiers add dashboards and team management, not better detection.

**How does this compare to GitHub Advanced Security?**
GitHub Advanced Security costs $49 per committer per month and includes CodeQL (SAST), Dependabot (SCA), and secret scanning. The free stack described here covers those three categories plus DAST, container scanning, IaC scanning, penetration testing, and monitoring. For a 10-person team, GHAS costs $5,880 per year. The free stack covers more categories for $0.

**Which tool should I set up first?**
Start with secrets detection (TruffleHog as a pre-commit hook) because leaked credentials are the most immediately dangerous vulnerability. Then add SCA (Trivy or Dependabot) because known dependency vulnerabilities are the most common attack vector. Then SAST (Semgrep). Then everything else.

**Can I use Trivy for everything instead of multiple tools?**
Trivy covers SCA, container scanning, IaC scanning, and basic secrets detection. It does not replace a dedicated SAST tool (Semgrep finds code-level vulnerabilities that Trivy does not scan for) or a DAST tool (ZAP tests your running application). Use Trivy as your multi-purpose scanner and complement it with Semgrep for SAST and ZAP for DAST.

**What if I need to demonstrate security to enterprise customers?**
These tools generate SARIF, JSON, and other standard output formats that feed into compliance documentation. The fact that a tool is free does not make it less credible. SonarQube, ZAP, and Trivy are all referenced in OWASP guidelines and accepted as valid security controls for SOC 2 and ISO 27001 audits. What auditors care about is that you have automated security scanning, not how much you paid for it.

**Do I need monitoring if I already have CI/CD scanning?**
CI/CD scanning catches vulnerabilities before deployment. Monitoring catches attacks against your running systems. They serve different purposes and you need both. A SQL injection caught by Semgrep in CI never reaches production. A brute-force attack against your login endpoint is only visible in runtime monitoring. Wazuh or Grafana+Loki covers that runtime gap.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are free security tools reliable enough for production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Tools like Trivy, ZAP, and Semgrep are maintained by well-funded security companies and used by thousands of organizations in production. The free versions are the same scanning engines that power the commercial products. The paid tiers add dashboards and team management, not better detection."
      }
    },
    {
      "@type": "Question",
      "name": "How does this free stack compare to GitHub Advanced Security?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GitHub Advanced Security costs $49 per committer per month and includes CodeQL (SAST), Dependabot (SCA), and secret scanning. The free stack covers those three categories plus DAST, container scanning, IaC scanning, penetration testing, and monitoring, all for $0."
      }
    },
    {
      "@type": "Question",
      "name": "Which security tool should I set up first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with secrets detection (TruffleHog as a pre-commit hook) because leaked credentials are the most immediately dangerous vulnerability. Then add SCA (Trivy or Dependabot) for dependency vulnerabilities. Then SAST (Semgrep) for code-level issues. Then layer in everything else."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Trivy for everything instead of multiple tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Trivy covers SCA, container scanning, IaC scanning, and basic secrets detection. It does not replace a dedicated SAST tool like Semgrep for code-level vulnerabilities or a DAST tool like ZAP for testing running applications. Use Trivy as your multi-purpose scanner and complement it with Semgrep and ZAP."
      }
    },
    {
      "@type": "Question",
      "name": "What if I need to demonstrate security to enterprise customers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free tools generate standard output formats (SARIF, JSON) that feed into compliance documentation. SonarQube, ZAP, and Trivy are referenced in OWASP guidelines and accepted as valid security controls for SOC 2 and ISO 27001 audits. Auditors care that you have automated security scanning, not how much you paid for it."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need monitoring if I already have CI/CD scanning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. CI/CD scanning catches vulnerabilities before deployment. Monitoring catches attacks against your running systems. A SQL injection caught by Semgrep in CI never reaches production. A brute-force attack against your login endpoint is only visible in runtime monitoring. You need both layers."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [CI/CD Security Pipeline: How to Automate Security Checks](/blog/cicd-security-pipeline/)
- [OWASP Top 10 in Practice: Code Examples and Free Tools](/blog/owasp-top-10-practice/)

*Want help assembling the right security toolstack for your team? [Let's talk](https://calendly.com/juanidrovo).*
