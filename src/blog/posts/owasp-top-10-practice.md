---
title: "OWASP Top 10 in Practice: Code Examples, Real Breaches, and Free Tools for Every Category"
description: "Every OWASP Top 10 2025 category broken down with vulnerable code, fixed code, real breach examples, and free tools that catch each vulnerability type."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - owasp
---

The OWASP Top 10 is the most referenced list in application security. It shapes compliance requirements, drives penetration testing methodologies, and shows up in every security questionnaire you will ever fill out. But most coverage of it reads like a textbook: abstract descriptions, vague recommendations, and zero code.

This post is different. For every category in the 2025 edition, I am going to show you what the vulnerability looks like in your codebase, what the fix looks like, which real company got breached because of it, and which free tools catch it before attackers do.

The 2025 edition is a significant update. OWASP analyzed over 175,000 CVE records mapped to 643 unique CWEs, up from 241 in 2021. Two new categories were added, one was consolidated, and the rankings shifted to reflect where the real damage is happening now. CISA added 245 vulnerabilities to its Known Exploited Vulnerabilities catalog in 2025 alone, a 20% increase over the prior year. A record-breaking 40,009 CVEs were published in 2024. The threat landscape is not slowing down, and the Top 10 reflects that.

If you are building with a [security-first mindset](/blog/security-first-development-guide/), understanding these categories at the code level is non-negotiable. Let's get into it.

## The 2025 List at a Glance

Before diving into each category, here is the complete OWASP Top 10 2025 with key statistics and what changed from 2021.

| Rank | Category | CWEs | Avg Incidence | Change from 2021 |
|------|----------|------|---------------|-------------------|
| A01 | Broken Access Control | 40 | 3.73% | Stayed #1 (absorbed SSRF) |
| A02 | Security Misconfiguration | 16 | 3.00% | Up from #5 |
| A03 | Software Supply Chain Failures | 5 | 5.19% | NEW (expanded from Vulnerable Components) |
| A04 | Cryptographic Failures | 32 | 3.80% | Down from #2 |
| A05 | Injection | 38 | Highest CVE count | Down from #3 |
| A06 | Insecure Design | -- | Max 11.33% | Down from #4 |
| A07 | Authentication Failures | 36 | Max 15.80% | Stayed ~#7 (renamed) |
| A08 | Software or Data Integrity Failures | -- | -- | Stayed #8 |
| A09 | Security Logging and Alerting Failures | 5 | -- | Stayed #9 (renamed) |
| A10 | Mishandling of Exceptional Conditions | 24 | -- | NEW |

Two new categories entered the list: **Software Supply Chain Failures** (A03), which expands the old "Vulnerable and Outdated Components" to cover the entire dependency and build ecosystem, and **Mishandling of Exceptional Conditions** (A10), covering error handling failures that lead to security vulnerabilities. SSRF was consolidated into Broken Access Control (A01). Security Misconfiguration jumped from #5 to #2, reflecting how pervasive cloud-era misconfigurations have become.

## A01: Broken Access Control

**The problem:** Your application lets users access or modify resources they should not be able to reach. This includes IDOR (Insecure Direct Object References), privilege escalation, SSRF, and missing function-level access controls.

**How common:** 3.73% of tested applications. Number one for two consecutive editions. 40 mapped CWEs.

**Real breaches:**
- **Optus (2022):** A coding error left an API endpoint without access control, exposing personal data of roughly 10 million customers.
- **Kia Connected Cars (2024):** Researchers demonstrated they could take over connected-car functions using only a license plate number, exploiting weak ownership verification on Kia's web portal.
- **Capital One (2019):** An SSRF attack via a misconfigured WAF let an attacker reach the AWS metadata service at `169.254.169.254`, obtain temporary IAM credentials, and exfiltrate nearly 30 GB of credit application data.

### Vulnerable code: IDOR in JavaScript

```javascript
// VULNERABLE: No authorization check -- any authenticated user
// can view any other user's profile by changing the ID
app.get('/api/users/:userId/profile', (req, res) => {
  const { userId } = req.params;
  db.users.findById(userId).then(user => {
    res.json(user);
  });
});
```

### Fixed code: IDOR prevention

```javascript
// SECURE: Verify the requester owns the resource
app.get('/api/users/:userId/profile', authenticate, (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== userId && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  db.users.findById(userId).then(user => {
    res.json(user);
  });
});
```

### Vulnerable code: SSRF in JavaScript

```javascript
// VULNERABLE: User controls the URL the server fetches
app.get('/fetch-url', async (req, res) => {
  const { url } = req.query;
  // Attacker sends: http://169.254.169.254/latest/meta-data/
  const response = await fetch(url);
  const data = await response.text();
  res.send(data);
});
```

### Fixed code: SSRF prevention

