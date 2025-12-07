# AI Agent Instructions

This file contains instructions for AI coding agents working on this project.

## Jumbo Context Management

**IMPORTANT: This project uses Jumbo for AI context management.**

Jumbo is a context management system that captures project knowledge in an immutable event store and delivers the right context to developers and LLMs when needed.

### Getting Started with Jumbo

1. **Start each session**: Run `jumbo session start` at the beginning of your work session to load orientation context
2. **Start a goal**: Before working on a task, run `jumbo goal start --goal-id <id>` to load goal-specific context
3. **Capture memories**: As you work, proactively run jumbo commands to capture project knowledge:
   - `jumbo component add` - Track architectural components
   - `jumbo decision add` - Record architectural decisions (ADRs)
   - `jumbo guideline add` - Capture coding standards and preferences
   - `jumbo invariant add` - Document non-negotiable constraints
   - `jumbo relation add` - Link related entities

### Available Commands

Run `jumbo --help` to see all available commands and learn what can be tracked.

### Philosophy

- **Context determines output quality**: Jumbo provides accurate, relevant context to help you produce code aligned with developer intent
- **Guidance over querying**: Context packets delivered at workflow transitions (session start, goal start) contain everything you need
- **Proactive capture**: Record project knowledge as it surfaces during development

### Learn More

For detailed information about Jumbo's capabilities and workflow, run:
```bash
jumbo capabilities
```

### Next step:
Run 'jumbo session start' to retrieve project specific orientation.
