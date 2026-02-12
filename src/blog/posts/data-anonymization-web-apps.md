---
title: "Data Anonymization Patterns Every Developer Should Implement"
description: "Practical anonymization, pseudonymization, and data masking patterns that satisfy GDPR and CCPA requirements without crippling your analytics pipeline."
date: 2026-02-12
lastModified: 2026-02-12
tags:
  - posts
  - security
  - engineering
  - privacy
  - compliance
---

Every web application collects personal data. User signups, payment records, analytics events, support tickets -- PII accumulates across your database, logs, backups, and third-party integrations faster than most teams realize. The legal obligations around that data are getting stricter every year, and the enforcement is real: EU supervisory authorities have issued over EUR 6.7 billion in GDPR fines since 2018, with right-to-erasure violations becoming a primary enforcement target in 2025.

But here is what most compliance guides get wrong: anonymization is not just a legal checkbox. Done well, it is an engineering pattern that makes your entire system more resilient. Anonymized datasets are safer to share with analysts, cheaper to store, and easier to manage when a user exercises their right to deletion. Done poorly, it creates a false sense of security while leaving your company exposed to re-identification attacks that regulators now understand and test for.

This guide covers the full stack of data anonymization patterns for web applications: the legal requirements that drive them, the techniques that satisfy those requirements, and the database-level implementations that make them practical. Everything here uses open-source tools and standard infrastructure. No enterprise data governance platform required.

## The Legal Framework: Why Anonymization Matters Now

Understanding the legal landscape is not optional. The specific requirements of GDPR, CCPA, and recent court rulings dictate which techniques you need and how rigorous your implementation must be.

### GDPR Article 25: Data Protection by Design

