---
title: "Audit-Ready LLM Architecture: How to Build AI Products That Pass SOC 2, EU AI Act, and ISO 42001"
description: "A practical architecture guide for building LLM-powered products that satisfy SOC 2, EU AI Act, and ISO 42001 requirements without rebuilding your stack."
date: 2026-02-11
lastModified: 2026-02-11
tags:
  - posts
  - compliance
  - security
  - ai
  - engineering
---

Every company building LLM-powered products will face the same question: can you prove this system is safe, fair, and auditable?

The question comes from different directions depending on your market. Enterprise buyers ask for your [SOC 2 report](/blog/what-is-soc-2-compliance/). European regulators ask for EU AI Act conformity documentation. Forward-thinking compliance teams ask about ISO 42001 certification. The underlying concern is the same: your AI does things that affect people, and someone needs to verify that you've built it responsibly.

The good news is that these frameworks share roughly 70% of their requirements. Risk management, data governance, logging, human oversight, bias monitoring, and incident response appear across all of them. An architecture designed for one can satisfy most of the others with incremental effort.

This guide maps the practical engineering decisions that make an LLM product audit-ready across SOC 2, EU AI Act, and ISO 42001, without requiring you to rebuild your stack.

## The Framework Landscape

Before diving into architecture, it's worth understanding what each framework actually requires and where they overlap.

### ISO 42001: The AI Management System

ISO/IEC 42001, published in December 2023, is the first international standard for AI management systems. It establishes a systematic approach to managing AI risks across the organization. Its core requirements include:

- An AI policy and objectives aligned to business strategy
- Risk assessment for AI-specific threats (bias, transparency, safety)
- Controls for data governance, model development, and third-party AI management
- Continuous monitoring and improvement cycles

Certification typically costs $40,000-$150,000 and takes 3-9 months. Annual surveillance audits run 20-30% of the original certification fee.

### EU AI Act: The Regulatory Floor

The [EU AI Act](/blog/direct-effect-ai-act/) takes full effect for high-risk AI systems on August 2, 2026. Articles 9-15 define the technical requirements that high-risk system providers must satisfy:

| Article | Requirement | Engineering Translation |
|---|---|---|
| Art. 9 | Risk management system | Documented risk assessment with continuous monitoring |
| Art. 10 | Data governance | Training data lineage, bias examination, quality controls |
| Art. 11 | Technical documentation | System architecture, design choices, evaluation results |
| Art. 12 | Record-keeping | Automatic event logging retained at least 6 months |
| Art. 13 | Transparency | Clear documentation of capabilities, limitations, intended use |
| Art. 14 | Human oversight | Human-machine interfaces for effective human intervention |
| Art. 15 | Accuracy, robustness, cybersecurity | Declared accuracy levels, adversarial testing, security controls |

Penalties scale to EUR 35 million or 7% of global annual turnover. SMEs and startups get proportionally lower caps.

### SOC 2: The Buyer Requirement

[SOC 2](/blog/what-is-soc-2-compliance/) doesn't include AI-specific controls, but its Trust Services Criteria are broad enough to cover AI systems. Auditors are increasingly mapping AI-specific risks to each category:

- **Security:** Access controls for model endpoints, training pipelines, and vector databases. Protection of model weights as sensitive assets.
- **Availability:** SLAs for inference endpoints. Fallback mechanisms when models fail.
- **Processing Integrity:** Controls ensuring AI systems process data as intended, from input validation through output verification.
- **Confidentiality:** Prevention of training data leakage. Ensuring model outputs don't expose other customers' information.
- **Privacy:** PII detection in prompts and responses. Consent management for data used in AI training.

Including AI components within scope of an existing SOC 2 Type II is a low-cost way to provide reasonable assurance to customers without pursuing an entirely separate certification.

### NIST AI RMF: The Connective Tissue

The NIST AI Risk Management Framework (AI 100-1) is voluntary and not certifiable, but it provides the conceptual foundation that maps across all other frameworks. Its four functions (Govern, Map, Measure, Manage) align to specific clauses in ISO 42001, articles in the EU AI Act, and Trust Services Criteria in SOC 2.

