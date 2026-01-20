# Session Commands Reference

Complete reference for all session-related commands.

---

## jumbo session start

Start a new working session.

### Synopsis

```bash
> jumbo session start
```

### Options

None.

### Behavior

1. Loads project orientation context
2. Displays previous session summary
3. Shows in-progress and planned goals
4. Records session start event

### Output

Displays:
- Project context (name, purpose, audiences)
- Previous session summary
- In-progress goals (status: `doing`)
- Planned goals (status: `to-do`)

### Examples

```bash
> jumbo session start
```

---

## jumbo session end

End the current active session.

### Synopsis

```bash
> jumbo session end --focus <text> [--summary <text>]
```

### Options

| Option | Description |
|--------|-------------|
| `--focus <text>` | Summary of what was accomplished (required) |
| `--summary <text>` | Detailed session summary (optional) |

### Behavior

1. Validates an active session exists
2. Records focus and summary
3. Transitions session to `ended` status

The focus becomes orientation context for the next session.

### Examples

End session with focus summary:

```bash
> jumbo session end --focus "Completed authentication implementation"
```

End session with detailed summary:

```bash
> jumbo session end --focus "Bug fixes" --summary "Fixed 3 critical bugs in payment processing"
```