[Article 25 GDPR](https://gdprhub.eu/Article_25_GDPR) requires controllers to implement data protection measures "both at the time of determination of the means for processing and at the time of the processing itself." This is not a suggestion. It is a legal obligation that applies from your first line of code through the entire data lifecycle.

The practical requirements:

- Integrate data protection into processing activities from the design stage.
- Once personal data is no longer needed for its intended purpose, it must be either deleted or anonymized by default.
- Establish systematic procedures for data deletion or anonymization integrated into processing operations.
- Reassess re-identification risk regularly, because a dataset anonymous today may become re-identifiable tomorrow.

The [EDPB Guidelines 4/2019 on Article 25](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201904_dataprotection_by_design_and_by_default_v2.0_en.pdf) provide the detailed implementation guidance. The 2025 updates clarified that large language models rarely achieve anonymization standards, and high-risk AI systems must complete Data Protection Impact Assessments by August 2026.

If you are building a [security-first development practice](/blog/security-first-development-guide/), anonymization by design is a core component, not an afterthought.

### GDPR Recital 26: The Anonymization Threshold

[Recital 26](https://gdpr-info.eu/recitals/no-26/) defines the boundary that matters most: GDPR principles "should not apply to anonymous information, namely information which does not relate to an identified or identifiable natural person or to personal data rendered anonymous in such a manner that the data subject is not or no longer identifiable."

The test for anonymity is stringent. You must account for:

- **All means reasonably likely to be used** by the controller or any other person to identify the natural person.
- **Objective factors** including cost of identification, time required, available technology at the time of processing, and anticipated technological developments.
- **Ongoing obligation** -- a dataset anonymous today may become re-identifiable tomorrow as technology advances and new external data sources emerge.

The critical distinction: pseudonymized data is still personal data under GDPR. [Recital 28](https://gdpr-info.eu/recitals/no-28/) explicitly states that pseudonymization reduces risk but does not exempt controllers from data protection obligations.

### CCPA/CPRA De-Identification Requirements

The [CCPA/CPRA](https://www.jacksonlewis.com/insights/navigating-california-consumer-privacy-act-30-essential-faqs-covered-businesses-including-clarifying-regulations-effective-1126) defines de-identified information as data that "cannot reasonably identify, relate to, describe, be capable of being associated with, or be linked, directly or indirectly, to a particular consumer." Three cumulative requirements must be met:

1. **Technical safeguards** that prohibit re-identification.
2. **Business processes** that specifically prohibit re-identification.
3. **Contractual or policy obligations** preventing employees from attempting re-identification.

Pseudonymized data under CCPA has minimal legal advantage -- it remains personal data subject to all data subject rights including access, deletion, and correction. New regulations effective January 1, 2026 further clarified requirements through the California Privacy Protection Agency.

### The CJEU EDPS v. SRB Ruling: A Landmark Shift

The September 2025 [CJEU ruling in EDPS v. SRB](https://www.skadden.com/insights/publications/2025/11/in-a-landmark-decision-eu-court-clarifies) fundamentally changed how pseudonymized data is classified. The court held that:

- Pseudonymised data is not automatically personal data for all parties.
- Whether data is "personal" is a relative concept that depends on the specific recipient's ability to re-identify.
- Classification depends on whether the recipient has reasonably available means for re-identification, considering technical, organizational, and legal factors.

The practical implication: if you pseudonymize data before sharing it with a third party, and that party cannot reasonably re-identify individuals due to lack of access to the mapping table plus contractual and legal prohibitions, the data may not qualify as personal data in the recipient's hands.

This ruling gives engineering teams a concrete incentive to implement proper pseudonymization architectures with strict key separation.

## Anonymization Techniques: The Theory You Need

These are the mathematical foundations behind anonymization. Understanding them helps you choose the right technique for your data type and risk profile.

### K-Anonymity

A dataset satisfies k-anonymity if every record is indistinguishable from at least k-1 other records with respect to quasi-identifiers -- attributes that could be used for re-identification like age, zip code, and gender.

**Implementation techniques:**

- **Generalization:** Replace specific values with broader categories. Exact age 29 becomes the range 25-30. Full zip code 10001 becomes 100\*\*.
- **Suppression:** Remove entire attribute values or records that cannot be generalized without excessive information loss.
- **Global recoding:** Apply the same generalization level to all values in a column for consistency.

**Where k-anonymity breaks down:**

The **homogeneity attack** is the classic failure mode. If all k records in a group share the same sensitive value, the attacker knows the value regardless of k-anonymity. Imagine a k=5 anonymity group where all five people have "diabetes" as their condition -- an attacker who knows someone is in that group immediately knows their diagnosis.

The **background knowledge attack** uses external data to narrow possibilities within a group. If you know someone's approximate age and neighborhood from social media, you can identify their record even in a k-anonymized dataset.

Optimal k-anonymity is NP-hard, and there is no mathematical way to determine whether an attribute is a quasi-identifier -- it depends on population prevalence and what auxiliary data exists in the wild.

### L-Diversity and T-Closeness

**L-diversity** addresses the homogeneity attack. It requires that each equivalence class has at least l "well-represented" values for each sensitive attribute. A k=4 group with four distinct disease values (l=4) is safer than one where all four records share the same disease.

But l-diversity has its own weaknesses. The **skewness attack** exploits distributional bias: if the overall distribution is 99% negative test results, an l-diverse group that includes a positive result still leaks information. The **similarity attack** exploits semantically similar values -- "gastric ulcer," "stomach cancer," and "gastritis" are technically distinct but reveal the same category of illness.

**T-closeness** addresses both problems by requiring that the distribution of sensitive attributes within any equivalence class differs from the overall table distribution by no more than threshold t, measured using Earth Mover's Distance. It provides stronger guarantees at the cost of significantly more computational overhead and data utility loss.

In practice, most web application teams do not implement these directly. They matter when you are publishing datasets or sharing data with researchers. For operational anonymization, the patterns in the following sections are more practical.

### Differential Privacy

Differential privacy provides a mathematical guarantee: a randomized algorithm satisfies epsilon-differential privacy if adding or removing any single individual's data changes the probability of any output by at most a factor of e^epsilon. The epsilon parameter, called the "privacy budget," controls the tradeoff between privacy and data utility.

**Real-world implementations:**

- **Google RAPPOR** (Randomized Aggregatable Privacy-Preserving Ordinal Response): adds noise on-device before data is sent to servers. Uses bloom filters to convert strings to bit arrays, then applies randomized responses. Google used it to collect statistics about Chrome users' browsing patterns without ever seeing individual data.

- **Apple's Local Differential Privacy:** deployed at scale across hundreds of millions of devices. Randomization happens on the device before data leaves the user's phone. Apple uses it to identify popular emojis, health data types, and Safari media playback preferences without accessing individual records.

The key distinction is where noise is added. **Local differential privacy** (Apple, Google) adds noise on the client device, so the server never sees raw data. **Central differential privacy** adds noise at the server, which requires trust in the central authority but produces more accurate aggregate results.

For most web applications, differential privacy is relevant when you need aggregate analytics from sensitive data. If you are building a survey tool, health tracking app, or anything that aggregates individual responses, this is your strongest option.

## Data Masking Patterns by Field Type

Data masking is the most common anonymization pattern in web applications. The goal is to transform PII so it is no longer identifiable while preserving enough structure for testing, analytics, or display purposes.

### Field-Specific Masking Rules

| Field Type | Masking Pattern | Regex Detection | Example |
|---|---|---|---|
| Email | Preserve domain, mask username | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+` | `tes***@example.com` |
| Phone | Show last 4 digits only | `(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}` | `XXX-XXX-1234` |
| SSN | Show last 4 digits only | `\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b` | `XXX-XX-1234` |
| Name | First initial plus asterisks | NER-based detection | `J*** D**` |
| Address | Generalize to city/state/zip region | NER plus pattern matching | `***, ***, New York, NY 100**` |
| Credit Card | First 6 plus last 4 (BIN preserved) | `\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b` | `4111 11** **** 1111` |

### Implementing a Masking Utility in TypeScript

```typescript
type MaskingRule = {
  pattern: RegExp;
  mask: (value: string) => string;
};

const MASKING_RULES: Record<string, MaskingRule> = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mask: (value: string) => {
      const [local, domain] = value.split("@");
      return `${local.slice(0, 3)}***@${domain}`;
    },
  },
  phone: {
    pattern: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    mask: (value: string) => {
      const digits = value.replace(/\D/g, "");
      return `XXX-XXX-${digits.slice(-4)}`;
    },
  },
  ssn: {
    pattern: /^\d{3}-?\d{2}-?\d{4}$/,
    mask: (value: string) => {
      const digits = value.replace(/\D/g, "");
      return `XXX-XX-${digits.slice(-4)}`;
    },
  },
  creditCard: {
    pattern: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
    mask: (value: string) => {
      const digits = value.replace(/\D/g, "");
      return `${digits.slice(0, 6)}******${digits.slice(-4)}`;
    },
  },
};

function detectAndMask(fieldName: string, value: string): string {
  // Check field name hints first
  const nameHints: Record<string, string> = {
    email: "email",
    ssn: "ssn",
    social_security: "ssn",
    phone: "phone",
    mobile: "phone",
    card_number: "creditCard",
    cc_number: "creditCard",
  };

  const ruleKey = nameHints[fieldName.toLowerCase()];
  if (ruleKey && MASKING_RULES[ruleKey]) {
    return MASKING_RULES[ruleKey].mask(value);
  }

  // Fall back to pattern detection
  for (const [, rule] of Object.entries(MASKING_RULES)) {
    if (rule.pattern.test(value)) {
      return rule.mask(value);
    }
  }

  return value;
}
```

For automated PII detection at scale, [Microsoft Presidio](https://github.com/microsoft/presidio) combines regex, named entity recognition, and context-aware detection. It supports redaction, hashing, masking, and encryption, and deploys via Python, Docker, or Kubernetes.

## Tokenization vs. Encryption vs. Hashing

These three techniques serve different purposes. Choosing the wrong one creates either a security gap or unnecessary complexity.

| Property | Tokenization | Encryption | Hashing |
|---|---|---|---|
| **Reversible** | Yes (via vault lookup) | Yes (with key) | No (one-way) |
| **Format preserved** | Yes (configurable) | No (ciphertext differs) | No (fixed-length output) |
| **Key management** | Token vault | Encryption keys | No key needed (or HMAC key) |
| **Performance** | Vault lookup required | Computational | Fast |
| **Best for** | Payment data, cross-system PII | Data at rest, backups | Verification, deduplication |
| **Compliance advantage** | De-scopes systems from PCI/GDPR | Defense-in-depth | Cannot recover original |

**When to use each:**

**Tokenization** replaces sensitive data with a random token and stores the mapping in a secure vault. The token has no mathematical relationship to the original data, so even if the token is compromised, it reveals nothing. This is the standard approach for payment data (Stripe tokenizes card numbers so you never touch them) and is increasingly used for PII across systems.

**Encryption** transforms data using a mathematical algorithm and a key. AES-256-GCM is the standard for data at rest. Use encryption when you need to retrieve the original value and can manage keys securely. The weakness is that anyone with the key can decrypt everything, so key management is critical.

**Hashing** produces a one-way transformation. SHA-256 or bcrypt turns data into a fixed-length digest that cannot be reversed. Use it for verification (password checking) and deduplication (matching records without exposing values). For pseudonymization, use HMAC-SHA-256 with a secret key -- the key prevents rainbow table attacks.

The 2025 trend in tokenization is expanding beyond PCI to cover PII, PHI, behavioral data, and LLM pipelines. The winning approach combines deterministic tokens, format preservation, policy-as-code, and lifecycle automation with deletion receipts.

## Pseudonymization Patterns

Pseudonymization replaces identifying data with artificial identifiers while maintaining the ability to re-link records when authorized. Under GDPR, pseudonymized data is still personal data, but the EDPS v. SRB ruling gives it a new strategic value: properly pseudonymized data shared without the mapping key may not be personal data in the recipient's hands.

### EDPB 2025 Guidelines on Pseudonymisation

The [EDPB adopted pseudonymisation guidelines on January 17, 2025](https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en). Key concepts every developer should understand:

- **Pseudonymisation domain:** The context in which pseudonymisation prevents attribution to specific data subjects. This may be restricted to defined entities or authorized recipients.
- **Transformation process:** Requires applying a pseudonymising transformation using one or more pseudonyms (new identifiers) so that data cannot be attributed to a specific individual without additional information.
- **Technical and organizational measures (TOMs):** Access restrictions, decentralized storage of pseudonymization secrets, random generation of pseudonyms.

### Mapping Table Architecture

The mapping table connects pseudonyms back to real identifiers. Its architecture determines the security of your entire pseudonymization system.

```text
[Application DB]          [Pseudonymization Service]          [Key Vault]
     |                           |                                |
     |  pseudonymize(email)      |                                |
     |-------------------------->|                                |
     |                           |  lookup/generate mapping       |
     |                           |-----> [Mapping Table]          |
     |                           |  encrypt with key from ------->|
     |  return: pseudo_id_abc123 |                                |
     |<--------------------------|                                |
```

Critical implementation rules from the EDPB guidance:

- Mapping tables must be stored separately and securely from the pseudonymized dataset.
- Use dedicated secret management: [HashiCorp Vault](https://developer.hashicorp.com/vault/docs/concepts/transform), AWS KMS, or Hardware Security Modules.
- Never hard-code encryption keys in application code. This is covered in detail in [secrets management best practices](/blog/secrets-management-developers/).
- Implement network segmentation, secure APIs, and rate-limiting to prevent brute forcing.
- Strict role-based access -- only authorized personnel with legitimate need.
- Audit logging on all access to mapping tables.

### Format-Preserving Encryption (FPE)

FPE encrypts data while preserving its original format. A 16-digit credit card number encrypts to another 16-digit number. A 9-digit SSN encrypts to another 9-digit string. This allows encrypted data to pass existing validation rules and fit existing database schemas without modification.

For Node.js, the available libraries are:

- **[fpe-nodejs (FF1)](https://github.com/Arjunkalidas/fpe-nodejs)** -- Implements the NIST FF1 mode, which remains in the standard.
- **[node-fe1-fpe](https://github.com/eCollect/node-fe1-fpe)** -- FE1 scheme ported from the Botan Library.
- **[ubiq-fpe-node](https://github.com/ubiqsecurity/ubiq-fpe-node)** -- Commercial FPE for Node.js.

Important: NIST withdrew the FF3 mode in February 2025 due to a cryptographic attack discovered by Beyne. Prefer FF1-based implementations.

### Consistent Pseudonymization Across Systems

When multiple services need to reference the same user without exposing real identifiers, you need deterministic pseudonymization: the same input always produces the same pseudonymized output.

```typescript
import { createHmac } from "crypto";

const PSEUDONYMIZATION_KEY = process.env.PSEUDO_KEY!;

function pseudonymize(identifier: string): string {
  return createHmac("sha256", PSEUDONYMIZATION_KEY)
    .update(identifier)
    .digest("hex")
    .slice(0, 16); // Truncate for readability
}

// Same input + same key = same pseudonym everywhere
pseudonymize("user@example.com"); // always "a3f8b2c1d4e5f6a7"
```

Google Cloud DLP uses [HMAC-SHA-256 for deterministic pseudonymization](https://cloud.google.com/sensitive-data-protection/docs/pseudonymization) for exactly this reason. The secret key prevents third parties from verifying whether a pseudonym corresponds to a known identifier.

For cross-system consistency, use a centralized pseudonymization service that all systems call rather than each system implementing its own logic. This eliminates key synchronization issues and provides a single audit point.

## Database-Level Anonymization

This is where theory meets production. Database-level patterns give you anonymization that works automatically, without relying on application code to handle it correctly every time.

### PostgreSQL Anonymizer

[PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/) is a declarative anonymization extension that defines masking rules using PostgreSQL DDL. It requires pgcrypto from postgresql-contrib and supports four strategies: dynamic masking, static masking (in-place), anonymous dumps, and generalization.

```sql
-- Install the extension
CREATE EXTENSION IF NOT EXISTS anon CASCADE;

-- Define masking rules as security labels
SECURITY LABEL FOR anon ON COLUMN users.email
  IS 'MASKED WITH FUNCTION anon.fake_email()';

SECURITY LABEL FOR anon ON COLUMN users.name
  IS 'MASKED WITH FUNCTION anon.fake_first_name()
      || '' '' || anon.fake_last_name()';

SECURITY LABEL FOR anon ON COLUMN users.phone
  IS 'MASKED WITH FUNCTION anon.partial(phone, 0, ''XXX-XXX-'', 4)';

-- Dynamic masking: analysts see masked data, admins see raw data
SELECT anon.start_dynamic_masking();

-- Create a masked role
CREATE ROLE analyst_user LOGIN;
SECURITY LABEL FOR anon ON ROLE analyst_user IS 'MASKED';

-- When analyst_user queries users table, they see fake emails
-- When admin queries the same table, they see real data
```

The power of this approach is that masking rules live in the database schema, not in application code. Every query from a masked role automatically returns anonymized data regardless of which application or tool is making the query.

### pgcrypto for Field-Level Encryption

```sql
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive fields
UPDATE users SET
  ssn_encrypted = pgp_sym_encrypt(ssn, current_setting('app.encryption_key')),
  ssn = NULL;

-- Decrypt when needed (only for authorized queries)
SELECT pgp_sym_decrypt(
  ssn_encrypted,
  current_setting('app.encryption_key')
) AS ssn
FROM users
WHERE id = 123;
```

Store the encryption key in your secrets manager, not in the database configuration. Set it per-session using `SET app.encryption_key = '...'` from your application layer, pulling the value from your vault at connection time.

### Row-Level Security for PII Access Control

Row-Level Security (RLS) lets you control which rows different database roles can access. Combined with views that mask columns, this gives you fine-grained PII access control at the database level.

```sql
-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Analysts can only see non-sensitive records
CREATE POLICY analyst_access ON users
  FOR SELECT
  TO analyst_role
  USING (sensitivity_level < 3);

-- Support team can only see users they are assigned to
CREATE POLICY support_access ON users
  FOR SELECT
  TO support_role
  USING (assigned_support_agent = current_user);
```

### Views That Strip PII for Analytics

Create a dedicated analytics schema with views that expose only what analysts need.

```sql
-- Create a dedicated schema for analysts
CREATE SCHEMA analytics;

-- View that strips and masks PII
CREATE VIEW analytics.users AS
  SELECT
    id,
    -- Mask email: show domain only
    '***@' || split_part(email, '@', 2) AS email_domain,
    -- Generalize age to bracket
    CASE
      WHEN age < 18 THEN '< 18'
      WHEN age BETWEEN 18 AND 25 THEN '18-25'
      WHEN age BETWEEN 26 AND 35 THEN '26-35'
      WHEN age BETWEEN 36 AND 50 THEN '36-50'
      ELSE '50+'
    END AS age_bracket,
    -- Keep non-PII fields
    signup_date,
    plan_type,
    country
  FROM public.users;

-- Grant access only to the view
GRANT USAGE ON SCHEMA analytics TO analyst_role;
GRANT SELECT ON analytics.users TO analyst_role;
-- Revoke direct table access
REVOKE ALL ON public.users FROM analyst_role;
```

This pattern means `SELECT * FROM users` returns masked data for analysts and raw data for admins, depending on their role and search path. No application code changes required.

### Prisma Field-Level Encryption

For applications using Prisma, the [prisma-field-encryption](https://github.com/47ng/prisma-field-encryption) library provides transparent field-level encryption using AES-256-GCM. Since Prisma 4.16.0, middlewares are deprecated in favor of client extensions.

```prisma
// schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  email String /// @encrypted
  name  String /// @encrypted
  phone String /// @encrypted
  plan  String // not encrypted -- safe for analytics
}
```

```typescript
import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const prisma = new PrismaClient().$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  })
);

