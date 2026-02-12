---
title: "CI/CD Security Pipeline: How to Automate Security Checks Before Code Reaches Production"
description: "Build a complete CI/CD security pipeline with GitHub Actions, pre-commit hooks, and free tools that catch vulnerabilities before they ship."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - devops
---

In March 2025, the popular GitHub Action `tj-actions/changed-files` was compromised. An attacker gained access to the maintainer's account, pushed malicious code, and updated more than 350 existing Git tags to point at the compromised commit. Over 23,000 repositories that referenced this action by tag suddenly started executing code that dumped CI runner secrets to build logs. API keys, cloud credentials, deployment tokens, all exposed in plain text.

The attack worked because most of those repositories referenced the action by tag (`@v35`) instead of pinning to a specific commit SHA. A single line of YAML was the difference between being compromised and being safe.

This is the reality of modern software development. Your CI/CD pipeline is not just a convenience for running tests. It is your last automated line of defense before code reaches production, and it is also an attack surface in its own right. If you are not treating it as security infrastructure, you are leaving the door open.

This guide walks through building a complete security pipeline from scratch. Everything here is free or low-cost. You will get real YAML configurations, specific tool versions, and an opinionated pipeline architecture that you can copy into your repository today. If you have already read the [security-first development guide](/blog/security-first-development-guide/), this is the deep dive on the CI/CD layer that post introduced.

## Why Your Pipeline Is a Security Control

The shift-left security argument is well established. Security bugs found in production cost 6-15x more to fix than bugs caught during development. A SQL injection vulnerability flagged by a linter takes five minutes to fix. The same vulnerability discovered after a breach triggers months of incident response, legal review, and customer notification.

But the pipeline itself is also an attack vector. The tj-actions compromise was not an isolated event. In November 2025, the Shai Hulud v2 worm infected over 20,000 repositories and 1,700 npm package versions by abusing `pull_request_target` triggers. In September 2025, the GhostAction campaign saw attackers hijack 327 accounts, inject malicious workflows into 817 repos, and steal 3,325 secrets.

Your pipeline needs to do two things simultaneously: scan your code for vulnerabilities, and protect itself from being the vulnerability.

## The Architecture: What Runs, In What Order

A security pipeline is not a single workflow. It is a series of specialized checks that run at different stages, with different failure modes, at different costs. Here is the architecture:

**Pre-commit (local, before push):**
- Secret scanning with Gitleaks
- Linting and formatting

**Pull request (CI, before merge):**
- Secret scanning with TruffleHog (full history diff)
- Dependency review (license and vulnerability check)
- SAST with CodeQL (semantic code analysis)
- Container and filesystem scanning with Trivy
- Code quality gate with SonarQube

**Main branch (CI, after merge):**
- Full CodeQL analysis
- Scheduled weekly scans
- SBOM generation

**Deployment (CD, before release):**
- Gate on all scan results
- Artifact attestation for SLSA compliance
- Environment protection rules

The order matters. Secret scanning runs first because it is the fastest and catches the most immediately dangerous issues. Dependency review runs next because vulnerable dependencies are the most common attack vector. SAST runs last because it takes the longest but catches the deepest issues.

## Pre-Commit Hooks: Your First Line of Defense

Pre-commit hooks catch problems before code ever leaves the developer's machine. They are not a replacement for CI scanning, because developers can bypass them with `--no-verify`. But they provide immediate feedback and prevent the most common mistakes from ever entering the commit history.

Install the pre-commit framework:

```bash
pip install pre-commit
```

Create `.pre-commit-config.yaml` in your repository root:

```yaml
# .pre-commit-config.yaml
repos:
  # Secret scanning - catches API keys, passwords, tokens
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.2
    hooks:
      - id: gitleaks

  # Standard hooks - prevents common mistakes
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: check-merge-conflict
      - id: detect-private-key
      - id: check-yaml
      - id: end-of-file-fixer
      - id: trailing-whitespace
```

Install the hooks:

```bash
pre-commit install
```

