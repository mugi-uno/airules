import { assertEquals } from "std/assert";
import { getEffectiveRulesDir } from "./rules-dir.ts";
import type { AirulesConfig } from "./types.ts";

Deno.test({
  name: "getEffectiveRulesDir - returns null when config is null and no env var",
  fn() {
    // テスト環境変数をクリーン
    Deno.env.delete("AIRULES_DIR");

    const result = getEffectiveRulesDir(null);
    assertEquals(result, null);
  },
});

Deno.test({
  name: "getEffectiveRulesDir - returns config value when no env var",
  fn() {
    // テスト環境変数をクリーン
    Deno.env.delete("AIRULES_DIR");

    const config: AirulesConfig = {
      rulesDir: "/test/rules/dir",
    };

    const result = getEffectiveRulesDir(config);
    assertEquals(result, "/test/rules/dir");
  },
});
