#!/usr/bin/env node

/**
 * Jumbo CLI Entry Point (Composition Root Consumer)
 *
 * This is the application's main() - it bootstraps and routes, nothing more.
 *
 * Responsibilities:
 * - Call the composition root (bootstrap) to wire dependencies
 * - Route commands to controllers
 * - Handle top-level concerns (global flags, help display)
 *
 * This file should NOT contain business logic, infrastructure instantiation,
 * or direct infrastructure imports beyond the composition root.
 */

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { getBannerLines, showAnimatedBanner } from "./presentation/cli/shared/components/AnimatedBanner.js";
import { showWelcomeMessage } from "./presentation/cli/shared/components/StaticBanner.js";
import { commands } from "./presentation/cli/shared/registry/generated-commands.js";
import { CommanderApplicator } from "./presentation/cli/shared/registry/CommanderApplicator.js";
import { Renderer } from "./presentation/cli/shared/rendering/Renderer.js";
import { OutputFormat, VerbosityLevel } from "./presentation/cli/shared/rendering/types.js";
import { formatCategorizedCommands } from "./presentation/cli/shared/help/CategoryFormatter.js";
import { shouldShowAnimatedBanner, isFirstTimeUser } from "./presentation/cli/shared/utils/UserDetection.js";
import { bootstrap, ApplicationContainer } from "./infrastructure/composition/bootstrap.js";
import { generateBannerContent, BannerTrigger, BannerDisplayContext } from "./presentation/cli/shared/utils/BannerContentGenerator.js";
import { GetProjectSummaryQueryHandler } from "./application/project-knowledge/project/query/GetProjectSummaryQueryHandler.js";
import { GetWorkSummaryQueryHandler } from "./application/work/query/GetWorkSummaryQueryHandler.js";
import { BuildTimeCliMetadataReader } from "./infrastructure/cli-metadata/query/BuildTimeCliMetadataReader.js";

// Get CLI version for program configuration
const cliMetadataReader = new BuildTimeCliMetadataReader();
const cliVersion = cliMetadataReader.getMetadata().version;

const program = new Command();

program
  .name("jumbo")
  .description(process.stdout.isTTY ? chalk.gray("AI MEMORY LIKE AN ELEPHANT - CONTEXT ENGINEERING AUTOMATED.") : "")
  .version(cliVersion)
  .usage("<command> <subcommand> [flags]");

// Global flags for output control
program
  .option("--format <format>", "Output format: text, json, yaml, ndjson (default: auto-detect)")
  .option("--quiet", "Minimal output (suppress info messages)")
  .option("--verbose", "Verbose output (show detailed info)")
  .option("--show-banner", "Show the animated elephant banner")
  .hook("preAction", (thisCommand) => {
    // Extract global options before any command runs
    const opts = thisCommand.opts();

    // Determine verbosity
    let verbosity: VerbosityLevel = "normal";
    if (opts.quiet) verbosity = "quiet";
    else if (opts.verbose) verbosity = "verbose";

    // Determine format
    const format = opts.format as OutputFormat | undefined;

    // Configure renderer singleton
    Renderer.configure({ format, verbosity });
  });

// Override help to show categorized commands
const originalHelp = program.helpInformation.bind(program);
program.helpInformation = function () {
  // Get original help and capitalize section headers
  let help = originalHelp().replace(/^Options:/gm, "OPTIONS:");

  // Replace the default "Commands:" section with categorized version
  const commandsRegex = /^Commands:[\s\S]*$/m;
  const match = help.match(commandsRegex);

  if (match) {
    // Generate categorized commands section
    const categorizedCommands = formatCategorizedCommands(commands);

    // Replace entire Commands section with our categorized version
    help = help.replace(commandsRegex, categorizedCommands);
  }

  return help + "\n\n";
};

// Note: preAction hook doesn't fire for no-args case, so we handle it before parse()