Now every `git commit` runs Gitleaks to scan for secrets and checks for large files, merge conflicts, and accidentally committed private keys. The entire scan takes two to five seconds on most repositories.

Gitleaks is the better choice for pre-commit hooks over TruffleHog because it is faster for local scanning. TruffleHog is more thorough for CI, where scan time is less critical than coverage. We will use both.

A note on pre-commit hook limitations: they are client-side only. A developer can always skip them with `git commit --no-verify`. This is why CI scanning is mandatory. Pre-commit hooks reduce noise and provide fast feedback. CI scanning is the enforcement layer. For a deeper look at [managing secrets across your entire development lifecycle](/blog/secrets-management-developers/), including what happens when a secret does leak, see the dedicated secrets management guide.

## The GitHub Actions Security Pipeline

This is the core pipeline. It runs on every pull request and catches vulnerabilities before code reaches your main branch. Every action is pinned to a commit SHA, not a tag, because tags are mutable and can be hijacked.

### Job 1: Secret Scanning with TruffleHog

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read
  security-events: write

jobs:
  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --results=verified,unknown
```

TruffleHog scans the diff between the PR branch and main, checking for leaked credentials across 800+ secret types. The `--results=verified,unknown` flag reports both verified live secrets and potential secrets that could not be automatically verified. The `fetch-depth: 0` is critical because TruffleHog needs the full git history to scan the diff properly.

### Job 2: Dependency Review

```yaml
  dependency-review:
    name: Dependency Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Dependency Review
        uses: actions/dependency-review-action@da24556b548a50705dd671f47852072ea4c105d9 # v4.6.0
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
          comment-summary-in-pr: always
```

The dependency review action compares the dependency manifests in your PR against the base branch and flags any newly introduced vulnerabilities or problematic licenses. The `fail-on-severity: high` setting blocks PRs that introduce dependencies with known high or critical severity CVEs. The license denial list prevents accidental introduction of copyleft licenses that could create legal obligations for proprietary software.

This action is free for all GitHub repositories, public and private. It runs in about 30 seconds and requires no configuration beyond the workflow file.

### Job 3: SAST with CodeQL

```yaml
  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read
    strategy:
      fail-fast: false
      matrix:
        language: ['javascript-typescript', 'python']
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: ${{ matrix.language }}
          queries: security-extended

      - name: Autobuild
        uses: github/codeql-action/autobuild@v4

      - name: Perform Analysis
        uses: github/codeql-action/analyze@v4
        with:
          category: "/language:${{ matrix.language }}"
```

CodeQL is GitHub's semantic code analysis engine. Unlike pattern-matching tools, it builds a database of your code's data flow and queries it for vulnerability patterns. It catches injection flaws, authentication issues, cryptographic weaknesses, insecure deserialization, and data exposure risks that simpler tools miss.

The `security-extended` query suite includes more checks than the default suite, catching a broader range of issues with a slight increase in false positives. For most teams, the tradeoff is worth it.

CodeQL v4 is the current major version. v3 is deprecated as of December 2026. The action supports JavaScript, TypeScript, Python, Java, C/C++, C#, Go, Ruby, Swift, and Kotlin. Adjust the language matrix to match your codebase.

For public repositories, CodeQL is completely free. For private repositories, it requires GitHub Advanced Security, which is a paid add-on. We will cover the cost analysis and free alternatives later in this guide.

### Job 4: Container and Filesystem Scanning with Trivy

```yaml
  trivy:
    name: Trivy Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Run Trivy filesystem scan
        uses: aquasecurity/trivy-action@0.29.0
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v4
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

Trivy scans your repository's filesystem for vulnerabilities in dependencies, misconfigurations in IaC files (Terraform, Kubernetes manifests, Dockerfiles), and exposed secrets. The SARIF output format integrates directly with GitHub's Security tab, giving you a centralized view of all findings alongside CodeQL results.

If you build Docker images, add a container image scan step:

```yaml
      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy image scan
        uses: aquasecurity/trivy-action@0.29.0
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-image-results.sarif'
          severity: 'CRITICAL,HIGH'
```

