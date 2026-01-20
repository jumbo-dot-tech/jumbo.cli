# Session Management

Manage work sessions for effective context delivery.

---

## Overview

Sessions provide continuity between work periods. Starting a session:

- Loads project orientation context
- Shows recent accomplishments
- Displays available goals
- Prepares your AI agent for work

---

## Session lifecycle

```
┌────────┐
│ active │
└────────┘
     │
     │ end
     ▼
┌───────┐
│ ended │
└───────┘
```

---

## Start a session

```bash
> jumbo session start
```

Jumbo displays:

| Context | Description |
|---------|-------------|
| **Project context** | Name, purpose, audiences, and pain points |
| **Previous session** | Summary of what was accomplished last time |
| **In-progress goals** | Goals currently in `doing` status |
| **Planned goals** | Goals in `to-do` status ready to start |

Your AI agent is prompted to ask which goal you want to work on.

---

## End a session

Summarize what was accomplished:

```bash
> jumbo session end --focus "Completed authentication implementation"
```

Add a detailed summary:

```bash
> jumbo session end --focus "Bug fixes" --summary "Fixed 3 critical bugs in payment processing"
```

| Option | Description |
|--------|-------------|
| `--focus <text>` | Brief summary of main accomplishment (required) |
| `--summary <text>` | Detailed session summary (optional) |

The focus and summary become orientation context for your next session.

---

## Typical workflow

### Daily workflow

```bash
# Morning: Start your session
jumbo session start

# Pick a goal to work on
jumbo goal start --goal-id <id>

# Work with your AI agent...

# Complete the goal when done
jumbo goal complete --goal-id <id>

# End of day: End the session
jumbo session end --focus "Completed user authentication module"
```

### Multi-goal session

```bash
# Start session
jumbo session start

# Work on first goal
jumbo goal start --goal-id goal_123
# ... complete work ...
jumbo goal complete --goal-id goal_123

# Start another goal in the same session
jumbo goal start --goal-id goal_456
# ... complete work ...
jumbo goal complete --goal-id goal_456

# End session with summary of all work
jumbo session end --focus "Completed auth and added user profiles"
```

### Returning to in-progress work

```bash
# Start new session
jumbo session start

# Resume an in-progress goal (already in 'doing' status)
jumbo goal resume --goal-id goal_789
```

---

## Best practices

1. **Start every work period with `session start`**
   Ensures your AI agent has current project context

2. **End sessions with meaningful summaries**
   The focus becomes orientation context for next time

3. **Complete goals before ending sessions**
   Triggers knowledge capture prompts

---

## Next steps

- [Goal management guide](goal-management.md) — Master the goal lifecycle
- [Session command reference](../reference/commands/session.md) — Complete command details
