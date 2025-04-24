#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

/**
 * airules - CLI tool for managing AI editor rule files
 *
 * Easily copy needed sections from your rule repository to appropriate directories
 */

import { Command } from "@cliffy/command";
import { setupCommand } from "./src/commands/setup.ts";
import { generateCommand } from "./src/commands/generate.ts";

// Define main command
const mainCommand = new Command()
  .name("airules")
  .version("0.1.0")
  .description("CLI tool for managing AI editor rule files")
  // Add commands
  .command("setup", setupCommand)
  .command("generate", generateCommand);

// Execute command
if (import.meta.main) {
  await mainCommand.parse(Deno.args);
}