// Writes are automatically encrypted
await prisma.user.create({
  data: {
    email: "user@example.com", // stored encrypted
    name: "Jane Doe", // stored encrypted
    phone: "+1-555-0123", // stored encrypted
    plan: "pro", // stored in plaintext
  },
});

// Reads are automatically decrypted
const user = await prisma.user.findUnique({ where: { id: 1 } });
console.log(user.email); // "user@example.com" (decrypted)
```

The triple-slash `/// @encrypted` comment in the Prisma schema marks fields for automatic encryption on writes and decryption on reads. The library also supports key rotation for when you need to cycle encryption keys.

For searching encrypted fields, [prisma-deterministic-search-field-encryption](https://github.com/godspeedsystems/prisma-deterministic-search-field-encryption) stores a deterministic hash alongside the encrypted value, enabling `WHERE` clause lookups without decrypting every row.

## Data Retention Automation

Data retention is where most teams accumulate compliance debt. Without automated retention policies, data sits in your database forever, increasing your liability surface and making right-to-erasure requests a manual nightmare.

### Schema Patterns for Retention Policies

Build retention metadata into your schema from day one.

```sql
-- Add retention metadata to tables
ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE users ADD COLUMN retention_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN data_category VARCHAR(50);
-- Categories: 'transactional', 'consent', 'legal_hold'

-- Automatically set retention on record creation
CREATE OR REPLACE FUNCTION set_retention_policy()
RETURNS TRIGGER AS $$
BEGIN
  NEW.retention_expires_at := CASE NEW.data_category
    WHEN 'transactional' THEN NEW.created_at + INTERVAL '3 years'
    WHEN 'consent' THEN NEW.created_at + INTERVAL '1 year'
    WHEN 'legal_hold' THEN NULL -- no automatic expiry
    ELSE NEW.created_at + INTERVAL '2 years'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_retention
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_retention_policy();

-- Automated cleanup job (run via pg_cron or application scheduler)
DELETE FROM users
WHERE retention_expires_at < now()
  AND data_category != 'legal_hold';
```

This approach makes retention self-documenting. Every record carries its own expiration date, and the cleanup job is a single query. If your [compliance stack](/blog/saas-compliance-stack/) requires audit evidence of data retention enforcement, the trigger and cleanup job provide it.

### Soft Delete vs. Hard Delete vs. Anonymize-in-Place vs. Crypto-Shredding

| Strategy | Mechanism | GDPR Compliant? | Pros | Cons |
|---|---|---|---|---|
| Soft delete | `deleted_at` timestamp, exclude from queries | Usually not sufficient -- data still exists | Reversible, audit trail | PII still in DB and backups |
| Hard delete | `DELETE FROM` | Yes, if comprehensive including backups | True removal | Cascade complexity, backup issues |
| Anonymize-in-place | Replace PII with masked/fake data, keep record | Yes -- recognized as equivalent to erasure | Preserves referential integrity and analytics value | Must ensure irreversibility |
| Crypto-shredding | Delete the per-user encryption key | Yes -- data becomes unreadable | Works across distributed systems including backups | Requires per-user key architecture |

**Soft delete is almost never sufficient for GDPR compliance.** The data still exists, is still accessible in backups, and can be recovered. Regulators have made clear that logical deletion alone does not satisfy Article 17.

**Anonymize-in-place is the recommended default** for most web applications. You preserve referential integrity (orders still exist, they just no longer link to an identifiable person) and maintain analytics value while satisfying the legal requirement.

**Crypto-shredding is the gold standard for distributed systems.** Each user is assigned a unique encryption key. All their PII is encrypted with that key. When they request deletion, you delete one key in one place, and all their data becomes permanently unreadable across every system, including backups and logs. Spotify's "Padlock" system uses exactly this architecture.

### Implementing Right to Erasure

The EDPB made [Article 17 the focus of its 2025 Coordinated Enforcement Action](https://cms-lawnow.com/en/ealerts/2024/12/article-17-gdpr-in-the-edpb-s-next-coordinated-action). Here is a practical implementation pattern.

```typescript
async function handleErasureRequest(userId: string): Promise<void> {
  // Step 1: Verify the requester's identity
  await verifyIdentity(userId);

  // Step 2: Check for legal exceptions (Article 17(3))
  const exceptions = await checkErasureExceptions(userId);
  if (exceptions.hasLegalHold) {
    throw new Error("Cannot erase: active legal hold");
  }
  if (exceptions.hasRegulatoryRetention) {
    // Anonymize what we can, retain what law requires
    await partialAnonymize(userId, exceptions.retainedFields);
    return;
  }

  // Step 3: Anonymize the primary record
  await prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${userId}@anonymized.local`,
      name: "REDACTED",
      phone: null,
      address: null,
      dateOfBirth: null,
      // Preserve non-PII for analytics
      plan: undefined, // keep as-is
      signupDate: undefined, // keep as-is
    },
  });

  // Step 4: Anonymize related records
  await prisma.order.updateMany({
    where: { userId },
    data: { shippingAddress: "REDACTED", billingName: "REDACTED" },
  });

  await prisma.supportTicket.updateMany({
    where: { userId },
    data: { content: "REDACTED", attachments: null },
  });

  // Step 5: Delete the user's encryption key (crypto-shredding)
  await keyVault.deleteKey(`user-key-${userId}`);

  // Step 6: Log the erasure for compliance audit
  await prisma.auditLog.create({
    data: {
      action: "ERASURE_COMPLETED",
      targetUserId: userId,
      timestamp: new Date(),
      performedBy: "system:erasure-handler",
    },
  });

  // Step 7: Notify downstream systems
  await publishEvent("user.erased", { userId, timestamp: new Date() });
}
```

The exceptions check in Step 2 is critical. Article 17(3) lists several grounds where erasure does not apply: freedom of expression, legal obligation to retain, public interest, and defense of legal claims. Your implementation must handle partial erasure when some data must be retained.

For [SOC 2 audit preparation](/blog/how-to-prepare-soc-2-audit/), the audit log in Step 6 provides the evidence trail that auditors look for. Every erasure request should be logged with who requested it, when it was completed, and what actions were taken.

### Cascade Deletion Patterns

Foreign key relationships make deletion complex. Here is the recommended pattern.

```sql
-- Option 1: CASCADE - automatic but dangerous for audit trails
ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

