<p align="center">
  <img src="jumbo-logo.svg" alt="Jumbo" width="200">
</p>

<h1 align="center">Jumbo</h1>

<p align="center">
  <strong>AI memory like an elephant</strong><br>
  Augmented context engineering across agents and IDEs
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#faq">FAQ</a>
</p>

---

## The Problem

Coding agents forget everything between sessions. Context is lost, decisions are forgotten, instructions are repeated, and you never build on what you've done before. You waste tokens re-explaining the same things—or worse, hours curating .md files trying to keep the agent producing the same code you would (in 1/10th the time). Switch models or IDEs, and you're back to square one. The joy of building software is lost to the frustration of cleaning up after a messy intern.

## The Solution

Jumbo gives your AI agents persistent memory. It captures all the information about your project necessary to keep agents implementing to the standard you define—then surfaces the right information at the right time—trim & concise. Your agents 'remember' what matters.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Initializing a Project](#initializing-a-project)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [FAQ](#faq)
- [License](#license)

---

## Quick Start

```bash
# Install globally
npm install -g @jumbo/cli

# Initialize in your project
jumbo project init
```

That's it. Fire up your coding agent. Work flows. Memories stick. Momentum builds.

---

## Installation

**Requirements:** Node.js >= 18.18.0

```bash
npm install -g @jumbo/cli
```

Verify installation:

```bash
jumbo
```

---

## Initializing a Project

Run `jumbo project init` in your project root. This creates a `.jumbo/` directory with:

- **Event store** — Append-only log of all project-knowledge
- **Projections** — Read-optimized views for fast querying
- **Hook configuration** — Integration points for your AI tools

### Init Options

```bash
jumbo project init
```

The init wizard walks you through:

1. **Project name** — What you're building. *Orients your agent from the start.*
2. **Problem statement** — The core problem you're solving. *Keeps decisions aligned.*
3. **Solution summary** — Your approach in one line. *Prevents scope creep.*

### Hook Integration

`jumbo project init` automatically configures hooks for popular AI agents. At session start, your agent receives project status—recently completed, active, and planned goals. When you start a goal, a comprehensive context packet is delivered with the details necessary for implementation.

---

## Usage

Jumbo organizes knowledge into a few key concepts:

### Goals

Track what you're working on:

```bash
jumbo goal add --objective "Implement user auth"
jumbo goal start --goal-id <id>
jumbo goal complete --goal-id <id>
```

### Decisions

Capture architectural decisions your agent must respect:

```bash
jumbo decision add --title "CQRS for all data access" --rationale "Separate read/write models for scalability and clarity"
```

### Invariants

Define non-negotiable rules—the lines your agent cannot cross:

```bash
jumbo invariant add --category "Architecture" --description "Common Closure Principle: classes that change together live together. No scattering related logic across modules."
```

### Components

Track system components:

```bash
jumbo component add --name "AuthService" --description "Handles user authentication"
```

### Full Command Reference

```
PROJECT
  audience add/remove/update    Manage target audiences
  audiencePain add/resolve      Track audience pain points
  project init/update           Initialize and configure
  value add/remove/update       Value propositions

WORK
  goal add/start/complete       Track goals and progress
  goal block/unblock            Handle blockers
  session start/end/pause       Manage work sessions

SOLUTION
  architecture define/update    System architecture
  component add/update/remove   System components
  decision add/reverse          Architectural decisions
  dependency add/remove         Component dependencies
  guideline add/remove          Execution guidelines
  invariant add/remove          Non-negotiable rules
```

Run `jumbo --help` for the complete list.

---

## Dependencies

Jumbo is built with:

| Package | Purpose |
|---------|---------|
| better-sqlite3 | Local event store and projections |
| commander | CLI framework |
| chalk | Terminal styling |
| yaml | Context serialization |
| inversify | Dependency injection |
| ulid | Time-sortable unique IDs |

---

## FAQ

**Why not just use comments or docs?**

Comments and docs are static. Jumbo is dynamic—it knows what you're working on *right now* and surfaces relevant context automatically.

**Does this replace documentation?**

No. Jumbo captures working knowledge: decisions, goals, patterns. Documentation explains the end result. They're complementary.

**How does it integrate with my AI agent?**

Through hooks. Your agent calls `jumbo session start` at the beginning of a session, and Jumbo injects relevant context. Works with Claude Code, Cursor, Copilot, or any tool that supports prompt hooks.

**Where is data stored?**

Locally, in `.jumbo/` within your project. Nothing leaves your machine unless you want it to.

**Can I share context across a team?**

The `.jumbo/` directory can be committed to version control. Your team shares the same project memory.

---

## License

[AGPL-3.0](LICENSE)

---

<p align="center">
  Built for developers who are tired of repeating themselves.
</p>
