/**
 * File listing utilities for generate command
 */

import { expandGlob } from "std/fs";
import { basename, dirname, join } from "std/path";
import type { HeadingItem, RuleFile } from "./types.ts";
import { TARGET_EXTENSIONS } from "./types.ts";

/**
 * Get list of rule files from rules directory
 *
 * @param rulesDir Rules directory
 * @returns List of rule files with headings
 */
export async function listRuleFiles(rulesDir: string): Promise<RuleFile[]> {
  const ruleFiles: RuleFile[] = [];

  // Get all files with target extensions
  for (const ext of TARGET_EXTENSIONS) {
    const pattern = join(rulesDir, "**", `*${ext}`);
    for await (const entry of expandGlob(pattern)) {
      if (entry.isFile) {
        const filePath = entry.path;
        const fileName = basename(filePath);

        // Create a display name that's relative to the rules directory
        // This shows the full relative path instead of just directory/filename
        let relativePath = filePath;
        if (filePath.startsWith(rulesDir)) {
          relativePath = filePath.slice(rulesDir.length);
          // Remove leading slash if present
          if (relativePath.startsWith("/") || relativePath.startsWith("\\")) {
            relativePath = relativePath.slice(1);
          }
        } else {
          // Fallback to directory/filename if path is not under rules directory
          const directory = basename(dirname(filePath));
          relativePath = `${directory}/${fileName}`;
        }

        const displayName = relativePath;

        // Read file content to extract headings
        const content = await Deno.readTextFile(filePath);
        const headings = extractHeadings(content);

        ruleFiles.push({
          sourcePath: filePath,
          displayName,
          fileName,
          selected: false,
          expanded: false,
          headings,
        });
      }
    }
  }

  return ruleFiles;
}

/**
 * Extract headings from markdown content
 *
 * @param content Markdown content
 * @returns List of heading items
 */
export function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];

  // Simple regex to extract headings (# Heading)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    // Get the heading text
    const headingText = match[2].trim();
    headings.push({
      text: headingText,
      selected: false,
    });
  }

  return headings;
}
