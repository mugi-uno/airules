/**
 * Rules directory utilities
 *
 * Handle rules directory resolution from environment variable or config
 */

import type { AirulesConfig } from "./types.ts";

/**
 * Get rules directory from environment variable AIRULES_DIR if available
 *
 * @returns Rules directory path from environment variable, or null if not set
 */
export function getEnvRulesDir(): string | null {
  return Deno.env.get("AIRULES_DIR") || null;
}

/**
 * Get effective rules directory based on priority:
 * 1. Environment variable AIRULES_DIR
 * 2. Configuration file path
 *
 * @param config Configuration object
 * @returns Rules directory path, or null if not configured
 */
export function getEffectiveRulesDir(
  config: AirulesConfig | null
): string | null {
  // Environment variable takes priority
  const envDir = getEnvRulesDir();
  if (envDir) {
    return envDir;
  }

  // Then use configuration file
  return config?.rulesDir || null;
}
