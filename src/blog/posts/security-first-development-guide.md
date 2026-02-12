---
title: "Security-First Development: A Practical Guide That Will Save You Months and Thousands of Dollars"
description: "Most developers bolt security on as an afterthought, paying for it later with breaches and rewrites. Here's how to build with a security-first mindset from day 0."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - startups
  - compliance
---

The average data breach costs $4.88 million. That number comes from IBM's 2024 Cost of a Data Breach Report, and it's gone up every year since they started tracking it. But that's the average across all companies. For a startup, a single breach can be an extinction event: lost customers, legal costs, regulatory fines, and the months of engineering time you'll spend rebuilding trust you never should have lost.

Here's what makes this worse: the vast majority of breaches exploit known vulnerabilities. Not zero-days. Not sophisticated nation-state attacks. Known, preventable issues that exist because someone decided security could wait until after launch.

It can't. And the good news is that building security-first isn't slower or more expensive. It's actually cheaper, because every dollar you spend on security infrastructure at day 0 saves you ten dollars in breach response, compliance remediation, and architectural rewrites later.

This guide covers the complete security-first development stack: what to build on, how to automate security checks, how to protect your own development cycle, and how to handle user data responsibly. Everything here is either free or low-cost. No enterprise budgets required.

## The Business Case: Why Security-First Saves Money

The economics of security are counterintuitive to people who haven't lived through a breach. Spending money now to prevent a problem that might never happen feels wasteful. But the data is clear.

**Breach costs by the numbers:**

| Metric | Cost |
|---|---|
| Average breach cost globally (2024) | $4.88 million |
| Average cost for companies with fewer than 500 employees | $3.31 million |
| Average cost per lost or stolen record | $165 |
| Average time to identify and contain a breach | 258 days |
| Cost savings when AI and automation are used in prevention workflows | $2.22 million less |

Those 258 days matter. That's nearly nine months where your engineering team is focused on incident response instead of building product. For a startup, that's often the difference between making it and shutting down.

**The "shift left" multiplier:** According to industry estimates, security bugs found in production cost 6-15x more to fix than bugs caught during development. A SQL injection vulnerability caught by a linter in your CI/CD pipeline takes five minutes to fix. The same vulnerability discovered after a breach takes months of incident response, legal review, customer notification, and architectural changes.

**Compliance costs compound when bolted on:** Companies that build compliance controls from the start spend $20,000-$60,000 on their first [SOC 2](/blog/what-is-soc-2-compliance/) engagement. Companies that retrofit compliance onto an existing codebase spend $80,000-$200,000, because they're rewriting access controls, adding logging, restructuring data flows, and writing policies for systems that were never designed to be auditable. The [SaaS compliance stack](/blog/saas-compliance-stack/) isn't optional if you're selling to enterprises. The question is whether you pay for it once or twice.

**GDPR enforcement is real and growing:** EU supervisory authorities have issued a cumulative EUR 5.65 billion in GDPR fines since 2018, with EUR 1.2 billion in 2024 alone. The average fine across all tracked cases is EUR 2,360,409. These aren't just targeting big tech. Small companies that mishandle personal data face fines that can end the business.

## Build on Battle-Tested Open Source

The single highest-leverage security decision you can make is choosing what not to build. Every line of custom code is a potential vulnerability. Every authentication system you roll yourself is a vector for session hijacking, credential stuffing, and timing attacks you haven't thought of yet.

Battle-tested open-source projects have been audited by thousands of developers, hammered by security researchers, and hardened against attack patterns you'll never encounter in testing. Use them.

### Authentication: Never Roll Your Own

Custom authentication is the single most common source of critical vulnerabilities in web applications. Use an established solution:

| Solution | Type | Best For |
|---|---|---|
| Clerk | Managed service | SaaS products that need user management fast |
| NextAuth/Auth.js | Open source library | Next.js apps that want self-hosted auth |
| Keycloak | Self-hosted platform | Teams that need full control and SAML/OIDC |
| Supabase Auth | Managed + open source | Projects already using Supabase |

