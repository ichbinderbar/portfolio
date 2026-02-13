---
title: "The Secret Sauce Isn't Better Prompts: How I Actually Use AI Coding Assistants"
description: "The developers getting 10x productivity from AI aren't writing better prompts. They've built systems around their tools. Here's exactly how."
date: 2026-02-13
lastModified: 2026-02-13
tags:
  - posts
  - ai
  - engineering
  - ai-agents
  - devops
---

Everyone wants the magic prompt. The one sentence that makes an AI assistant produce perfect code on the first try. I spent months chasing that too, optimizing how I phrase requests, tweaking temperature settings, trying different conversation starters. It helped a little. But the real productivity jump came from something completely different.

The developers I've seen get genuinely transformative results from AI coding tools - myself included - aren't writing better prompts. They've built systems around their AI tools. Persistent instructions, automated guardrails, parallel workflows, and CI/CD integrations that turn a chatbot into something closer to a junior engineering team that never sleeps.

I'm going to walk through my exact setup. Not theory. Not "you could do this." This is what I actually run every day.

## CLAUDE.md: The Foundation That Changes Everything

The single highest-impact thing I've done is create a `CLAUDE.md` file at the root of every project I work on. This is a markdown file that the AI assistant reads automatically at the start of every conversation. Think of it as onboarding documentation for your AI pair programmer.

Here's why this matters: without persistent instructions, every conversation starts from zero. You end up repeating the same context over and over. "We use Eleventy for the blog." "Don't use prisma db push, it skips migration tracking." "The test command is bun test, not npm test." Every repeated instruction is wasted time and wasted tokens.

A `CLAUDE.md` file eliminates that entirely. Mine typically includes:

- **Build and run commands** - the exact commands for dev server, tests, builds, and deployment
- **Architecture overview** - what the project is, how it's structured, where key files live
- **Hard rules** - things the AI must never do (destructive database commands, specific antipatterns)
- **Style conventions** - naming patterns, file organization, import preferences
- **Links to deeper docs** - pointers to specialized documentation files for complex subsystems

The file doesn't need to be long. My portfolio site's `CLAUDE.md` is maybe 40 lines. But those 40 lines mean the assistant knows it's a Parcel-bundled site with Bootstrap 4 and SCSS, knows the exact npm commands, knows the blog runs on Eleventy, and knows not to touch certain files without being asked.

For larger projects, I layer this with a global `~/.claude/CLAUDE.md` that contains rules that apply across all my work. Things like commit message conventions, tools to avoid, and documentation preferences. The project-level file inherits those and adds project-specific context.

The compounding effect is significant. After a few weeks, the assistant essentially "knows" your codebase. Not because it remembers previous conversations - it doesn't - but because the instructions are always there, always fresh, always loaded before the first interaction.

## Custom Slash Commands: One Keystroke, Complex Workflows

The second layer is custom commands. Most AI coding tools support some form of user-defined commands that expand into full prompts. I use these heavily for workflows I repeat multiple times per week.

The pattern is simple: identify a multi-step workflow you do repeatedly, encode it as a reusable command, and reduce it to a single invocation.

Here are the ones I use most:

**Blog writer command.** I write regularly, and every post follows a specific format - frontmatter structure, heading conventions, ending format with "Keep reading" links, SEO metadata, Nunjucks escaping rules. Instead of explaining all of this every time I want a new post, I have a command that loads the full spec. I type one command, give it a topic, and get a post that matches my exact format without any back-and-forth.

**Code review command.** Before committing, I run a review command that checks for bugs, security vulnerabilities, adherence to project patterns, and code quality. It's opinionated about what matters and filters out noise. This catches things I'd miss in a manual scan, especially late at night.

**SEO audit command.** For any page I'm about to ship, I have a command that checks meta tags, structured data, heading hierarchy, internal linking, and AI discoverability signals. It's essentially a pre-flight checklist that runs in seconds.

The important thing about custom commands isn't any individual command - it's the pattern of encoding expertise into reusable artifacts. Every time you find yourself explaining the same context or workflow to the assistant, that's a signal to create a command. Over time, you build a library of specialized capabilities that make the base tool dramatically more useful.

## Git Worktrees: The Parallel Development Multiplier

This one is underrated and I rarely see other developers talk about it in the context of AI tools.

Git worktrees let you check out multiple branches of the same repository into separate directories simultaneously. Each worktree is a full working copy with its own branch, its own staging area, and its own working state. They share the same `.git` directory, so they're lightweight and fast to create.

Why does this matter for AI-assisted development? Because you can run multiple AI sessions in parallel, each working on a different feature in a different worktree, without any conflicts.

The workflow looks like this:

```bash
# Create worktrees for parallel work
git worktree add ../feature-auth feat/authentication
git worktree add ../feature-search feat/search-refactor
git worktree add ../bugfix-api fix/api-validation
```

Now I have three separate directories, each on their own branch. I can open three terminal sessions, start an AI assistant in each one, and work on three things simultaneously. The auth feature is being built in one worktree. The search refactor is happening in another. The API bug is being fixed in the third.

When each is done, I review the changes, merge them back, and delete the worktrees. The whole cycle from "I have three things to do" to "all three are merged" collapses from days to hours.

This approach works especially well for tasks that are independent but need to happen in the same codebase. Bug fixes, feature branches, refactoring efforts - anything where the changes don't overlap significantly. And because each worktree has its own `CLAUDE.md` context, the AI sessions don't step on each other.

The combination of worktrees and AI assistants is the closest thing I've found to [the agentic engineering approach](/blog/the-agentic-architect-openclaw/) that Peter Steinberger describes - operating like a full team from a single seat.

