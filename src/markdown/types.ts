/**
 * Markdown types
 *
 * Type definitions for markdown processing
 */

/**
 * Root node in markdown AST
 */
export interface RootNode {
  type: "root";
  children: Array<HeadingNode | ParagraphNode | NodeWithPosition>;
}

/**
 * Heading node in markdown AST
 */
export interface HeadingNode {
  type: "heading";
  depth: number;
  children: Array<TextNode>;
  position: Position;
}

/**
 * Paragraph node in markdown AST
 */
export interface ParagraphNode {
  type: "paragraph";
  children: Array<TextNode>;
  position: Position;
}

/**
 * Text node in markdown AST
 */
export interface TextNode {
  type: "text";
  value: string;
  position: Position;
}

/**
 * Generic node with position
 */
export interface NodeWithPosition {
  type: string;
  position?: Position;
  children?: Array<NodeWithPosition | TextNode>;
}

/**
 * Position in the document
 */
export interface Position {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}

/**
 * Result of slicing markdown content
 */
export interface SliceResult {
  content: string;
  foundHeading: boolean;
}

/**
 * Result of extracting frontmatter from markdown
 */
export interface FrontMatterResult {
  /** The extracted frontmatter content, if any */
  frontMatter: string | null;
  /** The markdown content without frontmatter */
  content: string;
  /** Whether frontmatter was found */
  hasFrontMatter: boolean;
}
