/**
 * Heading extractor
 *
 * Functions for extracting and finding headings in markdown
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { HeadingNode, RootNode } from "./types.ts";

/**
 * Extract text content from a heading node
 *
 * @param heading Heading node
 * @returns Text content of the heading
 */
export function getHeadingText(heading: HeadingNode): string {
  return heading.children
    .filter((child) => child.type === "text")
    .map((child) => child.value)
    .join("");
}

/**
 * Find a heading node by its text content
 *
 * @param content Markdown content
 * @param headingText Heading text to find
 * @returns The heading node if found, null otherwise
 */
export async function findHeadingNode(
  content: string,
  headingText: string
): Promise<HeadingNode | null> {
  // Parse markdown
  const ast = (await unified().use(remarkParse).parse(content)) as RootNode;

  // Find all headings
  const headings: HeadingNode[] = [];
  visit(ast, "heading", (node: HeadingNode) => {
    headings.push(node);
  });

  // Find the heading with matching text
  const targetHeading = headings.find(
    (node) => getHeadingText(node).trim() === headingText.trim()
  );

  return targetHeading || null;
}

/**
 * Convert a heading text to a slug for filename
 *
 * @param headingText The heading text to convert
 * @returns A slug suitable for filenames
 */
export function headingToSlug(headingText: string): string {
  return headingText
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // 特殊文字だけを削除、Unicode文字（日本語など）は保持
    .replace(/\s+/g, "-") // スペースをハイフンに置換
    .replace(/-+/g, "-"); // 連続するハイフンを1つに
}