```javascript
import { URL } from 'url';

const ALLOWED_HOSTS = new Set(['api.example.com', 'cdn.example.com']);

app.get('/fetch-url', async (req, res) => {
  const { url } = req.query;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
      return res.status(400).json({ error: 'Host not allowed' });
    }
    const response = await fetch(url);
    res.send(await response.text());
  } catch {
    res.status(400).json({ error: 'Invalid URL' });
  }
});
```

**Free tools:** Semgrep (SAST rules for IDOR patterns), OWASP ZAP (DAST for access control testing), Burp Suite Community Edition (manual testing).

## A02: Security Misconfiguration

**The problem:** Default credentials, overly permissive CORS, debug mode in production, exposed error messages with stack traces, missing security headers, open cloud storage buckets.

**How common:** 3.00% of tested applications. Jumped from #5 to #2 in the 2025 edition because cloud misconfigurations have become epidemic.

**Real breaches:**
- **AWS S3 Bucket Mega-Breach (2024):** Hackers scanned millions of sites and exploited misconfigured systems to steal over 2 TB of data, including AWS access keys, GitHub API keys, SMTP credentials, and source code. In an ironic twist, the attackers stored their stolen data in their own misconfigured S3 bucket.
- **Microsoft Sentinel (September 2024):** A bug in internal monitoring agents disrupted log collection for critical services for nearly three weeks, creating blind spots in threat detection for customers.

### Vulnerable code: Exposed error details in JavaScript

```javascript
// VULNERABLE: Leaks internal paths, database schema, credentials
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    query: err.sql,
    connectionString: err.config
  });
});
```

### Fixed code: Safe error handling

```javascript
// SECURE: Generic errors in production, detailed logs internally
app.use((err, req, res, next) => {
  const errorId = crypto.randomUUID();
  logger.error({ errorId, err, url: req.url, method: req.method });

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error', errorId });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
```

### Vulnerable code: Permissive defaults in Python

```python
# VULNERABLE: Debug mode, default secret, wide-open CORS
app = Flask(__name__)
app.config['SECRET_KEY'] = 'changeme'
app.config['DEBUG'] = True
CORS(app, origins="*", supports_credentials=True)
```

### Fixed code: Hardened configuration

```python
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['DEBUG'] = False
CORS(app, origins=["https://app.example.com"], supports_credentials=True)

@app.after_request
def set_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Strict-Transport-Security'] = (
        'max-age=31536000; includeSubDomains'
    )
    return response
```

**Free tools:** ScoutSuite (cloud misconfiguration scanning), Trivy (infrastructure-as-code scanning), Checkov (IaC policy checks), Mozilla Observatory (HTTP security headers).

## A03: Software Supply Chain Failures (New in 2025)

**The problem:** Compromises anywhere in the software dependency chain: malicious packages, hijacked maintainer accounts, poisoned build pipelines, unverified downloads. This category expanded from the old "Vulnerable and Outdated Components" to cover the entire ecosystem.

**How common:** 5.19% average incidence rate. The community survey overwhelmingly voted this the top concern.

**Real breaches:**
- **Chalk and Debug npm Compromise (September 2025):** A maintainer was phished, and attackers published poisoned versions of libraries with over 2 billion aggregate weekly downloads.
- **Ultralytics PyPI Attack (December 2024):** The popular ML library was compromised through an attack on its build pipeline.
- **dYdX Protocol Compromise (February 2026):** Legitimate npm and PyPI packages were hijacked to deploy cryptocurrency wallet stealers and remote access trojans.

### Vulnerable pattern: No lockfile integrity

```javascript
// package.json -- VULNERABLE: loose version ranges
{
  "dependencies": {
    "lodash": "^4.0.0",
    "event-stream": "*"
  }
}
// No package-lock.json committed
// No integrity checks in CI
```

### Fixed pattern: Pinned versions with integrity verification

```javascript
// package.json -- SECURE: pinned versions
{
  "dependencies": {
    "lodash": "4.17.21"
  }
}

// In CI pipeline:
// npm ci --ignore-scripts  (uses lockfile exactly, fails if mismatched)
// npm audit --audit-level=high
```

### Vulnerable pattern: Python dependencies without hashes

```python
# requirements.txt -- VULNERABLE
requests
flask
# No version pins, no hashes
```

### Fixed pattern: Pinned with hash verification

```python
# requirements.txt -- SECURE
requests==2.31.0 \
  --hash=sha256:942c5a758f98d790eaed1a29cb6eefc7f
flask==3.0.0 \
  --hash=sha256:21128f47e4e3b9d29131f7f3a70d56c5a

# Install with:
# pip install --require-hashes -r requirements.txt
```

**Free tools:** Socket.dev (supply chain analysis), npm audit / pip-audit, OWASP Dependency-Check, Trivy (SCA mode), Snyk Open Source (free tier), Renovate (automated dependency updates).

## A04: Cryptographic Failures