NIST has published official crosswalk documents mapping the AI RMF to ISO 42001. The key finding: significant overlap in governance and risk management, with the main difference being that NIST is voluntary while ISO 42001 is certifiable. Assessors can verify compliance across multiple frameworks in a single integrated assessment.

## The Cross-Framework Architecture

The following architecture components satisfy requirements across all four frameworks simultaneously. Each component is mapped to the specific framework requirements it addresses.

### 1. Logging and Observability

**What it satisfies:** EU AI Act Art. 12, SOC 2 CC7.x (Monitoring), ISO 42001 A.6.3, NIST MEASURE

This is the single most important investment for audit readiness. If you can demonstrate exactly what your AI system did and why, you can defend any audit finding. If you can't, every other control is weakened.

**What to log:**

| Category | Data Points | Why It Matters |
|---|---|---|
| User context | user_id, session_id, auth_method | Attribution and access tracking |
| Model data | Full prompt, system prompt, response, model version | Reproducibility and investigation |
| Token metrics | tokens_input, tokens_output, total cost | Resource monitoring and anomaly detection |
| Operational metrics | Latency, provider, error codes | Availability and performance SLAs |
| RAG context | Retrieved chunks, source documents, similarity scores | Data lineage for compliance |
| Safety events | Guardrail triggers, content filter activations, policy violations | Risk monitoring and incident detection |
| Agent actions | Tool calls, external API requests, workflow decisions | Accountability for autonomous actions |

**Architecture guidance:**

Use OpenTelemetry GenAI semantic conventions for standardized instrumentation. Emit spans for every critical step: retrieval, prompt assembly, inference, tool usage, and post-processing. Attach prompt and output content via events (not span attributes) to avoid payload bloat.

Implement PII redaction in logs before storage. The EU AI Act requires event logs retained for at least six months. SOC 2 auditors typically expect 90 days minimum, with one year preferred.

**The common mistake:** Logging only errors. Auditors want to see normal operations documented, not just failures. A system that only logs when something goes wrong tells the auditor nothing about how it operates when things go right.

### 2. Input/Output Validation

**What it satisfies:** EU AI Act Art. 15 (Robustness), SOC 2 PI1.x (Processing Integrity), ISO 42001 A.6.2, NIST MEASURE

Position a modular governance layer between user applications and your LLM: an API gateway that operates as an LLM-agnostic validation interface.

**Input guardrails** (pre-inference):
- Prompt injection detection (pattern analysis, blocking known attack vectors)
- Input sanitization and format validation
- Context filtering (preventing sensitive data from reaching the model)
- Jailbreak detection

**Output guardrails** (post-inference):
- Schema enforcement and output validation
- Toxic language detection
- PII leak detection in responses
- Business rule alignment (ensuring outputs conform to expected parameters)
- Hallucination checks (cross-referencing claims against source documents for RAG systems)

**Performance tip:** Input validation and LLM response generation can be parallelized. If guardrails trigger, discard the LLM generation and route to an intervention flow. This avoids adding latency to the happy path.

The key distinction for auditors: model alignment (training-based safety) is different from guardrails (external filters). Both are necessary. Guardrails can be updated without retraining the model, making them the faster path to addressing new risks.

### 3. Model Versioning and Reproducibility

**What it satisfies:** EU AI Act Art. 11 (Technical Documentation), SOC 2 CC8.x (Change Management), ISO 42001 A.6, NIST MAP

The core principle: given Model V1 + Training Data V3 + Training Code V2.1, you must be able to reproduce the exact same model. Corporate and government compliance may require investigation on both the model and data: every version of productionized models must be accessible.

**What to version:**
- Model weights and configuration
- Training datasets, labels, and preprocessing code
- Hyperparameters and training parameters
- Evaluation results and benchmark scores
- Feature engineering code
- Prompt templates and system prompts

**The MLOps stack for compliance:**
- Source control (Git) for all code and configuration
- Model registry (MLflow, Weights & Biases) for model artifacts
- Dataset versioning (DVC, Git LFS) for training data
- Metadata store for experiment tracking

For teams using hosted models (OpenAI, Anthropic, etc.) rather than training their own: version your prompt templates, system prompts, and model configuration (temperature, max tokens, model ID). Pin specific model versions rather than using "latest." Document when model providers update their models and test for regressions.