// Handle help display with animated banner for first-time users
(async () => {
  const args = process.argv;
  const isNoArgs = args.length === 2;
  // Only treat as explicit help if --help is the only arg (not a subcommand help)
  const isExplicitHelp = (args.includes('--help') || args.includes('-h')) && args.length === 3;
  const isShowBanner = args.includes('--show-banner');

  // Handle --show-banner flag (explicit request for animated banner)
  if (isShowBanner) {
    // Gather context via application layer queries (if project exists)
    const jumboRoot = path.join(process.cwd(), ".jumbo");
    let displayContext: BannerDisplayContext;

    if (await fs.pathExists(jumboRoot)) {
      const container = bootstrap(jumboRoot);
      try {
        const projectQuery = new GetProjectSummaryQueryHandler(container.projectContextReader);
        const workQuery = new GetWorkSummaryQueryHandler(
          container.activeSessionReader,
          container.goalStatusReader
        );
        const [project, work] = await Promise.all([
          projectQuery.execute(),
          workQuery.execute(),
        ]);
        displayContext = { project, work };
      } finally {
        await container.dbConnectionManager.dispose();
      }
    } else {
      // Project not initialized - use empty context
      displayContext = {
        project: null,
        work: {
          session: null,
          goals: { planned: 0, active: 0, blocked: 0, completed: 0 },
          blockers: [],
        },
      };
    }

    // Generate content for explicit flag
    const content = generateBannerContent(displayContext, "explicit-flag");
    const projectName = displayContext.project?.name ?? null;

    // Show animated banner (only if TTY)
    if (process.stdout.isTTY) {
      await showAnimatedBanner(content, projectName, cliVersion);
    } else {
      await showWelcomeMessage(content);
    }
    process.exit(0);
  }

  // Handle bare 'jumbo' command (no args, no --help)
  if (isNoArgs && !isExplicitHelp) {
    // Determine trigger type
    let trigger: BannerTrigger;
    const firstTime = await isFirstTimeUser();

    if (firstTime) {
      trigger = "first-time";
    } else if (isShowBanner) {
      trigger = "explicit-flag";
    } else {
      trigger = "returning-user";
    }

    // Gather context via application layer queries (if project exists)
    const jumboRoot = path.join(process.cwd(), ".jumbo");
    let displayContext: BannerDisplayContext;

    if (await fs.pathExists(jumboRoot)) {
      const container = bootstrap(jumboRoot);
      try {
        const projectQuery = new GetProjectSummaryQueryHandler(container.projectContextReader);
        const workQuery = new GetWorkSummaryQueryHandler(
          container.activeSessionReader,
          container.goalStatusReader
        );
        const [project, work] = await Promise.all([
          projectQuery.execute(),
          workQuery.execute(),
        ]);
        displayContext = { project, work };
      } finally {
        await container.dbConnectionManager.dispose();
      }
    } else {
      // Project not initialized - use empty context
      displayContext = {
        project: null,
        work: {
          session: null,
          goals: { planned: 0, active: 0, blocked: 0, completed: 0 },
          blockers: [],
        },
      };
    }

    // Generate content
    const content = generateBannerContent(displayContext, trigger);
    const projectName = displayContext.project?.name ?? null;

    // Show appropriate banner based on trigger and TTY mode
    if (trigger === "first-time" && process.stdout.isTTY) {
      // First-time user in TTY: show animated banner
      await showAnimatedBanner(content, projectName, cliVersion);
    } else {
      // Returning user or non-TTY: show static banner
      await showWelcomeMessage(content);
    }
    process.exit(0);
  }

  // Handle root --help flag (just show help, no banner)
  if (isExplicitHelp) {
    const applicator = new CommanderApplicator();
    applicator.apply(program, commands);
    program.outputHelp();
    process.exit(0);
  }

  // Handle all other commands (including subcommand --help)
  // Normal command execution flow
  const jumboRoot = path.join(process.cwd(), ".jumbo");
  const isProjectInit = args.includes("project") && args.includes("init");
  const isSubcommandHelp = (args.includes('--help') || args.includes('-h')) && args.length > 3;

  // Validation: non-init commands require project to be initialized
  if (!isProjectInit && !isSubcommandHelp && !(await fs.pathExists(jumboRoot))) {
    const renderer = Renderer.getInstance();
    renderer.error("Project not initialized. Run 'jumbo project init' first.");
    process.exit(1);
  }

  // Create container (RAII: resources acquired here)
  let container: ApplicationContainer | undefined;

  if (!isSubcommandHelp) {
    container = bootstrap(jumboRoot);
  }

  try {
    // Apply commands WITH container
    const applicator = new CommanderApplicator();
    applicator.apply(program, commands, container);

    // Parse and execute command
    await program.parseAsync(process.argv);
  } catch (error) {
    const renderer = Renderer.getInstance();
    renderer.error("Command failed", error instanceof Error ? error : String(error));
    process.exit(1);
  } finally {
    // RAII: Release resources on application exit
    if (container) {
      await container.dbConnectionManager.dispose();
    }
  }
})();
