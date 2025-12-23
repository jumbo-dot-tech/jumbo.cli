---
@LLM: Please implement the goal below. All output should fulfill the objective and criteria. Work within scope and the operational boundaries presented.
You will naturally have interactions with the developer as you work on completing the goal. Heed the user's prompts for changes to the solution 'architecture', 'components', or 'dependencies', or the introduction of new 'guidelines' or 'invariants' and suggest to register them with jumbo when you encounter them in your exchanges. Run the following for registration details:
- 'jumbo architecture update --help'
- 'jumbo component --help'
- 'jumbo decision --help'
- 'jumbo dependency --help'
- 'jumbo guideline --help'
- 'jumbo invariant --help'

---
goalContext:
  goal:
    goalId: goal_924f5fb2-5dda-4f29-b635-f1cc08fcf72a
    objective: test resume context
    status: doing
    criteria:
      - context is rendered on goal resume
    scope:
      in: []
      out: []
    boundaries: []
  # @LLM: Below are the contextual details of the solution your outputs must fit into.
  solution:
  # @LLM: These are the components relevant to this goal, but not necessarily all components comprising the solution. 
    components:
      - name: CompositionRoot
        description: Dependency wiring and container assembly. Called once at app startup, creates all infrastructure as singletons
      - name: FsEventStore
        description: File-based append-only event stream using JSONL format. Adds seq metadata on write, strips on read
      - name: InProcessEventBus
        description: In-process event distribution for projections. Synchronous dispatch, handlers update projection stores
      - name: MigrationRunner
        description: Versioned database schema management. Sequential .sql files, checksum verification, transaction-based execution
      - name: ProjectionStore
        description: Read model persistence for CQRS query side using SQLite. One store per aggregate type, implements repository abstraction
    decisions:
      - title: Explicit over implicit event persistence
        rationale: Explicit handler control enables enrichment, follows discrete protocols, improves debuggability
      - title: RAII Pattern for Infrastructure Lifecycle
        rationale: Infrastructure should manage its own resources. Presentation layer should only validate, route, and render
  # @LLM: The following are non-negotiable. Your outputs MUST adhere to each of the following invariants.
  invariants:
    - title: Infrastructure Isolation
      description: Domain models must never contain infrastructure concerns like database IDs, sequence numbers, or file paths
    - title: Domain events must not duplicate BaseEvent properties
      description: Event interfaces should not redeclare type, aggregateId, version, or timestamp fields that are already defined in BaseEvent. Only the payload should be specified in domain event interfaces.
    - title: Names must be explicit and self-documenting
      description: "A reader should understand what a class, file, or identifier does from its name alone—including its architectural role. Never require code inspection to decipher purpose. Examples: AddComponentCommandHandler (not AddComponentHandler), GoalProjectionStore (not GoalStore), SessionStartedEvent (not SessionStarted)."
    - title: Clean Screaming Architecture
      description: Layered boundaries (Domain -> Application -> Infrastructure -> Presentation). Inside each layer the naming of directories and files should SCREAM what the domain is and each pieces role in the domain
    - title: Single Responsibility
      description: One repository per aggregate. Each class/module has one reason to change
    - title: Dependency Inversion
      description: Depend on abstractions, not concretions. Application depends only on abstractions. Infrastructure implements those abstractions
    - title: Event Sourcing
      description: All state changes via events. Domain events live next to their entity
    - title: CQRS
      description: Separate write (events) and read (views) models. Read and write are separated by Command Query Responsibility Segregation
    - title: One class per file
      description: Each TypeScript file contains exactly one class definition
    - title: No junk drawers
      description: NO services/, utils/, managers/, repositories/ catch-alls. Code should be organized by domain concept, not technical category
    - title: Token optimization
      description: YAML projections for minimal LLM context cost. Context packets optimized for Correctness, Completeness, Size and Trajectory
    - title: Decomposition where possible
      description: Don't have protocols that perform 10 categories of work that require test files that are 5000 lines long. Maintain a unit of work where possible and keep corresponding test file small
    - title: Common Closure Principle
      description: Things that change together, live together. Related code should be co-located
    - title: UTF-8 without BOM
      description: All new files must use UTF-8 encoding without Byte Order Mark
    - title: Use relative file paths
      description: When reading or editing files, ALWAYS use relative paths (e.g., ./src/components/Component.tsx). DO NOT use absolute paths (e.g., C:/Users/user/project/src/components/Component.tsx).
    - title: Replaceability Invariant
      description: Any infrastructure component must be replaceable with an alternative implementation without modifying code in presentation, application, or domain layers as long as it fulfills the contract abstracted in the application layer.
  # @LLM: Apply the following guidelines to your output where applicable.
  guidelines:
    - category: process
      description: Delete temporary scripts, files, and other artifacts created during development work before completing a task
    - category: codingStyle
      description: "When assigning a value to a variable, preserve the semantic meaning from the source. Do not introduce creative synonyms or arbitrary renamings. Example: const latestGoal = repository.getLatestGoal() (not const current = ...)"
    - category: codingStyle
      description: Things go wrong in CLIs much more often than in web apps. Without a UI to guide the user, the only thing we can do is display an error to the user
    - category: codingStyle
      description: Stdout and stderr provide a way for you to output messages to the user while also allowing them to redirect content to a file
    - category: codingStyle
      description: Ensure you can get the CLI version with jumbo version, jumbo --version and jumbo -v
    - category: documentation
      description: A CLI should provide in-CLI help and help on the web (READMEs are a great place)
    - category: other
      description: Supply precise, historically accurate information without irrelevant noise
    - category: other
      description: LLM coding agents produce code aligned with developer intent only when provided accurate, relevant context
    - category: process
      description: When you notice naming inconsistencies, outdated patterns, or other issues while working on a task, fix them as part of the current work rather than deferring to a separate task.
    - category: testing
      description: When modifying core architectural patterns, ensure all affected tests reflect the new pattern.
    - category: testing
      description: All business rules and policies must be unit tested.

✅ Goal started
  goalId: goal_924f5fb2-5dda-4f29-b635-f1cc08fcf72a
  objective: test resume context
  status: doing