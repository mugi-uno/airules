/**
 * Markdown slice module
 *
 * Extract sections from markdown files by heading
 */

import { sliceMarkdownByHeading as sliceContent } from "./slicer.ts";
import { headingToSlug as slugify } from "./heading-extractor.ts";

// Re-export for backward compatibility
export const sliceMarkdownByHeading = sliceContent;
export const headingToSlug = slugify;