## Hooks: Automated Guardrails That Prevent Disasters

Here's where things get interesting. Most AI coding tools now support hooks - automated actions that trigger before or after specific tool calls. Think of them as git hooks, but for AI interactions.

I use hooks for three categories of protection:

### Pre-execution validation

Before the AI runs any shell command, a hook can inspect the command and block it if it matches dangerous patterns. Database drops, force pushes, deleting protected directories - anything that would be catastrophic if executed by mistake. The AI works fast, and sometimes fast means it reaches for a destructive shortcut. Hooks prevent that from ever reaching the shell.

### Post-edit quality checks

After the AI edits a file, hooks can run linters, type checkers, or custom validation scripts automatically. If the edit introduces a syntax error or a type violation, the hook catches it immediately - before the AI moves on to the next file and builds on top of a broken change.

### Prompt-based decision gates

This is the most powerful pattern. You can configure a hook that sends the proposed action to a separate AI model for a yes/no safety judgment. "Is this edit safe? Does it follow our conventions? Could it introduce a security vulnerability?" The reviewing model acts as a second pair of eyes on every significant action.

I've seen security teams use this pattern to route every file modification through a stronger model that evaluates whether the change is safe to auto-approve. For most changes, the answer is yes and the workflow continues without interruption. For the rare dangerous change, it flags and blocks. It's like having a senior engineer reviewing every PR in real time.

The hooks system transforms AI coding from "hope it does the right thing" to "enforce that it does the right thing." The difference in confidence is enormous.

## CI/CD Integration: The Final Loop

The last piece is connecting AI assistants to your continuous integration pipeline. This closes the feedback loop between local development and production readiness.

The simplest version is a GitHub Action that triggers on pull requests. When a PR is opened, the action runs the AI assistant against the diff with a code review prompt. It posts comments directly on the PR with findings - bugs, security issues, style violations, missing tests. By the time you look at the PR, the first round of review is already done.

The more sophisticated version triggers on issue comments. Someone comments `/review` on a PR, and the action runs a targeted review. Someone comments `/fix` and the assistant proposes a fix. The AI becomes a team member that responds to @ mentions.

For projects with comprehensive test suites, the integration goes further. The AI can run tests locally before pushing, catch failures early, and even attempt automated fixes. The [closed-loop principle](/blog/the-agentic-architect-openclaw/) applies here - an AI agent that can verify its own work is exponentially more useful than one that can't.

I'm not running the most sophisticated version of this yet. But even the basic "AI reviews every PR automatically" setup catches things that would otherwise make it to production. It's especially valuable for solo developers who don't have teammates to review their code.

## Building the Compound Machine

Each of these pieces - `CLAUDE.md`, custom commands, worktrees, hooks, CI/CD integration - is useful on its own. But the real leverage comes from combining them. Here's what the full workflow looks like in practice:

1. **CLAUDE.md** ensures the AI understands the project from the first interaction
2. **Custom commands** let me invoke complex, project-specific workflows in one step
3. **Git worktrees** let me run multiple AI sessions in parallel on separate features
4. **Hooks** enforce quality and safety guardrails automatically, without manual review at every step
5. **CI/CD integration** catches anything that slips through before it reaches production

Each layer compounds on the others. The `CLAUDE.md` makes the custom commands more effective because they operate with full project context. The hooks make worktree-based parallel development safer because every edit is validated automatically. The CI/CD integration provides a final safety net that catches edge cases the local hooks missed.

This is the meta-insight that took me a while to internalize: **the developers getting 10x productivity from AI aren't writing better prompts. They've built systems around their tools.** The scaffolding and automation is what compounds, not any single clever instruction.

## Getting Started Without Overengineering

If you're reading this and thinking "that's a lot of setup," you're right. But you don't need all of it on day one. Here's the order I'd recommend:

### Week 1: CLAUDE.md

Create a `CLAUDE.md` in your most active project. Start with three things: build commands, project architecture, and one or two hard rules. You'll feel the difference immediately.

### Week 2: Your first custom command

Identify the workflow you repeat most often. Code review? Blog writing? Test generation? Deployment? Encode it as a custom command. Use it for a week and iterate on the prompt.

### Week 3: Try worktrees

Next time you have two or three independent tasks, create worktrees instead of switching branches. Run AI sessions in parallel. See how it feels to work on multiple things simultaneously without context-switching.

### Week 4: Add one hook

Start with a simple pre-execution hook that blocks obviously dangerous commands. Just having that safety net changes how confidently you can let the AI work.

### Later: CI/CD

Once the local workflow is solid, add the GitHub Action. Start with automated PR reviews. Expand from there based on what you need.

The point is to build the system incrementally. Each piece is standalone valuable. You don't need the full stack to start seeing returns.

## The Mindset Shift

The biggest change isn't technical. It's psychological. When you have persistent context, automated guardrails, and parallel workflows, you stop thinking of the AI as a chatbot you're having a conversation with. You start thinking of it as infrastructure you're operating.

The conversation shifts from "write me a function that does X" to "here are the system constraints, here are the quality standards, here's the architecture - now go build this feature across these five files while I work on something else."

That's the secret sauce. It's not a prompt. It's a system.

---

**Keep reading:**
- [The Agentic Architect: Lessons from the OpenClaw Workflow](/blog/the-agentic-architect-openclaw/)
- [CI/CD Security Pipeline: Automating Security in Your Development Workflow](/blog/cicd-security-pipeline/)
- [What Developers Get Wrong About Legal (And Vice Versa)](/blog/what-developers-lawyers-get-wrong/)

*Want to build a more productive AI-assisted workflow? [Let's talk](https://calendly.com/juanidrovo).*
