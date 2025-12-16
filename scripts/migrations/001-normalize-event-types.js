#!/usr/bin/env node
/**
 * Migration Script: Normalize Event Types
 *
 * Purpose:
 * This script fixes legacy events that were stored without the "Event" suffix
 * in their type field. For example:
 *   - "GoalCompleted" -> "GoalCompletedEvent"
 *   - "GoalUpdated" -> "GoalUpdatedEvent"
 *
 * Background:
 * A naming convention change resulted in some events being stored with short
 * type names (e.g., "GoalCompleted") while the event bus expects full names
 * (e.g., "GoalCompletedEvent"). This causes projection handlers to miss these
 * events during database rebuild, leaving goals in incorrect states.
 *
 * Usage:
 *   node scripts/migrations/001-normalize-event-types.js
 *
 * Options:
 *   --dry-run    Preview changes without modifying files
 *   --path       Custom path to .jumbo directory (default: ./.jumbo)
 *
 * Cross-platform: Works on Windows, macOS, and Linux.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const pathIndex = args.indexOf("--path");
const customPath = pathIndex !== -1 ? args[pathIndex + 1] : null;

// Determine events directory
const defaultJumboRoot = path.resolve(process.cwd(), ".jumbo");
const jumboRoot = customPath ? path.resolve(customPath) : defaultJumboRoot;
const eventsDir = path.join(jumboRoot, "events");

console.log("=".repeat(60));
console.log("Migration: Normalize Event Types");
console.log("=".repeat(60));
console.log(`Mode: ${dryRun ? "DRY RUN (no changes will be made)" : "LIVE"}`);
console.log(`Events directory: ${eventsDir}`);
console.log("");

// Statistics
let filesScanned = 0;
let filesUpdated = 0;
let filesSkipped = 0;
let errors = 0;

/**
 * Recursively finds all JSON files in a directory
 */
function findJsonFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Processes a single event file
 */
function processEventFile(filePath) {
  filesScanned++;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const event = JSON.parse(content);

    // Check if type field exists and doesn't end with "Event"
    if (event.type && !event.type.endsWith("Event")) {
      const oldType = event.type;
      const newType = `${oldType}Event`;

      console.log(`  [UPDATE] ${path.basename(filePath)}`);
      console.log(`           type: "${oldType}" -> "${newType}"`);

      if (!dryRun) {
        // Update the type
        event.type = newType;

        // Write back with same formatting (2-space indent)
        fs.writeFileSync(filePath, JSON.stringify(event, null, 2) + "\n");

        // Also rename the file if it doesn't have Event suffix
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath);

        // Check if filename contains the old type without Event suffix
        // e.g., "000002.GoalUpdated.json" -> "000002.GoalUpdatedEvent.json"
        if (basename.includes(`.${oldType}.`)) {
          const newBasename = basename.replace(`.${oldType}.`, `.${newType}.`);
          const newFilePath = path.join(dir, newBasename);
          fs.renameSync(filePath, newFilePath);
          console.log(`           file: "${basename}" -> "${newBasename}"`);
        }
      }

      filesUpdated++;
    } else {
      filesSkipped++;
    }
  } catch (err) {
    console.error(`  [ERROR] ${path.basename(filePath)}: ${err.message}`);
    errors++;
  }
}

// Main execution
function main() {
  if (!fs.existsSync(eventsDir)) {
    console.error(`ERROR: Events directory not found: ${eventsDir}`);
    console.error("Make sure you're running this from a Jumbo project directory,");
    console.error("or use --path to specify the .jumbo directory location.");
    process.exit(1);
  }

  console.log("Scanning for event files...\n");

  const jsonFiles = findJsonFiles(eventsDir);

  if (jsonFiles.length === 0) {
    console.log("No event files found.");
    return;
  }

  console.log(`Found ${jsonFiles.length} event files.\n`);
  console.log("Processing events:");
  console.log("-".repeat(60));

  for (const filePath of jsonFiles) {
    processEventFile(filePath);
  }

  console.log("-".repeat(60));
  console.log("");
  console.log("Summary:");
  console.log(`  Files scanned:  ${filesScanned}`);
  console.log(`  Files updated:  ${filesUpdated}`);
  console.log(`  Files skipped:  ${filesSkipped} (already normalized)`);
  console.log(`  Errors:         ${errors}`);
  console.log("");

  if (dryRun && filesUpdated > 0) {
    console.log("This was a dry run. Run without --dry-run to apply changes.");
  } else if (filesUpdated > 0) {
    console.log("Migration complete. Run 'jumbo db rebuild --yes' to rebuild the database.");
  } else {
    console.log("No changes needed. All events are already normalized.");
  }
}

main();
