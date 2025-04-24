/**
 * Type definitions for generate command
 */

/**
 * Type definition for generate command options
 */
export interface GenerateOptions {
  dryRun?: boolean;
  force?: boolean;
  preset?: string;
}

/**
 * Heading item in a rule file
 */
export interface HeadingItem {
  /** Heading text */
  text: string;
  /** Whether this heading is selected */
  selected: boolean;
}

/**
 * Type for a rule file to be copied
 */
export interface RuleFile {
  /** Source file path */
  sourcePath: string;
  /** Display name for UI */
  displayName: string;
  /** File name without directory */
  fileName: string;
  /** Whether this file is selected */
  selected: boolean;
  /** Whether this file's headings are expanded in the UI */
  expanded: boolean;
  /** Headings in this file */
  headings: HeadingItem[];
}

/**
 * Target file extensions
 */
export const TARGET_EXTENSIONS = [".md", ".mdc", ".prompt.md"];

/**
 * Candidate destination directories
 */
export const DEST_DIRECTORIES = [".cursor/rules/", "github/prompts/"];