All of these handle password hashing, session management, CSRF protection, OAuth flows, and MFA. Building any of that yourself is a security risk disguised as a feature.

### ORMs and Query Builders: Prevent SQL Injection by Default

SQL injection has been on the OWASP Top 10 since its inception. It's entirely preventable with parameterized queries, and modern ORMs enforce parameterization by default:

- **Prisma** - Type-safe queries in TypeScript/JavaScript. Parameterized by default. Active security advisory program
- **Drizzle** - Lightweight, SQL-like syntax with automatic parameterization
- **SQLAlchemy** - Python's standard ORM. Decades of security hardening
- **ActiveRecord** - Ruby on Rails' ORM. Well-audited, mature security model

If you're writing raw SQL strings with user input interpolation in 2026, you have a critical vulnerability. There's no reason for it.

### How to Evaluate Open-Source Security

Not all open-source projects are equally trustworthy. Before depending on a library for security-critical functionality, check:

1. **Maintenance activity** - When was the last commit? The last release? Abandoned projects accumulate unpatched CVEs
2. **Security advisory history** - Check the project's GitHub Security Advisories tab. A project with disclosed-and-patched vulnerabilities is healthier than one that's never been audited
3. **Dependency count** - Fewer dependencies mean a smaller attack surface. Check with `npm audit` or `pip audit`
4. **OpenSSF Scorecard** - The Open Source Security Foundation maintains scorecards for projects. A score above 7/10 indicates good security practices
5. **Star count is not a security metric** - Popular projects can still have poor security. Use it as a proxy for community size, not safety

### Shrink Your Security Surface: Delegate to Managed Providers

Every system you self-host is a system you're responsible for patching, monitoring, and defending. A self-hosted PostgreSQL instance means you own database security updates, access control configuration, backup encryption, and network hardening. A managed database on AWS RDS, Supabase, or Neon means the provider's security team handles that, and their security team is larger and more specialized than yours.

The principle works on two levels. First, every component you delegate to a reputable managed provider is one less thing an attacker can exploit through your misconfiguration. Second, and this is the part most guides skip: delegation means less code you have to write, test, maintain, and secure. A self-hosted auth system is thousands of lines of security-critical code you own forever. Clerk or Auth0 replaces that with an SDK call. Fewer bugs, fewer code paths to audit, fewer tests to maintain, fewer security patches to ship on a Friday night.

The other shift is responsibility. When you self-host a database and it gets breached, that's your incident, your legal exposure, your customer notification. When you use a managed provider, the SLA transfers that operational responsibility externally. Stripe carries PCI DSS compliance so you never touch card numbers. Your managed database provider handles patching, backup encryption, and access control hardening under their contractual obligations. You're not eliminating risk. You're transferring it to organizations that have dedicated security teams, 24/7 monitoring, and compliance certifications that would cost you hundreds of thousands to achieve independently.

| Component | Self-Hosted Risk | Managed Alternative |
|---|---|---|
| Database | Unpatched CVEs, misconfigured access, unencrypted backups | AWS RDS, Supabase, PlanetScale, Neon |
| Authentication | Session hijacking, credential storage, MFA bugs | Clerk, Auth0, Supabase Auth |
| Email/transactional | Open relays, SPF/DKIM misconfiguration, IP blacklisting | SendGrid, Resend, Postmark |
| Payments | PCI DSS scope, card data exposure | Stripe, Paddle (they handle PCI compliance) |
| File storage | Path traversal, access control, malware scanning | S3, Cloudflare R2, Supabase Storage |
| SSL/TLS certificates | Expired certs, weak cipher suites | Cloudflare, Vercel, Let's Encrypt auto-renewal |

Consider a concrete example. Building a payment system from scratch means PCI DSS compliance ($5,000-$50,000/year depending on transaction volume), secure card storage infrastructure, tokenization logic, fraud detection, chargeback handling, and ongoing security audits. Using Stripe means calling `stripe.charges.create()` and letting Stripe's dedicated security infrastructure handle the rest. You've just eliminated thousands of lines of code, an entire compliance certification, and a category of breach risk from your product. The same logic applies to every row in that table.

