/**
 * slice.ts のテスト
 */

import { assertEquals } from "std/assert";
import { sliceMarkdownByHeading, headingToSlug } from "./slice.ts";

// Test fixture
const testMarkdown = `# Heading 1
Content under heading 1.

## Subheading 1
Content under subheading 1.

# Heading 2
Content under heading 2.

## Subheading 2
Content under subheading 2.

### Deep heading
Very deep content.

# Heading 3
Content under heading 3.
`;

/**
 * 改行の差異を正規化する関数
 */
function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\n+/g, "\n");
}

/**
 * sliceMarkdownByHeading のテスト
 */
Deno.test({
  name: "sliceMarkdownByHeading",
  fn: async function () {
    // Basic test case - extract existing section
    let result = await sliceMarkdownByHeading(testMarkdown, "Heading 2");
    assertEquals(
      normalizeWhitespace(result.content),
      normalizeWhitespace(`# Heading 2
Content under heading 2.

## Subheading 2
Content under subheading 2.

### Deep heading
Very deep content.`)
    );
    assertEquals(result.foundHeading, true);

    // Extract section with subsections
    result = await sliceMarkdownByHeading(testMarkdown, "Subheading 2");
    assertEquals(
      normalizeWhitespace(result.content),
      normalizeWhitespace(`## Subheading 2
Content under subheading 2.

### Deep heading
Very deep content.`)
    );
    assertEquals(result.foundHeading, true);

    // Extract non-existent section
    result = await sliceMarkdownByHeading(testMarkdown, "Non-existent Heading");
    assertEquals(result.content.trim(), "");
    assertEquals(result.foundHeading, false);

    // Extract last section
    result = await sliceMarkdownByHeading(testMarkdown, "Heading 3");
    assertEquals(
      normalizeWhitespace(result.content),
      normalizeWhitespace(`# Heading 3
Content under heading 3.`)
    );
    assertEquals(result.foundHeading, true);
  },
});

/**
 * headingToSlug のテスト
 */
Deno.test("headingToSlug", () => {
  assertEquals(headingToSlug("Hello World"), "hello-world");
  assertEquals(headingToSlug("Hello  World!"), "hello-world");
  assertEquals(headingToSlug("特殊文字 Test"), "特殊文字-test");
  assertEquals(headingToSlug("Multi--Hyphen"), "multi-hyphen");
  assertEquals(headingToSlug("   trim spaces   "), "trim-spaces");
});