Trivy is completely free, open source, and works on public and private repositories without any paid add-ons. It covers the vulnerability scanning gap for teams that cannot afford GitHub Advanced Security. For a complete breakdown of free security tools, see [the free security toolstack guide](/blog/free-security-toolstack/).

### Job 5: SonarQube Quality Gate

SonarQube adds code quality analysis on top of security scanning. It measures code coverage, duplications, maintainability issues, and security hotspots. The quality gate acts as an automated pass/fail decision that can block a PR from merging.

For SonarQube Cloud (formerly SonarCloud), which is free for public projects:

```yaml
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: SonarQube Quality Gate
        uses: SonarSource/sonarqube-quality-gate-action@v1
        with:
          pollingTimeoutSec: 300
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

The quality gate check polls SonarQube for the analysis result and fails the workflow if the gate conditions are not met. The default quality gate requires:

- No new bugs
- No new vulnerabilities
- No new security hotspots reviewed as unsafe
- Code coverage on new code at or above 80%
- Duplication on new code below 3%

Set `pollingTimeoutSec` to avoid burning GitHub Actions minutes if SonarQube is slow to respond. 300 seconds (five minutes) is a reasonable ceiling.

For self-hosted SonarQube Community Edition, which is free and supports private repos, swap `SONAR_HOST_URL` to your instance's URL. The Community Edition lacks some advanced features (branch analysis, pull request decoration on private repos), but the core scanning and quality gate functionality is fully available.

## Branch Protection: The Enforcement Layer

Your security pipeline is only useful if it is required. Without branch protection, a developer can push directly to main, bypassing every check you have configured. Branch protection rules make the pipeline mandatory.

### Configuring Rulesets

GitHub Rulesets are the modern replacement for branch protection rules. They offer the same controls with better flexibility, and they can be applied across multiple branches and repositories simultaneously.

Essential rules for your main branch:

| Rule | Why It Matters |
|---|---|
| Require pull request before merging | Forces all changes through code review and CI |
| Require approvals (minimum 1) | A second pair of eyes catches what automation misses |
| Dismiss stale reviews on new pushes | Prevents approval of one version from covering later changes |
| Require status checks to pass | Makes your security pipeline a merge gate |
| Require branches to be up to date | Prevents merge skew where passing code becomes failing code after merge |
| Block force pushes | Prevents history rewriting that could remove security-relevant commits |
| Require signed commits | Verifies commit author identity (optional but recommended) |
| Require linear history | Simplifies audit trail for compliance |

The critical setting is **Require status checks to pass**. Add every job from your security pipeline as a required status check: `secret-scan`, `dependency-review`, `codeql`, `trivy`, and `sonarqube`. If any of these fail, the PR cannot be merged.

### Merge Queue vs. Required Reviews

GitHub's merge queue ensures that the PR's changes pass all required status checks when applied to the latest version of the target branch, including any PRs already in the queue. It creates temporary test branches that include the latest main branch code plus the queued changes, then runs all checks on these combined branches.

This solves the "merge skew" problem where two PRs each pass individually but fail when combined. The merge queue guarantees that main never contains code that has not passed all checks against the actual state it will be merged into.

Use both. Required reviews provide human judgment. The merge queue provides automated correctness. They are complementary, not alternatives.

One practical caveat: making GitHub Advanced Security checks required in a repository where merge queue is enabled can sometimes break the queue. Test your specific combination of required checks before enforcing them.

## CODEOWNERS: Mandatory Review for Security-Critical Paths

The CODEOWNERS file defines who must review changes to specific files and directories. Combined with the "Require review from Code Owners" branch protection setting, it creates mandatory security review for the most sensitive parts of your codebase.

```text
# .github/CODEOWNERS

# Security team must review all workflow changes
.github/workflows/    @your-org/security-team
.github/actions/      @your-org/security-team

# Security team must review authentication code
src/auth/             @your-org/security-team
src/middleware/auth*   @your-org/security-team