**The problem:** Weak hashing algorithms, plaintext password storage, hardcoded encryption keys, missing encryption in transit, broken cryptographic implementations.

**How common:** 3.80% of tested applications. 32 mapped CWEs.

**Real breaches:**
- **Facebook (2019):** 600 million user passwords stored in plaintext internally for months.
- **Toyota Subcontractor (2022):** Private encryption keys and access tokens pushed to a public GitHub repository.
- **RockYou2021:** A compilation of 8.4 billion passwords in plaintext, aggregated from years of breaches where companies used weak or no hashing.

### Vulnerable code: Weak password hashing in JavaScript

```javascript
const crypto = require('crypto');

// VULNERABLE: MD5 is broken for password hashing, no salt
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABLE: Hardcoded key, ECB mode
const ENCRYPTION_KEY = 'mySecretKey123';
function encrypt(text) {
  const cipher = crypto.createCipher('aes-128-ecb', ENCRYPTION_KEY);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}
```

### Fixed code: Proper cryptography

```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// SECURE: bcrypt with proper cost factor
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// SECURE: AES-256-GCM with random IV, key from environment
function encrypt(text) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
```

### Vulnerable code: Weak hashing in Python

```python
import hashlib

# VULNERABLE: SHA-1 without salt
def hash_password(password):
    return hashlib.sha1(password.encode()).hexdigest()

# VULNERABLE: Secrets in code
DATABASE_URL = "postgresql://admin:password123@prod-db.example.com/main"
```

### Fixed code: Proper Python cryptography

```python
import bcrypt
import os

# SECURE: bcrypt with automatic salting
def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))

def verify_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Secrets from environment
DATABASE_URL = os.environ['DATABASE_URL']
```

**Free tools:** Semgrep (weak crypto rules, hardcoded secrets), Gitleaks / TruffleHog (secrets detection in git history), Bandit (Python-specific crypto checks).

## A05: Injection

**The problem:** SQL injection, cross-site scripting (XSS), OS command injection, and other forms of untrusted data being interpreted as code. This remains one of the most tested categories, with the largest number of CVEs across all OWASP Top 10 entries.

**How common:** SQL injection CVEs rose from 2,264 in 2023 to 2,400 in 2024. CWE-78 (OS Command Injection) accounted for 18 of CISA's 245 KEV additions in 2025, making it the most common weakness in actively exploited vulnerabilities.

**Real breaches:**
- **ResumeLooters (2023-2024):** Stole 2.2 million records from over 65 job websites using SQL injection and XSS, exfiltrating over 2 million unique email addresses.
- **MOVEit Transfer (2023):** SQL injection vulnerability CVE-2023-34362, exploited by the Cl0p ransomware group, affected hundreds of organizations including Shell, BBC, and the US Department of Energy.

### Vulnerable code: SQL injection in JavaScript

```javascript
// VULNERABLE: String interpolation in SQL
app.get('/api/users', async (req, res) => {
  const { search } = req.query;
  const result = await db.query(
    `SELECT * FROM users WHERE name = '${search}'`
    // Attacker sends: ' OR '1'='1' --
  );
  res.json(result.rows);
});
```

### Fixed code: Parameterized queries

```javascript
// SECURE: Parameterized query
app.get('/api/users', async (req, res) => {
  const { search } = req.query;
  const result = await db.query(
    'SELECT * FROM users WHERE name = $1',
    [search]
  );
  res.json(result.rows);
});

// SECURE: Using an ORM (Prisma)
const users = await prisma.user.findMany({
  where: { name: search }
});
```

### Vulnerable code: XSS in React

```jsx
// VULNERABLE: Rendering unsanitized HTML
function Comment({ body }) {
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
  // Attacker submits: <img src=x onerror="steal(document.cookie)">
}
```

### Fixed code: XSS prevention

```jsx
import DOMPurify from 'dompurify';

// SECURE: Sanitize before rendering
function Comment({ body }) {
  const sanitized = DOMPurify.sanitize(body);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// BEST: Avoid dangerouslySetInnerHTML entirely
function Comment({ body }) {
  return <div>{body}</div>; // React auto-escapes by default
}
```

### Vulnerable code: SQL injection in Python

```python
# VULNERABLE: f-string in SQL
@app.route('/api/users')
def search_users():
    search = request.args.get('search')
    cursor.execute(f"SELECT * FROM users WHERE name = '{search}'")
    return jsonify(cursor.fetchall())
```

### Fixed code: Parameterized Python queries

```python
# SECURE: Parameterized query
@app.route('/api/users')
def search_users():
    search = request.args.get('search')
    cursor.execute("SELECT * FROM users WHERE name = %s", (search,))
    return jsonify(cursor.fetchall())

# SECURE: Using an ORM (SQLAlchemy)
users = User.query.filter_by(name=search).all()
```

