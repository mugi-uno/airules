import { assertEquals, assertExists } from "std/assert";
import { generateCommand } from "./generate.ts";

// テスト環境のセットアップ
Deno.test({
  name: "generate command structure",
  permissions: {
    read: true,
  },
  fn() {
    // コマンド構造のテストのみ実行
    assertExists(generateCommand);
    assertExists(generateCommand.parse);
    assertEquals(typeof generateCommand.parse, "function");
    assertEquals(generateCommand.getName(), "generate");
  },
});