This doesn't mean you should blindly outsource everything. The tradeoff matters. Managed providers introduce a dependency on their uptime and their compliance posture. If you're handling regulated data (health records, financial data, data subject to data residency requirements), verify that the provider's certifications and data processing agreements cover your obligations. A managed database doesn't help if the provider stores data in a jurisdiction that violates your customers' [GDPR requirements](/blog/saas-compliance-stack/).

But for the vast majority of startups and indie developers, the calculus is clear: less code written means less code to secure, and transferred SLAs mean someone else's security team is working for you around the clock. Every component you delegate shrinks both your codebase and your blast radius.

## CI/CD Pipeline from Day 0

If you're pushing code to production without automated security checks, you're relying entirely on human attention to catch vulnerabilities. Humans miss things. Automation doesn't.

Set up your security pipeline before writing your first feature. The tools are free. The time investment is a few hours. The payoff is permanent.

### Self-Hosted SonarQube: Your Free Code Quality and Security Scanner

SonarQube Community Build is free, self-hosted, and covers roughly 20 languages including Java, JavaScript, TypeScript, Python, Go, C#, PHP, Ruby, and Kotlin. It catches security vulnerabilities, code smells, bugs, and maintainability issues through thousands of rules.

Deploy it with Docker in under five minutes:

```yaml
# docker-compose.yml
version: "3"
services:
  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
```

Run `docker-compose up -d`, navigate to `localhost:9000`, and configure your project. Then add the scanner to your CI pipeline:

```yaml
# .github/workflows/sonarqube.yml
name: SonarQube Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

SonarQube will flag SQL injection, XSS, hardcoded credentials, insecure cryptography, and hundreds of other security issues before they reach production.

### Dependency Scanning: Catch Vulnerable Packages Automatically

Your dependencies have vulnerabilities. The question is whether you know about them. Set up automated scanning:

**Dependabot (GitHub, free):** Monitors your dependency files and creates pull requests to update vulnerable packages. Enable it in your repository settings or add a configuration file:

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

**Snyk (free tier):** Provides up to 400 tests per month for open source scanning on the free plan. Covers npm, pip, Maven, Go modules, and more. Integrates directly into GitHub, GitLab, and Bitbucket.

**Trivy (free, open source):** Scans container images, filesystems, and Git repositories for vulnerabilities, misconfigurations, and exposed secrets. Runs locally or in CI:

```yaml
# Add to GitHub Actions
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    scan-ref: '.'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### GitHub CodeQL: Free SAST for Public Repos

GitHub's CodeQL is a free static analysis tool for public repositories (private repos require GitHub Advanced Security, a paid add-on). It performs semantic code analysis, meaning it understands the flow of data through your application and catches vulnerabilities that pattern-matching tools miss.

```yaml
# .github/workflows/codeql.yml
name: CodeQL Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly scan

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    strategy:
      matrix:
        language: ['javascript', 'python']
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
      - uses: github/codeql-action/analyze@v3
```

CodeQL catches injection flaws, authentication issues, cryptographic weaknesses, and data exposure risks. It's one of the strongest free SAST tools available.

## Secure Your Own Development Cycle

Your CI/CD pipeline catches issues in code. But the development cycle itself is an attack surface. Leaked secrets, compromised dependencies, and insecure development practices can undermine even the best application security.

### Secrets Management from Day 0

The single most common source of credential leaks is accidentally committing secrets to Git. Once a secret is in your Git history, it's there forever unless you rewrite the entire history. Prevention is the only practical solution.

**Pre-commit hooks that catch secrets before they're committed:**

| Tool | Detectors | Best For |
|---|---|---|
| TruffleHog | 800+ secret types, 700+ verified detectors | Full coverage with active verification |
| detect-secrets (Yelp) | Heuristic-based, language agnostic | Lightweight, low false-positive baseline approach |
| git-secrets (AWS Labs) | AWS credentials + custom patterns | AWS-heavy environments |

Set up TruffleHog as a pre-commit hook:

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

Install with:

```bash
pip install pre-commit
pre-commit install
```