**Free tools:** SQLMap (SQL injection testing), Semgrep (injection rules), OWASP ZAP (automated XSS and SQLi scanning), Bandit (Python injection detection), ESLint security plugins.

## A06: Insecure Design

**The problem:** Architectural and business logic flaws that cannot be fixed with better implementation. Missing rate limiting, no fraud controls, trust boundary violations, and absent threat modeling.

**How common:** Maximum incidence rate of 11.33%. Business logic flaws totaled 2% of all vulnerabilities with a 5% year-over-year increase. The crypto and blockchain industries saw a 37% increase in business logic flaw exploitation from 2023 to 2024.

**Real breaches:**
- **Equifax (2017):** Exposed PII of 147 million people. Root causes included insecure design, poor patch management, and fundamentally inadequate security architecture.
- **Crypto/Blockchain exploits (2023-2024):** Business logic flaws in smart contracts and DeFi protocols accounted for billions in losses.

### Vulnerable code: No rate limiting, no business constraints

```javascript
// VULNERABLE: Unlimited login attempts
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    return res.json({ token: jwt.sign({ id: user.id }, SECRET) });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// VULNERABLE: No purchase limits (enables bot scalping)
app.post('/api/purchase', authenticate, async (req, res) => {
  const { itemId, quantity } = req.body;
  await createOrder(req.user.id, itemId, quantity);
  res.json({ success: true });
});
```

### Fixed code: Design-level security controls

```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Try again later.' }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    return res.json({
      token: jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' })
    });
  }
  // Generic message: don't reveal if email exists
  res.status(401).json({ error: 'Invalid email or password' });
});

// Business logic constraints
app.post('/api/purchase', authenticate, purchaseLimiter, async (req, res) => {
  const { itemId, quantity } = req.body;
  if (quantity < 1 || quantity > 5) {
    return res.status(400).json({ error: 'Quantity must be 1-5' });
  }
  const recentPurchases = await getRecentPurchases(req.user.id, itemId);
  if (recentPurchases + quantity > 10) {
    return res.status(429).json({ error: 'Purchase limit exceeded' });
  }
  await createOrder(req.user.id, itemId, quantity);
  res.json({ success: true });
});
```

**Free tools:** OWASP Threat Dragon (threat modeling), Semgrep (custom business logic rules), manual code review.

## A07: Authentication Failures

**The problem:** Weak session management, credential stuffing, missing MFA, predictable tokens, password reset flaws, JWT misconfigurations.

**How common:** Maximum incidence rate of 15.80%. 36 mapped CWEs.

**Real breaches:**
- **Okta Credential Stuffing (April 2024):** An unprecedented surge in proxy-driven credential stuffing attacks using residential proxies and combo lists. Customers affected included 23andMe, Roku, and Hot Topic.
- **23andMe (2023):** Credential stuffing exposed genetic data of 6.9 million users. Attackers used passwords from prior breaches, then scraped connected relatives' data.
- **Snowflake Platform (2024):** Attackers exploited privileged accounts without MFA, moving laterally and exfiltrating data from customers including Ticketmaster and AT&T.

### Vulnerable code: Weak session management in JavaScript

```javascript
// VULNERABLE: Predictable tokens, no expiry, no cookie flags
app.post('/api/login', async (req, res) => {
  if (await validateUser(req.body.username, req.body.password)) {
    const sessionId = req.body.username + '_' + Date.now();
    sessions[sessionId] = { username: req.body.username };
    res.cookie('session', sessionId); // No httpOnly, no secure flag
    res.json({ success: true });
  }
});
```

### Fixed code: Secure session management

```javascript
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '__Host-sid',
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000
  },
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient })
}));
```

### Vulnerable code: Weak JWT in Python

```python
import jwt

# VULNERABLE: No expiry, weak secret, no claims validation
def create_token(user_id):
    return jwt.encode({'user_id': user_id}, 'secret123', algorithm='HS256')
```

### Fixed code: Secure JWT in Python

```python
import jwt
import os
from datetime import datetime, timedelta, timezone

def create_token(user_id: int) -> str:
    payload = {
        'sub': user_id,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(hours=1),
        'iss': 'myapp',
        'aud': 'myapp-api'
    }
    return jwt.encode(payload, os.environ['JWT_SECRET'], algorithm='HS256')

def verify_token(token: str) -> dict:
    return jwt.decode(
        token,
        os.environ['JWT_SECRET'],
        algorithms=['HS256'],
        issuer='myapp',
        audience='myapp-api'
    )
```

**Free tools:** OWASP ZAP (session management testing), Burp Suite Community (manual auth testing), Hydra (credential testing), Semgrep (JWT and session rules).

## A08: Software or Data Integrity Failures

**The problem:** Software updates, critical data, or CI/CD pipelines that are not protected against integrity violations. This includes insecure deserialization, unsigned artifacts, and compromised build systems.

