/**
 * FrontMatter utilities
 *
 * Parse and extract YAML frontmatter from markdown files
 */

import type { FrontMatterResult } from "./types.ts";

/**
 * Extract frontmatter from markdown content
 *
 * @param markdown The markdown content to extract frontmatter from
 * @returns Object containing frontmatter and content
 */
export function extractFrontMatter(markdown: string): FrontMatterResult {
  // Check if the content starts with a frontmatter delimiter
  if (!markdown.trimStart().startsWith("---")) {
    return {
      frontMatter: null,
      content: markdown,
      hasFrontMatter: false,
    };
  }

  // Regular expression to match YAML frontmatter
  // Matches "---" at the beginning, followed by any content until the next "---"
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
  const match = markdown.match(frontMatterRegex);

  if (!match) {
    // No valid frontmatter found
    return {
      frontMatter: null,
      content: markdown,
      hasFrontMatter: false,
    };
  }

  // Extract the frontmatter and the rest of the content
  const fullMatch = match[0]; // The entire match including delimiters
  const frontMatterContent = match[1]; // Just the content between the delimiters
  const restContent = markdown.slice(fullMatch.length);

  return {
    frontMatter: frontMatterContent,
    content: restContent,
    hasFrontMatter: true,
  };
}

/**
 * Combine frontmatter with content
 *
 * @param frontMatter The frontmatter to add (or null for none)
 * @param content The content to combine with frontmatter
 * @returns Combined markdown with frontmatter
 */
export function combineFrontMatter(
  frontMatter: string | null,
  content: string
): string {
  if (frontMatter === null) {
    return content;
  }

  // 空文字列の場合も区切り文字を含める
  return `---\n${frontMatter}\n---\n\n${content}`;
}
