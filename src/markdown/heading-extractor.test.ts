import { assertEquals } from "std/assert";
import { getHeadingText, headingToSlug } from "./heading-extractor.ts";
import type { HeadingNode } from "./types.ts";

Deno.test({
  name: "headingToSlug - converts heading text to slug",
  fn() {
    assertEquals(headingToSlug("Hello World"), "hello-world");
    assertEquals(headingToSlug("Hello  World!"), "hello-world");
    assertEquals(headingToSlug("特殊文字 Test"), "特殊文字-test");
    assertEquals(headingToSlug(" Trim Space "), "trim-space");
    assertEquals(headingToSlug("Multiple--Hyphens"), "multiple-hyphens");
  },
});

Deno.test({
  name: "getHeadingText - extracts text from heading node",
  fn() {
    const mockHeading: HeadingNode = {
      type: "heading",
      depth: 1,
      children: [
        {
          type: "text",
          value: "Heading",
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 8, offset: 7 },
          },
        },
        {
          type: "text",
          value: " Text",
          position: {
            start: { line: 1, column: 8, offset: 7 },
            end: { line: 1, column: 13, offset: 12 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 13, offset: 12 },
      },
    };

    assertEquals(getHeadingText(mockHeading), "Heading Text");
  },
});