**How common:** CWE-502 (Deserialization of Untrusted Data) was a factor in 14 of CISA's 245 KEV additions in 2025, making it the second most common weakness in actively exploited vulnerabilities.

**Real breaches:**
- **SolarWinds Orion (2020):** Attackers injected malicious code into the CI/CD build pipeline, distributing a backdoored update to over 18,000 customers including US government agencies and Fortune 500 companies.

### Vulnerable code: Unsafe deserialization in JavaScript

```javascript
const serialize = require('node-serialize');

// VULNERABLE: Deserializing user-controlled data enables RCE
app.post('/api/session', (req, res) => {
  const sessionData = Buffer.from(
    req.cookies.session, 'base64'
  ).toString();
  const obj = serialize.unserialize(sessionData);
  res.json(obj);
});
```

### Fixed code: Safe parsing with validation

```javascript
// SECURE: JSON.parse with schema validation
app.post('/api/session', (req, res) => {
  try {
    const sessionData = Buffer.from(
      req.cookies.session, 'base64'
    ).toString();
    const obj = JSON.parse(sessionData);
    const validated = sessionSchema.parse(obj); // zod validation
    res.json(validated);
  } catch {
    res.status(400).json({ error: 'Invalid session' });
  }
});
```

### Vulnerable code: Pickle deserialization in Python

```python
import pickle, base64

# VULNERABLE: pickle can execute arbitrary code on load
@app.route('/api/load-state', methods=['POST'])
def load_state():
    data = base64.b64decode(request.data)
    state = pickle.loads(data)  # Arbitrary code execution
    return jsonify(state)
```

### Fixed code: JSON with schema validation

```python
from pydantic import BaseModel

class AppState(BaseModel):
    user_id: int
    preferences: dict

# SECURE: JSON with Pydantic validation
@app.route('/api/load-state', methods=['POST'])
def load_state():
    try:
        data = request.get_json()
        state = AppState(**data)
        return jsonify(state.dict())
    except Exception:
        abort(400)
```

**Free tools:** Semgrep (deserialization rules), Bandit (Python `pickle.loads` detection), npm audit, Sigstore/Cosign (artifact signing and verification).

## A09: Security Logging and Alerting Failures

**The problem:** Missing audit logs for security-relevant events, insufficient monitoring, no alerting on suspicious activity. Without logging, breaches go undetected for months.

**How common:** Organizations took an average of 194 days to identify a data breach in 2024. That is over six months of attackers operating undetected.

**Real breaches:**
- **Snowflake Platform (2024):** Insufficient monitoring of privileged accounts allowed attackers to move laterally and exfiltrate data over an extended period. Inadequate logging complicated forensic investigation.
- **Microsoft Sentinel (September 2024):** A monitoring agent bug disrupted log collection for nearly three weeks, creating blind spots in threat detection.
- **Cloudflare Logging Pipeline (November 2024):** A misconfiguration caused a cascading failure that eliminated approximately 55% of customer logs over a 3.5-hour window.

### Vulnerable code: No audit logging

```javascript
// VULNERABLE: Security-relevant events are invisible
app.post('/api/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (user) {
    res.json({ token: createToken(user) });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
    // Failed login: no log, no alert, no trail
  }
});

app.delete('/api/users/:id', adminOnly, async (req, res) => {
  await User.destroy(req.params.id);
  res.json({ success: true });
  // Admin deleting a user with zero audit trail
});
```

### Fixed code: Structured audit logging

