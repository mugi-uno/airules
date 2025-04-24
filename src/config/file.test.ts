import { assertEquals } from "std/assert";
import { join } from "std/path";
import { DEFAULT_CONFIG_PATH } from "./file.ts";

Deno.test({
  name: "DEFAULT_CONFIG_PATH - uses correct path format",
  fn() {
    // パスに .config/airules/config.json が含まれていることを確認
    const expected = join(".config", "airules", "config.json");
    const actual = DEFAULT_CONFIG_PATH;

    // ホームディレクトリによってパスが変わるので部分一致でチェック
    assertEquals(actual.includes(expected), true);
  },
});