### 4. Data Lineage and Provenance

**What it satisfies:** EU AI Act Art. 10 (Data Governance), SOC 2 P-series (Privacy), ISO 42001 A.7, NIST MAP

The EU AI Act places significant emphasis on data governance. Article 10 requires documented data governance practices covering: collection processes, data origin, original purpose, data preparation, assumptions, and assessment of suitability. It mandates examination for possible biases and requires appropriate measures to detect, prevent, and mitigate identified biases.

For RAG systems, this means tracking which documents were indexed, when they were last updated, where they came from, and how they were chunked and embedded. If a customer exercises their [right to deletion](/blog/rag-pipelines-right-to-be-forgotten/), you need to trace exactly which embeddings correspond to their data.

**Architecture components:**
- Metadata management for comprehensive model and data tracking
- End-to-end data lineage visibility across the entire pipeline
- Automated quality monitoring for AI-specific data flows
- Granular access controls aligned with privacy requirements

AI lineage goes beyond traditional data lineage: it must track feature engineering, model training processes, inference decisions, and derived attributes that traditional lineage tools weren't designed to capture.

### 5. Access Controls for AI Systems

**What it satisfies:** SOC 2 CC6.x (Logical Access), EU AI Act Art. 14 (Human Oversight), ISO 42001 A.9, NIST GOVERN

Traditional RBAC is insufficient for LLM systems because prompts can implicitly request information users didn't explicitly navigate to. A user with access to a customer support chatbot shouldn't be able to extract financial data by rephrasing their question cleverly.

**Enforce permissions at three layers:**

1. **Prompt layer:** what users can ask (topic restrictions, role-based prompt policies)
2. **Retrieval layer:** what data the system can access to answer (document-level permissions in your vector database, tenant isolation for multi-tenant systems)
3. **Output layer:** what information can be returned (output filtering, redaction of unauthorized data)

For multi-tenant SaaS products, this is especially critical. Your vector database must enforce tenant boundaries so that one customer's data never appears in another customer's RAG context. This is load-bearing infrastructure, not a nice-to-have.

SOC 2 auditors will test this directly. Expect questions about how you prevent cross-tenant data leakage in AI responses, how you handle prompt-based privilege escalation, and how access is revoked when a customer churns.

### 6. Bias Testing and Fairness Monitoring

**What it satisfies:** EU AI Act Art. 10, ISO 42001 A.5/A.7, SOC 2 PI1.x, NIST MAP/MEASURE

If your AI makes or influences decisions about people (hiring, lending, insurance, healthcare, content moderation), bias testing isn't optional. It's already legally required in multiple jurisdictions:

- **NYC Local Law 144** (effective July 2023): Annual bias audits for automated employment decision tools, $500-$1,500 per day for violations
- **Colorado SB 205** (effective June 2026): Annual discrimination reviews for high-risk AI
- **Illinois HB 3773** (effective January 2026): Prohibits discriminatory AI in employment
- **EU AI Act Article 10**: Mandates bias detection and mitigation in training data

**Core testing methods:**
- Disparate impact testing (the "four-fifths rule": does the unprivileged group get positive outcomes less than 80% as often as the privileged group?)
- Counterfactual testing (swap sensitive attributes and check if outcomes change)
- Demographic parity and equalized odds metrics

**Tooling:** IBM AI Fairness 360, Microsoft Fairlearn, Amazon SageMaker Clarify, and Google's What-If Tool all provide bias detection capabilities. The critical point is continuous monitoring, not one-time testing; biases can emerge as models interact with new data post-deployment.

### 7. Incident Response for AI Failures

**What it satisfies:** EU AI Act Art. 62, SOC 2 CC7.x/CC8.x, ISO 42001 Clause 10.2, NIST MANAGE

Traditional incident response plans fail for AI systems because AI incidents don't look like traditional security incidents:

- **Harm without compromise:** Discrimination, misinformation, or unsafe recommendations can occur without being hacked
- **Gradual failure:** Model decay, drift, and emergent behavior surface slowly, not as sudden outages
- **Opaque root causes:** Spanning data pipelines, training choices, prompt design, and vendor dependencies
- **Detection lag:** AI incidents take an average of 4.5 days to detect

