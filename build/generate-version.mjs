#!/usr/bin/env node

/**
 * Build-Time Version Generator
 *
 * Reads the version from package.json and generates a TypeScript file
 * that exports the version as a constant.
 *
 * This runs during `npm run build` to inject the version at build time,
 * ensuring the distributed CLI bundle has the correct version without
 * requiring package.json at runtime.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'infrastructure', 'cli-metadata', 'query', 'version.generated.ts');

function generateVersionFile() {
  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const version = packageJson.version;

    if (!version) {
      throw new Error('No version found in package.json');
    }

    // Generate TypeScript content
    const content = `/**
 * CLI Version
 *
 * This file is auto-generated during build by build/generate-version.mjs
 * DO NOT EDIT MANUALLY - changes will be overwritten
 */

export const CLI_VERSION = '${version}';
`;

    // Ensure directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

    console.log(`✅ Generated version.generated.ts with version ${version}`);
  } catch (error) {
    console.error('❌ Failed to generate version.generated.ts:', error.message);
    process.exit(1);
  }
}

generateVersionFile();
