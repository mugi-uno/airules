/**
 * airules setup command
 *
 * Register a rules directory in the configuration file
 */

import { Command } from "@cliffy/command";
import { exists } from "std/fs";
import { join } from "std/path";
import { type AirulesConfig, loadConfig, saveConfig } from "../config.ts";

/**
 * Type definition for setup command options
 */
export interface SetupOptions {
  force?: boolean;
}

/**
 * Define setup command
 */
export const setupCommand = new Command()
  .name("setup")
  .description("Register a rules directory")
  .arguments("<rulesDir:string>")
  .option("-f, --force", "Overwrite existing settings", {
    default: false,
  })
  .action(async (options: SetupOptions, rulesDir) => {
    // Validate directory
    if (!(await validateRulesDir(rulesDir))) {
      return false;
    }

    // Load existing configuration
    const existingConfig = await loadConfig();

    // Check if configuration already exists
    if (existingConfig && !options.force) {
      console.error(`Error: Config already exists. Use --force to overwrite.`);
      console.error(`Current rules directory: ${existingConfig.rulesDir}`);
      return false;
    }

    // Save configuration
    const config: AirulesConfig = {
      rulesDir,
    };

    const success = await saveConfig(config);
    if (success) {
      console.log(`Success: Rules directory registered at ${rulesDir}`);
      console.log(`You can now use 'airules generate' to create rule files.`);
      return true;
    } else {
      console.error(`Error: Failed to save configuration.`);
      return false;
    }
  });

/**
 * Check if rulesDir is a valid directory
 *
 * 1. Check if directory exists
 * 2. Check if it's git managed (has .git directory)
 *
 * @param rulesDir Directory path to check
 * @returns true if directory is valid
 */
export async function validateRulesDir(rulesDir: string): Promise<boolean> {
  try {
    // Check existence
    if (!(await exists(rulesDir))) {
      console.error(`Error: Directory ${rulesDir} does not exist`);
      return false;
    }

    // Check if it's a directory
    const stat = await Deno.stat(rulesDir);
    if (!stat.isDirectory) {
      console.error(`Error: ${rulesDir} is not a directory`);
      return false;
    }

    // Check if git managed
    const gitDir = join(rulesDir, ".git");
    if (!(await exists(gitDir))) {
      console.warn(`Warning: ${rulesDir} is not git managed`);
      // This is just a warning, not an error
    }

    return true;
  } catch (error) {
    console.error(`Failed to validate directory: ${error}`);
    return false;
  }
}