-- Option 2: SET NULL - preserve the order, lose the user link
ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE SET NULL;

-- Option 3 (recommended): Anonymize-then-nullify
-- Step 1: Anonymize the user record
UPDATE users SET
  email = 'deleted-' || id || '@anonymized.local',
  name = 'REDACTED',
  phone = NULL,
  address = NULL
WHERE id = :user_id;

-- Step 2: Anonymize PII snapshots in related tables
UPDATE orders SET
  user_email_snapshot = 'REDACTED',
  shipping_name = 'REDACTED'
WHERE user_id = :user_id;

-- Step 3: Optionally nullify the foreign key
UPDATE orders SET user_id = NULL WHERE user_id = :user_id;
```

Option 3 is the safest approach. You preserve the order records for financial reporting while removing all PII. The anonymized user record maintains referential integrity, and the order history remains usable for aggregate analytics.

## Analytics Without PII

You do not need to track individual users to get useful analytics. The privacy-first analytics movement has produced tools that give you everything you need for product decisions without collecting a single piece of personal data.

### Privacy-First Analytics Tools

**[Plausible Analytics](https://plausible.io/):** Open-source, EU-hosted in Estonia, all data routes through EU servers. No cookies, no personal data collection. Lightweight script at approximately 1KB. GDPR, CCPA, and PECR compliant by default. Best for small-to-medium sites wanting simple, compliant analytics.

**[Fathom Analytics](https://usefathom.com/):** Privacy-first, zero PII collection, entirely cookieless. GDPR, CCPA, and PECR compliant by design. Best for teams wanting managed, privacy-compliant analytics without self-hosting.

**[Umami](https://umami.is/):** Open-source, self-hostable, no cookies, no personal data tracking. Umami v3 released in November 2025 with significant updates. Best for developers wanting full control and self-hosting capability.

The market is shifting away from Google Analytics in 2025-2026, driven by GA4 complexity and growing privacy concerns. Switching to a privacy-first analytics tool eliminates an entire category of compliance risk.

### Aggregate-Only Data Patterns

If you need custom analytics beyond what these tools provide, collect aggregate data from the start.

```typescript
// Instead of tracking individual users
// BAD: analytics.track("page_view", { userId, page, timestamp })

