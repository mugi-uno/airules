import { assertEquals } from "std/assert";
import { TARGET_EXTENSIONS, DEST_DIRECTORIES } from "./types.ts";

Deno.test({
  name: "types - constants check",
  fn() {
    // TARGET_EXTENSIONSの検証
    assertEquals(TARGET_EXTENSIONS, [".md", ".mdc", ".prompt.md"]);

    // DEST_DIRECTORIESの検証
    assertEquals(DEST_DIRECTORIES, [".cursor/rules/", "github/prompts/"]);
  },
});
