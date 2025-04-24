/**
 * Configuration file management
 *
 * Handles reading and writing to ~/.config/airules/config.json
 */

import { ensureDir, exists } from "std/fs";
import { join, dirname } from "std/path";
import type { AirulesConfig } from "./types.ts";

/**
 * Default configuration file path
 */
export const DEFAULT_CONFIG_PATH = join(
  Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || ".",
  ".config",
  "airules",
  "config.json"
);

/**
 * Load configuration file
 *
 * @param configPath Configuration file path (uses default if not specified)
 * @returns Configuration object, or null if file doesn't exist
 */
export async function loadConfig(
  configPath: string = DEFAULT_CONFIG_PATH
): Promise<AirulesConfig | null> {
  try {
    // Check if configuration file exists
    if (!(await exists(configPath))) {
      return null;
    }

    // Read file and parse as JSON
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content) as AirulesConfig;
  } catch (error) {
    console.error("Failed to load configuration file:", error);
    return null;
  }
}

/**
 * Save configuration file
 *
 * @param config Configuration object to save
 * @param configPath Configuration file path (uses default if not specified)
 * @returns Whether save was successful
 */
export async function saveConfig(
  config: AirulesConfig,
  configPath: string = DEFAULT_CONFIG_PATH
): Promise<boolean> {
  try {
    // Ensure configuration directory exists
    await ensureDir(dirname(configPath));

    // Save configuration as JSON
    await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error("Failed to save configuration file:", error);
    return false;
  }
}