// Track aggregate counters
// GOOD: analytics.increment("page_views", { page: "/pricing", date: "2026-02-12" })

async function trackPageView(page: string): Promise<void> {
  const date = new Date().toISOString().split("T")[0];

  await prisma.pageViewAggregate.upsert({
    where: { page_date: { page, date } },
    update: { count: { increment: 1 } },
    create: { page, date, count: 1 },
  });
}
```

This pattern stores no individual user data at all. You get the metrics you need for product decisions -- which pages are popular, what the conversion funnel looks like, where users drop off -- without any PII to protect, anonymize, or delete.

Cloudflare's [Distributed Aggregation Protocol (DAP)](https://blog.cloudflare.com/deep-dive-privacy-preserving-measurement/) takes this further with multi-party computation: the aggregation is distributed across servers using secret sharing, so no single server has a complete measurement.

## Testing with Anonymized Data

Production data should never appear in test environments. Use synthetic data generation and snapshot redaction to test realistic scenarios without PII exposure.

### Generating Realistic Test Data with Faker.js

[Faker.js](https://fakerjs.dev/) generates realistic fake data across 50+ locales. Seed it for deterministic, reproducible test runs.

```typescript
import { faker } from "@faker-js/faker";

// Seed for reproducible test data across CI runs
faker.seed(12345);