# Security team must review infrastructure
terraform/            @your-org/security-team @your-org/platform-team
Dockerfile            @your-org/security-team @your-org/platform-team
docker-compose*.yml   @your-org/security-team

# Security team must review dependency manifests
package.json          @your-org/security-team
package-lock.json     @your-org/security-team
requirements.txt      @your-org/security-team
Pipfile               @your-org/security-team
Pipfile.lock          @your-org/security-team

# Security team must review security configuration
.pre-commit-config.yaml  @your-org/security-team
sonar-project.properties @your-org/security-team
```

The most important paths to protect:

1. **Workflow files** (`.github/workflows/`) - An attacker who can modify your CI pipeline can exfiltrate secrets, inject backdoors into builds, or disable security checks entirely.
2. **Authentication code** - Vulnerabilities here compromise every user.
3. **Infrastructure configuration** - Terraform files, Dockerfiles, and Kubernetes manifests control your production environment.
4. **Dependency manifests** - A malicious dependency update is the most common supply chain attack vector.
5. **Security tool configuration** - If someone can weaken your security scanning rules, they can introduce vulnerabilities that will not be caught.

Use teams rather than individual usernames. Individual owners create bottlenecks when someone is on vacation. Team-based ownership ensures coverage without single points of failure.

## Gating Deployments on Scan Results

Having security scans run on every PR is necessary but not sufficient. You need to ensure that code cannot reach production unless all scans pass. There are two mechanisms for this in GitHub Actions.

### Required Status Checks

The simplest approach: add your security workflow jobs as required status checks in your branch protection rules. If any job fails, the PR cannot be merged, and the code never reaches main.

This works for the PR-to-main gate. But what about the main-to-production gate?

### Environment Protection Rules

GitHub Environments let you define deployment targets with protection rules:

```yaml
  deploy-production:
    name: Deploy to Production
    needs: [secret-scan, dependency-review, codeql, trivy, sonarqube]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://your-app.com
    steps:
      - name: Deploy
        run: echo "Deploying to production"
```

The `needs` directive ensures the deploy job only runs after all security jobs complete successfully. The `environment: production` setting triggers any protection rules configured for that environment, including:

- **Required reviewers** - Human approval before deployment
- **Wait timer** - Mandatory delay (useful for staged rollouts)
- **Branch restrictions** - Only allow deployments from specific branches
- **Custom deployment protection rules** - Third-party integrations (Datadog, ServiceNow, etc.) that provide automated approval based on external signals

Configure the production environment in your repository settings under Environments. Add at least one required reviewer for production deployments. This creates a human-in-the-loop gate that no automation bypass can circumvent.

## Artifact Signing and SLSA Compliance

Supply chain security does not end at scanning your code. You also need to verify that the artifacts you deploy are the same artifacts your pipeline built. This is what SLSA (Supply-chain Levels for Software Artifacts) addresses.

### SLSA Levels

| Level | Requirement | What It Proves |
|---|---|---|
| Build L1 | Documentation of build process | Someone wrote down how the software is built |
| Build L2 | Hosted build service with signed provenance | A trusted system built it and can prove it |
| Build L3 | Hardened build platform, non-falsifiable provenance | Even the build platform's admins cannot tamper with provenance |

### GitHub Artifact Attestations

GitHub's built-in artifact attestation system gets you to SLSA Build Level 2 with minimal configuration, and Level 3 when combined with reusable workflows.

```yaml
  build-and-attest:
    name: Build and Attest
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      attestations: write
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Build artifact
        run: npm run build

      - name: Generate artifact attestation
        uses: actions/attest-build-provenance@v3
        with:
          subject-path: 'dist/'
```

The attestation binds your build artifact to its SLSA provenance predicate using the in-toto format. A verifiable signature is generated using a short-lived Sigstore-issued signing certificate. Anyone can later verify that the artifact was built by your pipeline, from your repository, at a specific commit.

To verify an attested artifact:

```bash
gh attestation verify dist/your-artifact.tar.gz --owner your-org
```

For Docker images, use the digest output from the build step:

```yaml
      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/your-org/your-app:${{ github.sha }}

      - name: Attest Docker image
        uses: actions/attest-build-provenance@v3
        with:
          subject-name: ghcr.io/your-org/your-app
          subject-digest: ${{ steps.build.outputs.digest }}
          push-to-registry: true
