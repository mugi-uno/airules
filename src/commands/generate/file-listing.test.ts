import { assertEquals, assertArrayIncludes } from "std/assert";
import { extractHeadings } from "./file-listing.ts";

Deno.test({
  name: "extractHeadings - extracts headings correctly",
  fn() {
    // テスト用のマークダウン
    const markdown = `# Heading 1
Some text

## Heading 2
More text

### Heading 3
Even more text`;

    const headings = extractHeadings(markdown);

    assertEquals(headings.length, 3);
    assertArrayIncludes(
      headings.map((h) => h.text),
      ["Heading 1", "Heading 2", "Heading 3"]
    );

    // 全てのheadingが未選択状態
    assertEquals(
      headings.every((h) => h.selected === false),
      true
    );
  },
});
