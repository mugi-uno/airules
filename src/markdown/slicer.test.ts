import { assertEquals } from "std/assert";
import {
  findNextHeadingOfSameOrLowerDepth,
  sliceMarkdownByHeading,
} from "./slicer.ts";
import type { HeadingNode } from "./types.ts";

Deno.test({
  name: "findNextHeadingOfSameOrLowerDepth - finds correct heading",
  fn() {
    const headings: HeadingNode[] = [
      {
        type: "heading",
        depth: 1,
        children: [],
        position: {
          start: { line: 1, column: 1, offset: 0 },
          end: { line: 1, column: 10, offset: 9 },
        },
      },
      {
        type: "heading",
        depth: 2,
        children: [],
        position: {
          start: { line: 2, column: 1, offset: 10 },
          end: { line: 2, column: 10, offset: 19 },
        },
      },
      {
        type: "heading",
        depth: 2,
        children: [],
        position: {
          start: { line: 3, column: 1, offset: 20 },
          end: { line: 3, column: 10, offset: 29 },
        },
      },
      {
        type: "heading",
        depth: 1,
        children: [],
        position: {
          start: { line: 4, column: 1, offset: 30 },
          end: { line: 4, column: 10, offset: 39 },
        },
      },
    ];

    // 最初の見出し(depth=1)の次の同じレベル見出しを探す
    const nextSameLevel = findNextHeadingOfSameOrLowerDepth(headings, 0, 1);
    assertEquals(nextSameLevel, headings[3]); // 4番目の見出し

    // 2番目の見出し(depth=2)の次の同じか低いレベルの見出しを探す
    const nextSameOrLower = findNextHeadingOfSameOrLowerDepth(headings, 1, 2);
    assertEquals(nextSameOrLower, headings[2]); // 3番目の見出し

    // 存在しない場合
    const notFound = findNextHeadingOfSameOrLowerDepth(headings, 3, 1);
    assertEquals(notFound, null);
  },
});

Deno.test({
  name: "sliceMarkdownByHeading - extracts content correctly",
  async fn() {
    const markdown = `# Heading 1
Content under heading 1

## Heading 2
Content under heading 2

# Heading 3
Content under heading 3
`;

    const result = await sliceMarkdownByHeading(markdown, "Heading 2");

    assertEquals(result.foundHeading, true);
    // 正規化して比較: remarkによる出力は改行文字の差異がある場合がある
    const normalizedExpected = "## Heading 2\n\nContent under heading 2";
    const normalizedActual = result.content.trim().replace(/\n+/g, "\n\n");
    assertEquals(normalizedActual, normalizedExpected);
  },
});

Deno.test({
  name: "sliceMarkdownByHeading - returns empty for non-existent heading",
  async fn() {
    const markdown = `# Heading 1
Content under heading 1

## Heading 2
Content under heading 2
`;

    const result = await sliceMarkdownByHeading(
      markdown,
      "Non-existent Heading"
    );

    assertEquals(result.foundHeading, false);
    assertEquals(result.content.trim(), "");
  },
});