Now every commit is scanned for secrets before it reaches your repository. TruffleHog doesn't just pattern-match. It actively verifies whether detected credentials are live, which cuts false positives to near zero.

**Beyond pre-commit hooks:**

- Never store secrets in `.env` files committed to version control. Add `.env` to your `.gitignore` from the first commit
- Use a secrets manager for production: AWS Secrets Manager, HashiCorp Vault (open source), or Doppler (free tier available)
- Rotate secrets on a schedule. If a key hasn't been rotated in six months, it's a liability

### Branch Protection and Code Review

Every production deployment should require at least one code review. This isn't bureaucracy; it's a security control. A second pair of eyes catches vulnerabilities that the author missed.

Configure branch protection rules on your main branch:
- Require pull request reviews before merging
- Require status checks to pass (your security scans)
- Require signed commits if your team supports it
- Disable force pushes to main

These are free features on GitHub, GitLab, and Bitbucket. There's no reason not to enable them.

### Dependency Pinning

Lock files (`package-lock.json`, `yarn.lock`, `Pipfile.lock`, `go.sum`) pin your dependencies to exact versions. Without them, a compromised package update can slip into your build without any code changes on your end.

- Always commit your lock files
- Review dependency updates before merging
- Use `npm ci` instead of `npm install` in CI (it respects the lock file exactly)
- Audit your dependency tree regularly: `npm audit`, `pip audit`, `go vuln check`

## Design Data Anonymization Before You Collect

If your application collects user data, the time to design your data handling strategy is before you write your first database migration. Not after launch. Not when a customer asks about GDPR. Before you collect a single record.

### Data Minimization: Collect Only What You Need

Every piece of personal data you store is a liability. If you don't need it, don't collect it. This isn't just good privacy practice. It's a legal requirement under [GDPR](/blog/saas-compliance-stack/) and an increasingly common expectation from enterprise buyers reviewing your [security questionnaires](/blog/security-questionnaires-saas-startups/).

Ask three questions before adding any user data field:
1. Do we need this data to deliver the product's core value?
2. Can we derive what we need from anonymized or aggregated data instead?
3. What's the retention period, and do we have automated deletion?

### Anonymization vs. Pseudonymization

**Anonymization** irreversibly strips identifying information. Anonymized data is no longer personal data under GDPR, which means fewer obligations.

**Pseudonymization** replaces identifiers with tokens while maintaining a mapping table. The data can be re-identified with the mapping key. GDPR still applies, but it's considered a security safeguard that can reduce your compliance burden.

For analytics and reporting, prefer anonymization. For operational data where you need to link records back to users, use pseudonymization with the mapping key stored separately and access-controlled.

### Encryption and Access Patterns

Build these into your architecture from day 0:

- **Encryption at rest** - Use your database's native encryption (PostgreSQL's `pgcrypto`, or cloud provider encryption). For sensitive fields (SSNs, health data), add application-level encryption
- **Encryption in transit** - TLS everywhere. No exceptions. Use HSTS headers to prevent downgrade attacks
- **Field-level access control** - Not every service that reads from your database needs access to PII. Design your queries to return only the fields each service needs
- **Audit logging** - Log who accessed what personal data, when, and why. This is a requirement for [SOC 2](/blog/how-to-prepare-soc-2-audit/) and GDPR alike

### Data Retention in the Schema

Build retention policies into your database schema from the start:

```sql
-- Add retention metadata to tables that store PII
ALTER TABLE users ADD COLUMN data_retention_until TIMESTAMP;
ALTER TABLE users ADD COLUMN deletion_requested_at TIMESTAMP;
ALTER TABLE users ADD COLUMN anonymized_at TIMESTAMP;

-- Create an index for the retention cleanup job
CREATE INDEX idx_users_retention ON users (data_retention_until)
WHERE anonymized_at IS NULL;
```

Then run a scheduled job that anonymizes or deletes records past their retention date. This is trivial to implement at design time. Retrofitting it onto a production system with millions of records and dozens of foreign key relationships is a project that takes weeks, not hours.

