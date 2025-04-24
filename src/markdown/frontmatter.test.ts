import { assertEquals } from "std/assert";
import { extractFrontMatter, combineFrontMatter } from "./frontmatter.ts";

Deno.test(
  "extractFrontMatter should return null if no frontmatter exists",
  () => {
    const markdown = "# Hello World\n\nThis is a test";
    const result = extractFrontMatter(markdown);

    assertEquals(result.frontMatter, null);
    assertEquals(result.content, markdown);
    assertEquals(result.hasFrontMatter, false);
  }
);

Deno.test("extractFrontMatter should extract frontmatter and content", () => {
  const frontMatter = "title: Hello World\ndate: 2023-01-01";
  const content = "# Hello World\n\nThis is a test";
  const markdown = `---\n${frontMatter}\n---\n\n${content}`;

  const result = extractFrontMatter(markdown);

  assertEquals(result.frontMatter, frontMatter);
  assertEquals(result.content, "\n" + content);
  assertEquals(result.hasFrontMatter, true);
});

Deno.test("extractFrontMatter should handle empty frontmatter", () => {
  const content = "# Hello World\n\nThis is a test";
  const markdown = `---\n\n---\n\n${content}`;

  const result = extractFrontMatter(markdown);

  assertEquals(result.frontMatter, "");
  assertEquals(result.content, "\n" + content);
  assertEquals(result.hasFrontMatter, true);
});

Deno.test(
  "extractFrontMatter should handle frontmatter with special characters",
  () => {
    const frontMatter =
      "title: \"Hello: World\"\ndescription: 'This is a test: with colon'";
    const content = "# Hello World\n\nThis is a test";
    const markdown = `---\n${frontMatter}\n---\n\n${content}`;

    const result = extractFrontMatter(markdown);

    assertEquals(result.frontMatter, frontMatter);
    assertEquals(result.content, "\n" + content);
    assertEquals(result.hasFrontMatter, true);
  }
);

Deno.test(
  "combineFrontMatter should return content only if frontmatter is null",
  () => {
    const content = "# Hello World\n\nThis is a test";
    const result = combineFrontMatter(null, content);

    assertEquals(result, content);
  }
);

Deno.test("combineFrontMatter should combine frontmatter and content", () => {
  const frontMatter = "title: Hello World\ndate: 2023-01-01";
  const content = "# Hello World\n\nThis is a test";
  const expected = `---\n${frontMatter}\n---\n\n${content}`;

  const result = combineFrontMatter(frontMatter, content);

  assertEquals(result, expected);
});

Deno.test("combineFrontMatter should handle empty frontmatter", () => {
  const frontMatter = "";
  const content = "# Hello World\n\nThis is a test";

  const result = combineFrontMatter(frontMatter, content);

  // 空のフロントマターでも正しく区切り文字を含めるべき
  assertEquals(result, `---\n\n---\n\n${content}`);
});