```

### Reaching SLSA Build Level 3

Level 3 requires non-falsifiable provenance, which means even administrators of the build system cannot tamper with the provenance records. GitHub achieves this through reusable workflows. When your build runs in a reusable workflow shared across your organization, the provenance is generated by the reusable workflow's runner context, not the calling workflow. This separation of concerns makes the provenance resistant to manipulation.

Define your build as a reusable workflow in a dedicated repository:

```yaml
# org-workflows/.github/workflows/build-and-attest.yml
name: Build with SLSA Provenance
on:
  workflow_call:
    inputs:
      build-command:
        required: true
        type: string
```

Then call it from your application repositories. The provenance is tied to the reusable workflow's identity, providing the isolation that SLSA Level 3 requires.

## Cost Analysis: GHAS vs. Free Alternatives

GitHub Advanced Security (GHAS) is powerful but expensive. Starting April 2025, it is unbundled into two products:

| Product | Cost | What You Get |
|---|---|---|
| GitHub Secret Protection | $19/month per active committer | Push protection, secret scanning, custom patterns |
| GitHub Code Security | $30/month per active committer | CodeQL, dependency review (enhanced), security overview |
| Both combined | $49/month per active committer | Full GHAS feature set |

For a team of 10 developers, that is $490/month or $5,880/year. For 50 developers, $29,400/year. These features are free for public repositories, so open-source projects are fully covered.

### The Free Alternative Stack

You can build a pipeline with equivalent coverage using entirely free tools:

| GHAS Feature | Free Alternative | Limitation |
|---|---|---|
| Secret scanning | TruffleHog OSS + Gitleaks | No push protection (server-side blocking), but CI scanning catches everything |
| CodeQL SAST | Semgrep OSS + CodeQL on public repos | Semgrep community rules are less comprehensive than CodeQL's full suite |
| Dependency review | `actions/dependency-review-action` | This is actually free for all repos, even without GHAS |
| Security overview dashboard | Trivy + SARIF uploads to GitHub Security tab | Less polished UI, same underlying data |
| Code scanning alerts | SonarQube Community Edition | Self-hosted, requires maintenance, but full scanning capability |

The honest assessment: GHAS provides a more integrated, lower-maintenance experience. The free stack requires more configuration and self-hosting (SonarQube specifically). But the scanning coverage is comparable. For startups and small teams, the free stack is the right choice until the maintenance overhead justifies the GHAS spend.

For a complete list of free security tools and how to configure them, see [the free security toolstack guide](/blog/free-security-toolstack/).

## Pinning Actions to SHA Hashes

Every GitHub Action reference in the examples above uses a specific commit SHA instead of a version tag. This is not optional. It is the single most important security practice for GitHub Actions workflows.

Tags are mutable. The tj-actions/changed-files compromise proved this. The attacker updated 350+ existing tags to point at a malicious commit. Every repository that referenced the action by tag started executing the attacker's code on the next workflow run.

SHA pinning is immutable. A commit SHA points to a specific, unchangeable state of the code. Even if an attacker compromises the action's repository, they cannot change what a pinned SHA points to. To compromise a SHA-pinned reference, an attacker would need to generate a SHA-1 collision for a valid Git object payload, which is computationally infeasible.

**How to find the SHA for a specific version:**

```bash
# Look up the commit SHA for a specific tag
git ls-remote --tags https://github.com/actions/checkout | grep v4.2.2
```

**Keeping pinned SHAs updated:**

Manual SHA management is tedious. Use Dependabot or Renovate to automatically propose updates when actions release new versions:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

Dependabot will open PRs when pinned actions have newer versions available, showing you exactly what changed. You review the diff, approve the PR, and your pipeline stays current without sacrificing security.

GitHub also offers an organization-level policy that requires all Actions references to be pinned to full-length commit SHAs. Enable this at the enterprise or organization level to enforce pinning across all repositories.

## The Complete Free Pipeline

Here is the full security pipeline assembled into a single workflow file. Copy this into `.github/workflows/security.yml` and customize the language matrix and SonarQube configuration for your project.

```yaml
name: Security Pipeline
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly full scan