Your AI incident response plan needs to account for failure modes that traditional IR doesn't cover:

| Failure Mode | Detection Method | Response |
|---|---|---|
| Hallucination | Output validation, user reports | Confidence thresholds, source citation requirements |
| Data poisoning | Training data monitoring, output anomaly detection | Model rollback, data quarantine |
| Prompt injection | Input pattern analysis, guardrail triggers | Request blocking, incident logging |
| Model drift | Performance benchmarks, accuracy monitoring | Retraining trigger, fallback model |
| Bias emergence | Fairness metrics dashboards, statistical testing | Model adjustment, human review pipeline |
| Data leakage | Output monitoring, PII detection | Immediate containment, breach notification |

EU AI Act Article 62 specifically requires serious incident reporting for high-risk AI systems. Your IR plan should include: who reports, to which authority, within what timeframe, and what documentation is required.

## The Integration Strategy

You don't need to pursue all four frameworks simultaneously. Here's the practical sequencing:

### Phase 1: SOC 2 Foundation (3-6 months)

If you're selling to enterprise buyers, SOC 2 is the most immediate requirement. Include your AI components within scope of your SOC 2 audit from the start. This means:

- Logging and observability for AI endpoints
- Access controls and tenant isolation
- Change management for model updates and prompt changes
- Incident response procedures covering AI-specific failures

This phase satisfies your buyers' most urgent questions and builds the evidence base that other frameworks require. For a detailed preparation checklist, see the [SOC 2 audit preparation guide](/blog/how-to-prepare-soc-2-audit/).

### Phase 2: NIST AI RMF Alignment (concurrent)

Map your existing controls to the NIST AI RMF's four functions. This is a documentation exercise, not an engineering project; you're organizing what you've already built into the framework's structure. The NIST Playbook provides specific suggested actions for each subcategory.

This alignment serves two purposes: it prepares you for ISO 42001 certification (which shares significant overlap) and demonstrates risk management maturity to regulators and enterprise buyers who reference the AI RMF.

### Phase 3: EU AI Act Compliance (by August 2026)

If you serve EU customers with high-risk AI systems, the August 2, 2026 deadline is firm. The incremental work beyond your SOC 2 and NIST foundation:

- Conformity assessment (self-assessment for most Annex III systems)
- Technical documentation per Annex IV (system description, design choices, evaluation results)
- Transparency obligations (user-facing documentation of capabilities and limitations)
- Data governance documentation per Article 10

SMEs may use a simplified form for technical documentation.

### Phase 4: ISO 42001 Certification (6-12 months after Phase 1)

ISO 42001 builds on everything above. The incremental requirements are primarily organizational:

- Formal AI policy and objectives
- Management review processes
- Internal audit program for AI systems
- Supplier and third-party AI management

The certification adds credibility in international markets, particularly in Europe and Asia-Pacific. For companies that already have [ISO 27001](/blog/soc-2-vs-iso-27001/), the audit can be combined.

## Cost Reality

| Framework | Cost Range | Timeline | Annual Maintenance |
|---|---|---|---|
| SOC 2 (with AI in scope) | $30,000-$100,000 | 3-12 months | $15,000-$30,000 |
| NIST AI RMF alignment | Internal effort only | 1-3 months | Minimal |
| EU AI Act compliance | Varies (primarily documentation) | 3-6 months | Ongoing monitoring |
| ISO 42001 | $40,000-$150,000 | 3-9 months | 20-30% of initial cost |
| **Integrated approach** | **$80,000-$200,000** | **6-15 months** | **$30,000-$60,000** |

The integrated approach costs less than pursuing each framework independently because assessors can verify compliance across multiple frameworks in a single assessment and the shared controls (risk management, logging, access controls, documentation) are implemented once.

## What Enforcement Looks Like

The cost of non-compliance is not theoretical.

**Clearview AI** accumulated approximately EUR 95.7 million in GDPR fines across Italy, France, the Netherlands, and Greece for AI-driven facial recognition without consent. The SEC brought "AI washing" enforcement actions against Delphia ($225,000), Global Predictions ($175,000), and Nate Inc. ($42M+ fraud) for misrepresenting AI capabilities. Securities class actions targeting AI misrepresentations increased 100% between 2023 and 2024.