```javascript
import winston from 'winston';

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.File({ filename: 'audit.log' })
  ]
});

app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  const user = await authenticate(email, req.body.password);

  if (user) {
    auditLogger.info('login_success', {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    res.json({ token: createToken(user) });
  } else {
    auditLogger.warn('login_failure', {
      email,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

**Free tools:** ELK Stack (Elasticsearch, Logstash, Kibana), Grafana Loki, Falco (runtime security monitoring), OWASP Logging Cheat Sheet.

## A10: Mishandling of Exceptional Conditions (New in 2025)

**The problem:** Programs that fail to prevent, detect, and respond to unusual conditions: improper error handling, failing open instead of closed, resource leaks in error paths, null pointer dereferences, and swallowed exceptions that hide security problems.

**How common:** 24 mapped CWEs including CWE-209 (Info Exposure via Error Messages), CWE-476 (NULL Pointer Dereference), CWE-636 (Not Failing Securely), and CWE-391 (Unchecked Error Condition).

**Real-world scenarios (from OWASP documentation):**
- Resource exhaustion via exception-triggered resource leaks leading to denial of service.
- Sensitive data exposure via database error messages that reveal schema, enabling SQL injection refinement.
- Financial transaction corruption via interrupted multi-step processes that fail open.

### Vulnerable code: Fail-open authorization

```javascript
// VULNERABLE: Grants access when auth service is down
async function checkPermission(userId, resource) {
  try {
    const response = await fetch(`${AUTH_SERVICE}/check`, {
      body: JSON.stringify({ userId, resource })
    });
    const { allowed } = await response.json();
    return allowed;
  } catch (error) {
    return true; // FAIL OPEN -- auth service down means everyone gets in
  }
}
```

### Fixed code: Fail-closed with proper error handling

```javascript
// SECURE: Denies access when auth service is unavailable
async function checkPermission(userId, resource) {
  try {
    const response = await fetch(`${AUTH_SERVICE}/check`, {
      body: JSON.stringify({ userId, resource }),
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      throw new Error(`Auth service returned ${response.status}`);
    }
    const { allowed } = await response.json();
    return allowed;
  } catch (error) {
    logger.error('auth_check_failed', {
      userId, resource, error: error.message
    });
    return false; // FAIL CLOSED -- deny by default
  }
}
```

### Vulnerable code: Swallowed exceptions in Python

```python
# VULNERABLE: Silently swallows all errors
def transfer_funds(from_account, to_account, amount):
    try:
        debit(from_account, amount)
        credit(to_account, amount)
    except Exception:
        pass  # Money debited but never credited?
```

### Fixed code: Proper exception handling with transactions

```python
import logging

logger = logging.getLogger(__name__)

def transfer_funds(from_account: str, to_account: str, amount: float):
    try:
        with db.transaction():  # Atomic: both succeed or both roll back
            debit(from_account, amount)
            credit(to_account, amount)
    except InsufficientFundsError:
        logger.warning("Insufficient funds",
                       extra={"from": from_account, "amount": amount})
        raise
    except DatabaseError as e:
        logger.error("Transfer failed",
                     extra={"from": from_account, "to": to_account})
        raise TransferFailedError("Transfer could not be completed") from e
```

**Free tools:** Semgrep (bare except, empty catch rules), ESLint (`no-empty` rule), Pylint, SonarQube Community Edition.

## Free Tools Summary: What Catches What

Here is a consolidated view of which free tools map to which OWASP categories. This is the toolstack I recommend in the [free security toolstack guide](/blog/free-security-toolstack/).

| Tool | Type | Categories Covered |
|------|------|--------------------|
| Semgrep | SAST | A01, A04, A05, A07, A08, A10 |
| OWASP ZAP | DAST | A01, A02, A05, A07 |
| Trivy | SCA + IaC | A02, A03 |
| OWASP Dependency-Check | SCA | A03 |
| Bandit | SAST (Python) | A04, A05, A08 |
| ESLint Security Plugins | SAST (JS) | A05, A10 |
| Gitleaks / TruffleHog | Secrets | A02, A04 |
| Socket.dev | Supply Chain | A03 |
| SonarQube Community | SAST | A01 through A10 |
| ScoutSuite | Cloud | A02 |
| Grafana Loki / ELK | Logging | A09 |
| OWASP Threat Dragon | Threat Modeling | A06 |

No single tool covers everything. The combination of Semgrep (SAST) plus Trivy (SCA) plus OWASP ZAP (DAST) gives you broad coverage across most categories for zero dollars. If you are building a [compliance-ready SaaS](/blog/saas-compliance-stack/), this trio should be in your CI/CD pipeline from day one.

## The OWASP API Security Top 10 (2023)

APIs have their own threat landscape. The OWASP API Security Top 10 was last updated in 2023 and is still the current edition. It focuses on API-specific attack patterns that the main Top 10 does not fully address.

| Rank | Category | Description |
|------|----------|-------------|
| API1 | Broken Object Level Authorization | Manipulating object IDs to access other users' data |
| API2 | Broken Authentication | Weak auth mechanisms specific to API contexts |
| API3 | Broken Object Property Level Authorization | Exposing or allowing modification of properties users should not access |
| API4 | Unrestricted Resource Consumption | No rate limiting, enabling denial of service |
| API5 | Broken Function Level Authorization | Accessing admin-level API functions without proper checks |
| API6 | Unrestricted Access to Sensitive Business Flows | Automated abuse of business features like bot scalping |
| API7 | Server Side Request Forgery | APIs that fetch external resources without validation |
| API8 | Security Misconfiguration | Missing headers, verbose errors, default configurations |
| API9 | Improper Inventory Management | Exposed old API versions, undocumented endpoints |
| API10 | Unsafe Consumption of APIs | Trusting third-party API responses without validation |

Three categories were new in 2023: Unrestricted Access to Sensitive Business Flows (API6), SSRF (API7), and Unsafe Consumption of APIs (API10). Injection and Insufficient Logging dropped off the API list, though they remain significant concerns. BOLA (API1) remains the number one API vulnerability, reflecting how common it is for APIs to expose internal object references without proper authorization checks.

If you are building an API-first product, map your endpoints against this list. Every endpoint that accepts an object ID in its path or query string is a potential BOLA vector. Every endpoint that calls a third-party API is a potential unsafe consumption risk.

## The OWASP LLM Top 10 (2025)

AI applications introduce entirely new vulnerability categories. The OWASP Top 10 for Large Language Model Applications was updated for 2025 and reflects the rapid evolution of real-world LLM deployments.

| Rank | Category | Description |
|------|----------|-------------|
| LLM01 | Prompt Injection | Manipulating inputs to override instructions or extract data |
| LLM02 | Sensitive Information Disclosure | LLMs leaking training data or PII |
| LLM03 | Supply Chain | Compromised models, datasets, or plugins |
| LLM04 | Data and Model Poisoning | Corrupting training data to influence outputs |
| LLM05 | Improper Output Handling | Unsanitized LLM outputs leading to XSS or injection |
| LLM06 | Excessive Agency | LLM agents granted too many permissions |
| LLM07 | System Prompt Leakage | Extracting system prompts that reveal business logic |
| LLM08 | Vector and Embedding Weaknesses | Vulnerabilities in RAG systems and vector databases |
| LLM09 | Misinformation / Overreliance | Trusting LLM outputs without verification |
| LLM10 | Unbounded Consumption | Resource exhaustion and runaway costs |

Two categories are new for 2025: **System Prompt Leakage** (LLM07) and **Vector and Embedding Weaknesses** (LLM08). The latter is particularly relevant given that 53% of companies use RAG pipelines rather than fine-tuning, making vector databases a growing attack surface.

If you are building AI products, **Prompt Injection** (LLM01) is the equivalent of SQL injection for LLMs: the number one risk, and the hardest to fully eliminate. Treat all user inputs to LLMs as untrusted, just like you would with database queries. For a deeper dive into building AI systems that pass compliance audits, see the [audit-ready LLM architecture](/blog/audit-ready-llm-architecture/) guide.

## Mapping It All Together: 2021 to 2025 Comparison

| 2021 Rank | 2021 Category | 2025 Rank | 2025 Category | Change |
|-----------|---------------|-----------|---------------|--------|
| A01 | Broken Access Control | A01 | Broken Access Control | Stayed (absorbed SSRF) |
| A02 | Cryptographic Failures | A04 | Cryptographic Failures | Dropped 2 spots |
| A03 | Injection | A05 | Injection | Dropped 2 spots |
| A04 | Insecure Design | A06 | Insecure Design | Dropped 2 spots |
| A05 | Security Misconfiguration | A02 | Security Misconfiguration | Rose 3 spots |
| A06 | Vulnerable and Outdated Components | A03 | Software Supply Chain Failures | Expanded and rose 3 spots |
| A07 | Identification and Authentication Failures | A07 | Authentication Failures | Stayed (renamed) |
| A08 | Software and Data Integrity Failures | A08 | Software or Data Integrity Failures | Stayed |
| A09 | Security Logging and Monitoring Failures | A09 | Security Logging and Alerting Failures | Stayed (renamed) |
| A10 | Server-Side Request Forgery | -- | Merged into A01 | Consolidated |
| -- | -- | A10 | Mishandling of Exceptional Conditions | NEW |

The biggest signal in this evolution: **supply chain and misconfiguration have overtaken traditional injection as the primary concerns**. This does not mean injection is less dangerous. It means that frameworks and ORMs have made injection harder to introduce accidentally, while cloud infrastructure and dependency ecosystems have made misconfigurations and supply chain attacks easier to exploit at scale.

## What to Do Next

Knowing the OWASP Top 10 is step one. Acting on it is what matters. Here is a practical sequence.

**This week:** Run `npm audit` or `pip-audit` on your current projects. Fix critical and high severity findings. Set up Dependabot or Renovate for automated dependency updates.

**This month:** Add Semgrep to your CI/CD pipeline. Start with the default security rulesets. Every pull request gets scanned before merge.

**This quarter:** Run OWASP ZAP against your staging environment. Review the findings, prioritize anything in the A01 through A05 range. Set up structured logging if you do not already have it.

**Ongoing:** Conduct threat modeling for new features. Review the OWASP Top 10 during architecture decisions. If you are preparing for [SOC 2](/blog/how-to-prepare-soc-2-audit/), documenting how you address each OWASP category is strong evidence for the Security and Availability trust service criteria.

The OWASP Top 10 is not a compliance checkbox. It is a map of where real attackers are actually succeeding. Use it as one.

## Frequently Asked Questions

**What changed in the OWASP Top 10 2025 compared to 2021?**
The 2025 edition added two new categories: Software Supply Chain Failures (A03) and Mishandling of Exceptional Conditions (A10). SSRF was merged into Broken Access Control (A01). Security Misconfiguration rose from #5 to #2, while Injection dropped from #3 to #5. The analysis covered 175,000+ CVE records mapped to 643 CWEs, up from 241 in 2021.

**What is the most common OWASP Top 10 vulnerability?**
Broken Access Control (A01) remains the most common and most serious application security risk, affecting 3.73% of tested applications. It has held the number one position for two consecutive OWASP editions and covers 40 mapped CWEs including IDOR, privilege escalation, and SSRF.

**What free tools can I use to test for OWASP Top 10 vulnerabilities?**
The core free toolstack includes Semgrep for static analysis (covers injection, access control, crypto, and deserialization), OWASP ZAP for dynamic application security testing, and Trivy for dependency and infrastructure scanning. Additional free tools include Bandit for Python, Gitleaks for secrets detection, and SonarQube Community Edition for multi-language coverage.

**Is the OWASP API Security Top 10 different from the main Top 10?**
Yes. The OWASP API Security Top 10 (2023 edition, still current) focuses on API-specific attack patterns. Its number one risk is Broken Object Level Authorization (BOLA), which targets how APIs expose internal object references. It also includes API-specific categories like Unrestricted Resource Consumption, Improper Inventory Management, and Unsafe Consumption of APIs that the main Top 10 does not cover directly.

**Does the OWASP Top 10 cover AI and LLM vulnerabilities?**
OWASP maintains a separate Top 10 for Large Language Model Applications, updated for 2025. It covers AI-specific risks including prompt injection (the number one LLM risk), sensitive information disclosure, supply chain attacks on models and datasets, excessive agency in autonomous agents, and new categories for system prompt leakage and vector/embedding weaknesses in RAG systems.

**How often is the OWASP Top 10 updated?**
The main OWASP Top 10 is updated roughly every three to four years. The 2025 edition is the eighth version, following the 2021, 2017, 2013, and 2010 editions. The API Security Top 10 follows a similar cycle and was last updated in 2023. The LLM Top 10 updates more frequently given the rapid evolution of AI technology, with its 2025 edition being the second version.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What changed in the OWASP Top 10 2025 compared to 2021?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2025 edition added two new categories: Software Supply Chain Failures (A03) and Mishandling of Exceptional Conditions (A10). SSRF was merged into Broken Access Control (A01). Security Misconfiguration rose from #5 to #2, while Injection dropped from #3 to #5. The analysis covered 175,000+ CVE records mapped to 643 CWEs, up from 241 in 2021."
      }
    },
    {
      "@type": "Question",
      "name": "What is the most common OWASP Top 10 vulnerability?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Broken Access Control (A01) remains the most common and most serious application security risk, affecting 3.73% of tested applications. It has held the number one position for two consecutive OWASP editions and covers 40 mapped CWEs including IDOR, privilege escalation, and SSRF."
      }
    },
    {
      "@type": "Question",
      "name": "What free tools can I use to test for OWASP Top 10 vulnerabilities?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The core free toolstack includes Semgrep for static analysis (covers injection, access control, crypto, and deserialization), OWASP ZAP for dynamic application security testing, and Trivy for dependency and infrastructure scanning. Additional free tools include Bandit for Python, Gitleaks for secrets detection, and SonarQube Community Edition for multi-language coverage."
      }
    },
    {
      "@type": "Question",
      "name": "Is the OWASP API Security Top 10 different from the main Top 10?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The OWASP API Security Top 10 (2023 edition, still current) focuses on API-specific attack patterns. Its number one risk is Broken Object Level Authorization (BOLA), which targets how APIs expose internal object references. It also includes API-specific categories like Unrestricted Resource Consumption, Improper Inventory Management, and Unsafe Consumption of APIs that the main Top 10 does not cover directly."
      }
    },
    {
      "@type": "Question",
      "name": "Does the OWASP Top 10 cover AI and LLM vulnerabilities?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OWASP maintains a separate Top 10 for Large Language Model Applications, updated for 2025. It covers AI-specific risks including prompt injection (the number one LLM risk), sensitive information disclosure, supply chain attacks on models and datasets, excessive agency in autonomous agents, and new categories for system prompt leakage and vector/embedding weaknesses in RAG systems."
      }
    },
    {
      "@type": "Question",
      "name": "How often is the OWASP Top 10 updated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main OWASP Top 10 is updated roughly every three to four years. The 2025 edition is the eighth version, following the 2021, 2017, 2013, and 2010 editions. The API Security Top 10 follows a similar cycle and was last updated in 2023. The LLM Top 10 updates more frequently given the rapid evolution of AI technology, with its 2025 edition being the second version."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [The Free Security Toolstack: Every Tool You Need for $0](/blog/free-security-toolstack/)
- [Security Testing on a Budget: Penetration Testing for Developers](/blog/security-testing-budget/)

*Building a web application and want to make sure it's secure against the OWASP Top 10? [Let's talk](https://calendly.com/juanidrovo).*