function generateTestUser() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    },
    ssn: faker.string.numeric({ length: 9 }),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
    creditCard: faker.finance.creditCardNumber(),
  };
}

// Generate 1000 users with consistent, reproducible data
const testUsers = Array.from({ length: 1000 }, generateTestUser);
```

Every test run with the same seed produces the same data. This eliminates flaky tests caused by random data while ensuring no real PII leaks into test environments.

### Snapshot Testing with PII Redaction

When snapshot tests capture objects containing PII-shaped fields, use custom serializers to redact them automatically.

```typescript
// test/pii-redactor.ts
const piiRedactor = {
  test(val: unknown) {
    return (
      val !== null &&
      typeof val === "object" &&
      ("email" in val || "ssn" in val || "phone" in val)
    );
  },
  serialize(
    val: Record<string, unknown>,
    config: unknown,
    indentation: string,
    depth: number,
    refs: unknown[],
    printer: Function
  ) {
    const redacted = { ...val };
    if (redacted.email) redacted.email = "[REDACTED:EMAIL]";
    if (redacted.ssn) redacted.ssn = "[REDACTED:SSN]";
    if (redacted.phone) redacted.phone = "[REDACTED:PHONE]";
    if (redacted.name) redacted.name = "[REDACTED:NAME]";
    return printer(redacted, config, indentation, depth, refs);
  },
};

