/**
 * Destination directory utilities for generate command
 */

import { ensureDir, exists } from "std/fs";
import { join } from "std/path";
import { Confirm, Select } from "@cliffy/prompt";
import { DEST_DIRECTORIES } from "./types.ts";

/**
 * Determine destination directory
 *
 * 1. Look for AI editor directories in specified directory
 * 2. If not found, ask user for confirmation
 *
 * @param destDir Optional specified directory
 * @returns Determined destination directory, or null if cancelled
 */
export async function determineDestDir(
  destDir?: string
): Promise<string | null> {
  // Use current directory if no directory specified
  const baseDir = destDir || Deno.cwd();

  // Check for standard directory structures
  for (const candidate of DEST_DIRECTORIES) {
    const candidatePath = join(baseDir, candidate);
    if (await exists(candidatePath)) {
      return candidatePath;
    }
  }

  // If no standard directories found, offer choices
  const choices = [
    { name: `Current directory (${baseDir})`, value: baseDir },
    {
      name: "Create .cursor/rules/ directory",
      value: join(baseDir, ".cursor/rules/"),
    },
    {
      name: "Create github/prompts/ directory",
      value: join(baseDir, "github/prompts/"),
    },
    { name: "Cancel", value: "cancel" },
  ];

  const result = await Select.prompt({
    message: "No standard AI rule directories found. Where to save rule files?",
    options: choices,
  });

  // Extract the value from the selection
  const selectedDir = typeof result === "string" ? result : "cancel";

  if (selectedDir === "cancel") {
    return null;
  }

  // Confirm directory creation if it doesn't exist
  if (!(await exists(selectedDir))) {
    const shouldCreate = await Confirm.prompt({
      message: `Directory ${selectedDir} does not exist. Create it?`,
      default: true,
    });

    if (!shouldCreate) {
      return null;
    }

    // Create directory (ensureFile creates the entire path)
    await ensureDir(selectedDir);
  }

  return selectedDir;
}