permissions:
  contents: read
  security-events: write

jobs:
  # Job 1: Fast secret scanning
  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --results=verified,unknown

  # Job 2: Dependency vulnerability and license check
  dependency-review:
    name: Dependency Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - name: Dependency Review
        uses: actions/dependency-review-action@da24556b548a50705dd671f47852072ea4c105d9 # v4.6.0
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
          comment-summary-in-pr: always

  # Job 3: Static analysis with CodeQL
  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read
    strategy:
      fail-fast: false
      matrix:
        language: ['javascript-typescript', 'python']
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: ${{ matrix.language }}
          queries: security-extended
      - name: Autobuild
        uses: github/codeql-action/autobuild@v4
      - name: Perform Analysis
        uses: github/codeql-action/analyze@v4
        with:
          category: "/language:${{ matrix.language }}"

  # Job 4: Filesystem and dependency scanning
  trivy:
    name: Trivy Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - name: Run Trivy filesystem scan
        uses: aquasecurity/trivy-action@0.29.0
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v4
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

  # Job 5: Code quality gate
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      - name: SonarQube Quality Gate
        uses: SonarSource/sonarqube-quality-gate-action@v1
        with:
          pollingTimeoutSec: 300
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # Deployment gate: only runs if all security checks pass
  deploy:
    name: Deploy
    needs: [secret-scan, dependency-review, codeql, trivy, sonarqube]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment:
      name: production
    permissions:
      id-token: write
      contents: read
      attestations: write
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - name: Build
        run: npm run build
      - name: Generate artifact attestation
        uses: actions/attest-build-provenance@v3
        with:
          subject-path: 'dist/'
      - name: Deploy to production
        run: echo "Deploy steps here"
```

### Setup Checklist

After adding this workflow, complete these steps:

1. **Create secrets**: Add `SONAR_TOKEN` and `SONAR_HOST_URL` to your repository secrets (Settings > Secrets and Variables > Actions)
2. **Create the production environment**: Go to Settings > Environments > New Environment > "production". Add at least one required reviewer
3. **Configure branch protection**: Go to Settings > Rules > Rulesets. Create a ruleset for `main` that requires all five security jobs as status checks
4. **Set up CODEOWNERS**: Add the `.github/CODEOWNERS` file from the CODEOWNERS section above, substituting your team names
5. **Install pre-commit hooks locally**: Run `pip install pre-commit && pre-commit install` in your local clone
6. **Configure Dependabot for action updates**: Add the `.github/dependabot.yml` file from the SHA pinning section

## Frequently Asked Questions

**How long does this pipeline add to my PR cycle time?**
The jobs run in parallel. Secret scanning finishes in under 30 seconds. Dependency review takes about 30 seconds. Trivy finishes in one to two minutes. CodeQL is the bottleneck at three to eight minutes depending on codebase size. SonarQube varies but typically finishes in two to five minutes. Total wall-clock time is usually under 10 minutes because the jobs overlap. The value of catching a vulnerability before production far outweighs a few minutes of wait time.

**Can I use this pipeline on private repositories for free?**
Most of it. TruffleHog, Trivy, dependency review, and SonarQube Community Edition are all free for private repos. The exception is CodeQL, which requires GitHub Advanced Security ($30/month per committer) for private repos. You can substitute Semgrep OSS for CodeQL on private repos, or use CodeQL only on your public repos and Trivy's built-in vulnerability scanning for private ones.

**What if a security scan produces a false positive?**
Every tool in this pipeline supports suppression mechanisms. CodeQL uses `// lgtm` comments or `.github/codeql/` configuration files. Trivy uses `.trivyignore` files. SonarQube uses `@SuppressWarnings` annotations or inline comments. For dependency review, use the `allow-dependencies-licenses` parameter. Document every suppression with a justification so future reviewers understand why the finding was dismissed.