These are pre-EU AI Act penalties. When the full penalty regime takes effect in August 2026, the enforcement landscape shifts significantly.

## Frequently Asked Questions

**Do I need ISO 42001 if I already have SOC 2?**
They serve different purposes. SOC 2 demonstrates security controls to buyers. ISO 42001 demonstrates an AI-specific management system. If your buyers are asking about responsible AI practices, fairness, and transparency rather than just security, ISO 42001 addresses those concerns directly. Many companies pursue both.

**What if I use hosted models (OpenAI, Anthropic) rather than training my own?**
You're still responsible for how you deploy and use those models. Version your prompts and configuration. Document your model selection rationale. Implement guardrails around inputs and outputs. Monitor for bias and accuracy in your specific use case. The EU AI Act's obligations for deployers apply regardless of who built the model.

**Can I include AI in my existing SOC 2 audit or do I need a separate engagement?**
Including AI within your existing SOC 2 scope is the most cost-effective approach. Discuss with your auditor which Trust Services Criteria apply to your AI components. Security is mandatory. Processing Integrity and Privacy are often relevant for AI systems. Your auditor can design tests specific to your AI architecture.

**What qualifies as "high-risk" under the EU AI Act?**
Annex III defines high-risk categories: biometric identification, critical infrastructure management, education and vocational training, employment and worker management, access to essential services (credit, insurance), law enforcement, migration and border control, and administration of justice. If your AI system makes or influences decisions in any of these areas, it's likely high-risk.

**How do I handle compliance when my AI capabilities evolve rapidly?**
Treat prompt templates, model configurations, and guardrail rules as code: version-controlled, peer-reviewed, and deployed through your CI/CD pipeline. This means compliance documentation stays synchronized with your actual system. When you change a system prompt or switch model versions, the change management process captures it automatically.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need ISO 42001 if I already have SOC 2?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They serve different purposes. SOC 2 demonstrates security controls to buyers. ISO 42001 demonstrates an AI-specific management system covering responsible AI practices, fairness, and transparency. Many companies pursue both, especially those selling AI products to enterprise customers."
      }
    },
    {
      "@type": "Question",
      "name": "What if I use hosted models (OpenAI, Anthropic) rather than training my own?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You are still responsible for how you deploy and use hosted models. Version your prompts and configuration, document your model selection rationale, implement guardrails around inputs and outputs, and monitor for bias and accuracy. The EU AI Act's obligations for deployers apply regardless of who built the model."
      }
    },
    {
      "@type": "Question",
      "name": "Can I include AI in my existing SOC 2 audit or do I need a separate engagement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Including AI within your existing SOC 2 scope is the most cost-effective approach. Discuss with your auditor which Trust Services Criteria apply. Security is mandatory. Processing Integrity and Privacy are often relevant. Your auditor can design tests specific to your AI architecture."
      }
    },
    {
      "@type": "Question",
      "name": "What qualifies as \"high-risk\" under the EU AI Act?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Annex III defines high-risk categories: biometric identification, critical infrastructure management, education and vocational training, employment and worker management, access to essential services (credit, insurance), law enforcement, migration and border control, and administration of justice. If your AI system makes or influences decisions in any of these areas, it is likely high-risk."
      }
    },
    {
      "@type": "Question",
      "name": "How do I handle compliance when my AI capabilities evolve rapidly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Treat prompt templates, model configurations, and guardrail rules as code: version-controlled, peer-reviewed, and deployed through your CI/CD pipeline. This ensures compliance documentation stays synchronized with your actual system. When you change a system prompt or switch model versions, the change management process captures it automatically."
      }
    }
  ]
}
</script>

---

**Keep reading:**
- [SOC 2 Compliance Explained: What It Is, Who Needs It, and How to Get Certified](/blog/what-is-soc-2-compliance/)
- [The SaaS Compliance Stack: SOC 2, ISO 27001, GDPR, and What Actually Matters](/blog/saas-compliance-stack/)
- [RAG Pipelines and the Right to Be Forgotten: An Engineering Problem Disguised as a Legal One](/blog/rag-pipelines-right-to-be-forgotten/)

*Building AI products and need a compliance roadmap? [Let's talk](https://calendly.com/juanidrovo).*
