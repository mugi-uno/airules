import { assertEquals } from "std/assert";
import { formatHeadingsList } from "./ui.ts";
import type { HeadingItem } from "./types.ts";

Deno.test({
  name: "formatHeadingsList - formats headings correctly with 3 or fewer items",
  fn() {
    // 3つ以下の見出し
    const headings: HeadingItem[] = [
      { text: "Heading 1", selected: true },
      { text: "Heading 2", selected: true },
    ];

    const formatted = formatHeadingsList(headings);
    assertEquals(formatted, `"Heading 1", "Heading 2"`);
  },
});

Deno.test({
  name: "formatHeadingsList - truncates display with more than 3 items",
  fn() {
    // 4つの見出し
    const headings: HeadingItem[] = [
      { text: "Heading 1", selected: true },
      { text: "Heading 2", selected: true },
      { text: "Heading 3", selected: true },
      { text: "Heading 4", selected: true },
    ];

    const formatted = formatHeadingsList(headings);
    assertEquals(formatted, `"Heading 1", "Heading 2", and 2 more`);
  },
});