expect.addSnapshotSerializer(piiRedactor);
```

With this serializer registered, snapshot files store `[REDACTED:EMAIL]` instead of actual email addresses. Even if someone accidentally seeds a test with production data, the snapshots remain clean. This is a belt-and-suspenders approach that catches the case where a developer copies a production record into a test fixture.

The alternative pattern uses property matchers for more targeted redaction:

```typescript
test("user data structure", () => {
  const user = createUser();
  expect(user).toMatchSnapshot({
    email: expect.any(String),
    phone: expect.any(String),
    ssn: expect.any(String),
    createdAt: expect.any(Date),
  });
});
```

## Putting It All Together: An Anonymization Strategy

Here is the decision framework for choosing the right anonymization pattern based on your use case.

**For data you display to the user:** Use masking. Show partial emails, masked phone numbers, and last-four of credit cards. This is a UI concern, not a storage concern.

**For data you share with analysts:** Use database views that strip PII, PostgreSQL Anonymizer with dynamic masking, or aggregate-only collection. Analysts should never see raw PII.

**For data you share with third parties:** Use pseudonymization with HMAC-SHA-256 and strict key separation. The EDPS v. SRB ruling may mean the data is not personal data in the recipient's hands, but only if you implement proper controls.

**For data you no longer need:** Use anonymize-in-place as the default, with crypto-shredding for distributed systems. Hard delete only when you do not need to preserve any record structure.

**For right-to-erasure requests:** Combine anonymize-in-place with crypto-shredding. Anonymize the database records, delete the encryption key, log the action, and notify downstream systems.

**For test environments:** Use Faker.js for synthetic data generation and snapshot redaction to prevent PII leaks. Never copy production data to test environments.

**For analytics:** Switch to Plausible, Fathom, or Umami. If you need custom analytics, collect aggregate counters instead of individual user events.

The common thread across all of these patterns is that anonymization works best when it is built into your architecture from the start -- as a database schema concern, a Prisma configuration, a CI pipeline check -- rather than applied retroactively when a regulator comes knocking.

## Frequently Asked Questions

**What is the difference between anonymization and pseudonymization under GDPR?**
Anonymization makes data permanently non-identifiable, removing it from GDPR scope entirely. Pseudonymization replaces identifiers with artificial ones but retains the ability to re-link via a mapping table. Pseudonymized data is still personal data under GDPR and subject to all data protection obligations. The 2025 CJEU ruling in EDPS v. SRB clarified that pseudonymized data may not be personal data for recipients who lack access to the re-identification key.

**Does anonymized data fall outside GDPR requirements?**
Yes, but only if the anonymization is truly irreversible. GDPR Recital 26 states that the regulation does not apply to anonymous information. However, the test is stringent: you must account for all means reasonably likely to be used by any person to re-identify, including future technological developments. If re-identification is possible, the data is still personal data regardless of what you call it.

**What is crypto-shredding and when should I use it?**
Crypto-shredding encrypts each user's personal data with a unique key and deletes that key when erasure is requested. This makes the data permanently unreadable across all systems including backups and logs without needing to locate and delete every copy. It is the recommended approach for distributed systems, microservices architectures, and any system where data is replicated across multiple stores.

**Is soft delete sufficient for GDPR right-to-erasure compliance?**
No. Soft delete sets a deleted_at timestamp but leaves the data intact and recoverable. GDPR Article 17 requires actual erasure. EU regulators have clarified that logical deletion alone does not satisfy the right to erasure. Use anonymize-in-place, hard delete, or crypto-shredding instead. Anonymize-in-place is the recommended approach because it preserves referential integrity while removing all PII.

**How do I handle analytics without collecting personal data?**
Use privacy-first analytics tools like Plausible, Fathom, or Umami that collect no personal data and require no cookies. For custom analytics, collect aggregate counters instead of individual user events. Rather than tracking each page view with a user ID, increment a counter for views per page per day. You get the metrics needed for product decisions without any PII to protect or delete.

**What changed with the 2025 CJEU EDPS v. SRB ruling on pseudonymized data?**
The September 2025 ruling established that whether pseudonymized data constitutes personal data is relative to the recipient. If the recipient lacks reasonably available means to re-identify individuals, considering technical, organizational, and legal factors, the data may not be personal data in their hands. This gives organizations a concrete incentive to implement proper pseudonymization with strict key separation before sharing data with third parties.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between anonymization and pseudonymization under GDPR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Anonymization makes data permanently non-identifiable, removing it from GDPR scope entirely. Pseudonymization replaces identifiers with artificial ones but retains the ability to re-link via a mapping table. Pseudonymized data is still personal data under GDPR and subject to all data protection obligations. The 2025 CJEU ruling in EDPS v. SRB clarified that pseudonymized data may not be personal data for recipients who lack access to the re-identification key."
      }
    },
    {
      "@type": "Question",
      "name": "Does anonymized data fall outside GDPR requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, but only if the anonymization is truly irreversible. GDPR Recital 26 states that the regulation does not apply to anonymous information. However, the test is stringent: you must account for all means reasonably likely to be used by any person to re-identify, including future technological developments. If re-identification is possible, the data is still personal data regardless of what you call it."
      }
    },
    {
      "@type": "Question",
      "name": "What is crypto-shredding and when should I use it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Crypto-shredding encrypts each user's personal data with a unique key and deletes that key when erasure is requested. This makes the data permanently unreadable across all systems including backups and logs without needing to locate and delete every copy. It is the recommended approach for distributed systems, microservices architectures, and any system where data is replicated across multiple stores."
      }
    },
    {
      "@type": "Question",
      "name": "Is soft delete sufficient for GDPR right-to-erasure compliance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Soft delete sets a deleted_at timestamp but leaves the data intact and recoverable. GDPR Article 17 requires actual erasure. EU regulators have clarified that logical deletion alone does not satisfy the right to erasure. Use anonymize-in-place, hard delete, or crypto-shredding instead. Anonymize-in-place is the recommended approach because it preserves referential integrity while removing all PII."
      }
    },
    {
      "@type": "Question",
      "name": "How do I handle analytics without collecting personal data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use privacy-first analytics tools like Plausible, Fathom, or Umami that collect no personal data and require no cookies. For custom analytics, collect aggregate counters instead of individual user events. Rather than tracking each page view with a user ID, increment a counter for views per page per day. You get the metrics needed for product decisions without any PII to protect or delete."
      }
    },
    {
      "@type": "Question",
      "name": "What changed with the 2025 CJEU EDPS v. SRB ruling on pseudonymized data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The September 2025 ruling established that whether pseudonymized data constitutes personal data is relative to the recipient. If the recipient lacks reasonably available means to re-identify individuals, considering technical, organizational, and legal factors, the data may not be personal data in their hands. This gives organizations a concrete incentive to implement proper pseudonymization with strict key separation before sharing data with third parties."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [Security-First Development: A Practical Guide](/blog/security-first-development-guide/)
- [The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters](/blog/saas-compliance-stack/)
- [Secrets Management for Developers: From .env Files to Production Vaults](/blog/secrets-management-developers/)

*Designing a data handling strategy that satisfies GDPR and your customers? [Let's talk](https://calendly.com/juanidrovo).*