## Use AI Not Just to Write Code, But to Review It

AI coding assistants are powerful, but their highest-value security use isn't writing code. It's reviewing it. An AI model can scan an entire pull request for OWASP Top 10 vulnerabilities faster than a human reviewer, and it catches patterns that static analysis tools miss because it understands context.

### AI-Assisted Security Review

Use AI code review as a complement to your static analysis tools, not a replacement. The combination catches more than either alone.

Effective prompt patterns for security review:

```
Review this code for security vulnerabilities, focusing on:
1. Injection flaws (SQL, NoSQL, command, LDAP)
2. Broken authentication and session management
3. Sensitive data exposure
4. Missing access controls
5. Security misconfiguration
6. Cross-site scripting (XSS)
7. Insecure deserialization
8. Using components with known vulnerabilities

For each issue found, explain the attack vector
and provide a fix.
```

### What AI Catches That Static Analysis Misses

Static analysis tools work on patterns. They're excellent at finding `eval()` calls, SQL string concatenation, and hardcoded secrets. But they struggle with:

- **Business logic vulnerabilities** - A static tool won't know that your pricing endpoint should require authentication. AI can reason about what an endpoint does and whether the access controls make sense
- **Authorization bypasses** - AI can trace data flow through middleware and identify paths where authorization checks are missing
- **Race conditions** - AI can identify patterns where concurrent requests might bypass validation

### What AI Misses

AI review has real limitations:

- It can hallucinate vulnerabilities that don't exist (false positives)
- It may miss vulnerabilities in complex, multi-file logic flows
- It doesn't verify that its suggested fixes actually work
- It can't replace penetration testing

Use AI review as one layer in a defense-in-depth strategy. Combine it with SonarQube, CodeQL, dependency scanning, and human review. No single tool catches everything.

## DRY Principles and Maintainability Are Security

Code duplication isn't just a maintenance problem. It's a security problem. When your authorization check exists in twelve places instead of one, you only need to forget to update one of them to create a vulnerability.

### Single Source of Truth for Auth Checks

Implement authorization as middleware or a decorator that wraps your routes. Never inline authorization logic:

```typescript
// Bad: auth check duplicated in every route
app.get('/api/users/:id', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ... handler logic
});

// Good: auth check as reusable middleware
const requireRole = (role: string) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.get('/api/users/:id', requireRole('admin'), handleGetUser);
```

When the middleware is the single source of truth, updating your authorization model means changing one function, not searching through every route handler.

### Centralized Input Validation

Validate inputs at one place and one place only: the boundary where external data enters your system. Use a validation library (Zod, Joi, Pydantic) and define schemas that are shared between your API routes and your frontend forms.

```typescript
// Define once, use everywhere
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(['user', 'admin']),
});

// API route uses the same schema
app.post('/api/users', validate(CreateUserSchema), handleCreateUser);
```

If validation logic is scattered across controllers, services, and database layers, you will eventually have an endpoint where it's missing entirely.

## Resilience: Build Systems That Fail Safely

Security isn't just about preventing attacks. It's about surviving them. A resilient system degrades gracefully instead of failing catastrophically.

### Rate Limiting from Day 0

Every public endpoint needs rate limiting. Without it, a single attacker can brute-force your login, exhaust your API quotas, or DDoS your application with minimal effort.

