/**
 * Markdown slicer
 *
 * Extract sections from markdown files by heading
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { HeadingNode, Position, RootNode, SliceResult } from "./types.ts";
import { getHeadingText } from "./heading-extractor.ts";

/**
 * Find the next heading of same or lower depth
 *
 * @param headings All heading nodes
 * @param currentIndex Current heading index
 * @param currentDepth Current heading depth
 * @returns The next heading node, or null if not found
 */
export function findNextHeadingOfSameOrLowerDepth(
  headings: HeadingNode[],
  currentIndex: number,
  currentDepth: number
): HeadingNode | null {
  for (let i = currentIndex + 1; i < headings.length; i++) {
    if (headings[i].depth <= currentDepth) {
      return headings[i];
    }
  }
  return null;
}

/**
 * Extract nodes between two positions
 *
 * @param tree AST tree
 * @param startOffset Start offset
 * @param endOffset End offset
 */
export function extractNodesBetweenOffsets(
  tree: RootNode,
  startOffset: number,
  endOffset: number
): void {
  if (tree.children) {
    tree.children = tree.children.filter((node) => {
      const nodePosition = node.position as Position | undefined;
      const nodeStart = nodePosition?.start.offset;
      return (
        nodeStart !== undefined &&
        nodeStart >= startOffset &&
        nodeStart < endOffset
      );
    });
  }
}

/**
 * Extract a section from markdown content by heading text
 *
 * @param markdown The markdown content to slice
 * @param headingText The heading text to find
 * @returns The extracted section
 */
export async function sliceMarkdownByHeading(
  markdown: string,
  headingText: string
): Promise<SliceResult> {
  // Parse markdown into AST
  const file = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(() => (tree: RootNode) => {
      // Find all headings
      const headings: HeadingNode[] = [];
      visit(tree, "heading", (node: HeadingNode) => {
        headings.push(node);
      });

      // Find the target heading
      const targetIndex = headings.findIndex((node) => {
        const text = getHeadingText(node);
        return text.trim() === headingText.trim();
      });

      // If heading not found, return empty result
      if (targetIndex === -1) {
        // Clear all children to return empty content
        if (tree.children) {
          tree.children = [];
        }
        return tree;
      }

      const targetHeading = headings[targetIndex];
      const targetDepth = targetHeading.depth;

      // Find the next heading of same or lower depth
      const nextHeading = findNextHeadingOfSameOrLowerDepth(
        headings,
        targetIndex,
        targetDepth
      );

      // Determine start and end positions
      const startOffset = targetHeading.position.start.offset;
      const endOffset = nextHeading
        ? nextHeading.position.start.offset
        : Infinity;

      // Extract only nodes between the positions
      extractNodesBetweenOffsets(tree, startOffset, endOffset);

      return tree;
    })
    .process(markdown);

  return {
    content: String(file),
    foundHeading: String(file).trim().length > 0,
  };
}