**Do I need SonarQube if I already have CodeQL?**
They serve different purposes. CodeQL is a pure security scanner. SonarQube covers code quality, maintainability, test coverage, and duplication in addition to security hotspots. If you only care about security vulnerabilities, CodeQL alone is sufficient. If you want to enforce code quality standards as a team, add SonarQube.

**Is GPG commit signing worth the setup overhead?**
For small teams with trusted members working on internal projects, the overhead usually is not justified. For teams working on security-sensitive code, open source projects with external contributors, or organizations with compliance requirements, it provides verifiable commit authenticity. GitHub now supports SSH key signing in addition to GPG, which is significantly easier to set up. Start with SSH signing if you want commit verification without the GPG key management complexity.

**How do I handle the pipeline when onboarding a legacy codebase?**
Start with secret scanning and dependency review only. These catch the highest-risk issues without generating noise from existing code quality problems. Add Trivy next for vulnerability scanning. Add CodeQL and SonarQube last, and configure them to only flag issues in new or changed code. SonarQube's "Clean as You Code" approach and CodeQL's pull request analysis both support this incremental adoption model. Do not try to fix every existing issue on day one. You will never finish, and the team will learn to ignore the alerts.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does a CI/CD security pipeline add to PR cycle time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The jobs run in parallel, so total wall-clock time is typically under 10 minutes. Secret scanning finishes in under 30 seconds, dependency review takes about 30 seconds, Trivy finishes in one to two minutes, and CodeQL is the bottleneck at three to eight minutes depending on codebase size."
      }
    },
    {
      "@type": "Question",
      "name": "Can I run a security pipeline on private repositories for free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most of the pipeline is free for private repos. TruffleHog, Trivy, dependency review action, and SonarQube Community Edition are all free. CodeQL requires GitHub Advanced Security at $30 per month per committer for private repos. You can substitute Semgrep OSS for CodeQL on private repositories."
      }
    },
    {
      "@type": "Question",
      "name": "What is SLSA compliance and do I need it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SLSA (Supply-chain Levels for Software Artifacts) is a framework for verifying that software artifacts were built by trusted systems from trusted source code. GitHub's artifact attestation system provides SLSA Build Level 2 with minimal setup and Level 3 with reusable workflows. It is increasingly required for government contracts and enterprise compliance frameworks like SOC 2."
      }
    },
    {
      "@type": "Question",
      "name": "Why should I pin GitHub Actions to SHA hashes instead of version tags?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tags are mutable and can be hijacked. In the March 2025 tj-actions/changed-files compromise, an attacker updated over 350 existing tags to point at malicious code, affecting 23,000 repositories. SHA pinning is immutable. A commit SHA cannot be changed after the fact, making it resistant to supply chain attacks targeting action repositories."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need both CodeQL and SonarQube in my pipeline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They serve different purposes. CodeQL is a pure security scanner that performs semantic code analysis to find vulnerabilities. SonarQube covers code quality, maintainability, test coverage, and duplication in addition to security. If you only care about security vulnerabilities, CodeQL alone is sufficient. If you want to enforce code quality standards, add SonarQube."
      }
    },
    {
      "@type": "Question",
      "name": "How do I adopt a security pipeline for a legacy codebase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with secret scanning and dependency review, which catch the highest-risk issues without generating noise from existing problems. Add Trivy next for vulnerability scanning, then CodeQL and SonarQube configured to only flag issues in new or changed code. SonarQube's Clean as You Code approach supports incremental adoption without requiring you to fix every existing issue on day one."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)
- [The Free Security Toolstack: Every Tool You Need for $0](/blog/free-security-toolstack/)

*Setting up a security pipeline for your team and want to get it right the first time? [Let's talk](https://calendly.com/juanidrovo).*