For Express/Node.js applications, `express-rate-limit` takes less than five minutes to set up:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.use('/api/auth/', authLimiter);
```

### Logging and Monitoring

You can't respond to what you can't see. Set up logging and monitoring before you need it:

- **Structured logging** - Use JSON-formatted logs with consistent fields (timestamp, level, user ID, request ID). Tools like Pino (Node.js) or structlog (Python) make this trivial
- **Centralized log aggregation** - Free options include Grafana Loki, the ELK stack (self-hosted), or Axiom's free tier
- **Alerting** - Set up alerts for authentication failures, rate limit hits, and error spikes. Grafana's alerting is free for self-hosted instances
- **Health checks** - Expose a `/health` endpoint that your monitoring system can ping. If it stops responding, you know immediately

### Incident Response Plan

You don't need a 50-page incident response plan. You need answers to four questions written down before something goes wrong:

1. **Who gets notified?** (Name, phone number, email)
2. **Where are the logs?** (URLs, access credentials stored securely)
3. **What's the containment procedure?** (How to revoke access, shut down compromised services)
4. **Who communicates with affected users?** (Not the person fixing the issue)

Write this down in a shared document. Review it quarterly. That's sufficient for a startup.

## Strategic Testing: Test What Matters for Security

Testing everything equally is impossible and unnecessary. Focus your security testing budget on the areas with the highest impact.

### What to Test First

| Priority | What to Test | Why |
|---|---|---|
| 1 | Authentication and session management | A bug here compromises every user |
| 2 | Authorization and access control | IDOR and privilege escalation are among the most common vulnerabilities |
| 3 | Input validation on public endpoints | These are your attack surface |
| 4 | Data encryption and PII handling | Breach impact depends on what data is exposed |
| 5 | Third-party integrations | Your security is only as strong as your weakest integration |

### Free Penetration Testing Tools

**ZAP** (formerly OWASP ZAP, now maintained by Checkmarx) is the standard free penetration testing tool. It performs automated scanning against your web application and identifies XSS, SQL injection, broken authentication, and dozens of other vulnerability categories. Run it against your staging environment before every release.

**Burp Suite Community Edition** provides manual penetration testing capabilities for free. The intercepting proxy lets you inspect and modify requests to test how your application handles unexpected input.

### Write Security-Focused Tests

Add tests specifically for security boundaries:

```typescript
describe('Access Control', () => {
  it('prevents regular users from accessing admin endpoints', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${regularUserToken}`);
    expect(res.status).toBe(403);
  });

  it('prevents unauthenticated access to protected routes', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('prevents accessing other users data via IDOR', async () => {
    const res = await request(app)
      .get('/api/users/other-user-id/settings')
      .set('Authorization', `Bearer ${regularUserToken}`);
    expect(res.status).toBe(403);
  });
});
```

These tests are cheap to write and catch regressions that would otherwise become production vulnerabilities.

## Build on What You Know Is Safe First

Start with the most secure defaults and relax them only when you have a specific, documented reason. This is the opposite of how most development works, where everything is open by default and restrictions are added after something goes wrong.

### Secure Defaults Checklist

- **CORS:** Start with no cross-origin access. Allowlist specific origins as needed
- **CSP (Content Security Policy):** Start with `default-src 'self'` and add exceptions explicitly
- **Cookies:** `HttpOnly`, `Secure`, `SameSite=Strict` by default
- **Headers:** Use Helmet.js (Node.js) or equivalent to set security headers automatically
- **Database access:** Principle of least privilege. Your application database user should have only the permissions it needs, not root access
- **API responses:** Never return more data than the client needs. Avoid sending full database objects that might include internal fields

### The Minimum Viable Security Setup

For a solo developer or small team shipping a web application, here's the minimum security infrastructure you should have before launching:

1. **Auth:** Managed solution (Clerk, NextAuth, Supabase Auth)
2. **ORM:** Parameterized queries via Prisma, Drizzle, or equivalent
3. **CI/CD:** GitHub Actions with CodeQL and Dependabot enabled
4. **Secrets:** Pre-commit hooks (TruffleHog) + `.env` in `.gitignore`
5. **Headers:** Helmet.js or equivalent security header middleware
6. **Rate limiting:** On all public endpoints
7. **HTTPS:** Everywhere, no exceptions
8. **Logging:** Structured logs with authentication event tracking

This setup costs $0 in tooling and takes less than a day to configure. It covers the most common attack vectors and gives you a foundation to build on.

## Frequently Asked Questions

**Isn't security-first development slower?**
No. Security-first development is slower on day one and faster on every day after. Setting up a CI/CD pipeline with SonarQube, CodeQL, and dependency scanning takes a few hours. Responding to a breach takes months. Retrofitting security controls onto a codebase that was built without them takes longer than building them in from the start, because you're working around existing architectural decisions instead of making the right ones upfront.

**I'm a solo developer. Do I really need all this?**
You need the minimum viable security setup described above. You don't need SonarQube on day one (though it's free and easy). You do need managed auth, parameterized queries, secrets scanning, HTTPS, and rate limiting. These are non-negotiable regardless of team size. Solo developers are actually at higher risk because there's no second pair of eyes on the code. A [solo developer pursuing SOC 2](/blog/soc-2-separation-duties-solo-developer/) or other [compliance certifications](/blog/compliance-certifications-solo-developers/) will find that security-first practices cut the audit timeline in half.

**What's the minimum viable security setup?**
Managed authentication, an ORM with parameterized queries, HTTPS everywhere, security headers (Helmet.js), rate limiting on public endpoints, pre-commit secret scanning, and Dependabot or equivalent dependency monitoring. Total cost: $0. Total setup time: less than one day. This covers the OWASP Top 10 most common attack vectors.

**How do I prioritize what to secure first?**
Secure the authentication layer first, because a vulnerability there compromises everything. Then input validation on public endpoints, because those are your attack surface. Then access control, because IDOR and privilege escalation are the most common application-layer vulnerabilities. Then data handling, because breach impact depends on what data is exposed. Everything else comes after these four.

**What about compliance (SOC 2, GDPR, HIPAA)?**
Security-first development is the foundation that makes compliance achievable. SOC 2 requires evidence of security controls, access management, logging, and change management, all of which are built into the approach described in this guide. GDPR requires data protection by design and by default, which is the anonymization section above. Building these from day 0 means your [SOC 2 preparation](/blog/how-to-prepare-soc-2-audit/) is documenting what you already do, not rebuilding your entire stack. The [budget SOC 2 stack](/blog/budget-soc-2-stack-under-5000/) is achievable for under $10,000 when your codebase is already built with security-first principles.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Isn't security-first development slower?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Security-first development is slower on day one and faster on every day after. Setting up a CI/CD pipeline with SonarQube, CodeQL, and dependency scanning takes a few hours. Responding to a breach takes months. Retrofitting security controls onto a codebase built without them takes longer than building them in from the start."
      }
    },
    {
      "@type": "Question",
      "name": "I'm a solo developer. Do I really need all this?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Solo developers need managed authentication, parameterized queries, secrets scanning, HTTPS, and rate limiting at minimum. These are non-negotiable regardless of team size. Solo developers are at higher risk because there is no second pair of eyes on the code. Security-first practices make the audit process far simpler."
      }
    },
    {
      "@type": "Question",
      "name": "What's the minimum viable security setup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Managed authentication, an ORM with parameterized queries, HTTPS everywhere, security headers (Helmet.js), rate limiting on public endpoints, pre-commit secret scanning, and Dependabot or equivalent dependency monitoring. Total cost is $0 in tooling and takes less than one day to configure, covering the OWASP Top 10 most common attack vectors."
      }
    },
    {
      "@type": "Question",
      "name": "How do I prioritize what to secure first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Secure the authentication layer first, because a vulnerability there compromises everything. Then input validation on public endpoints (your attack surface). Then access control (IDOR and privilege escalation are the most common vulnerabilities). Then data handling, because breach impact depends on what data is exposed. Everything else comes after these four priorities."
      }
    },
    {
      "@type": "Question",
      "name": "What about compliance (SOC 2, GDPR, HIPAA)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Security-first development is the foundation that makes compliance achievable. SOC 2 requires evidence of security controls, access management, logging, and change management. GDPR requires data protection by design and by default. Building these from day 0 means compliance preparation involves documenting what you already do, not rebuilding your stack."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters](/blog/saas-compliance-stack/)
- [The Budget SOC 2 Stack: Getting Certified for Under $10,000](/blog/budget-soc-2-stack-under-5000/)
- [Audit-Ready LLM Architecture: How to Build AI Products That Pass SOC 2, EU AI Act, and ISO 42001](/blog/audit-ready-llm-architecture/)

*Building a product and want to get the security foundations right from day one? [Let's talk](https://calendly.com/juanidrovo).*
