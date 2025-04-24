import { assertEquals, assertExists } from "std/assert";
import { join } from "std/path";
import { ensureDir } from "std/fs";
import {
  type AirulesConfig,
  loadConfig,
  saveConfig,
  getEffectiveRulesDir,
} from "./config.ts";

// テスト用の一時ディレクトリを設定
const testDir = join(Deno.cwd(), ".tmp", "test");
const testConfigPath = join(testDir, "test_config.json");

// テスト環境のセットアップ
Deno.test({
  name: "config.ts",
  async fn(t) {
    // テスト前の環境変数をバックアップ
    const origEnv = Deno.env.get("AIRULES_DIR");

    // テスト用ディレクトリを作成
    await ensureDir(testDir);

    // テスト実行
    await t.step("saveConfig - 設定を保存できる", async () => {
      const config: AirulesConfig = {
        rulesDir: "/path/to/rules",
      };

      const result = await saveConfig(config, testConfigPath);
      assertEquals(result, true);
    });

    await t.step("loadConfig - 保存した設定を読み込める", async () => {
      const config = await loadConfig(testConfigPath);
      assertExists(config);
      assertEquals(config?.rulesDir, "/path/to/rules");
    });

    await t.step(
      "getEffectiveRulesDir - 設定ファイルからルールディレクトリを取得できる",
      () => {
        const config: AirulesConfig = {
          rulesDir: "/path/to/rules",
        };
        const rulesDir = getEffectiveRulesDir(config);
        assertEquals(rulesDir, "/path/to/rules");
      }
    );

    await t.step("getEffectiveRulesDir - 環境変数が優先される", () => {
      Deno.env.set("AIRULES_DIR", "/env/path/to/rules");
      const config: AirulesConfig = {
        rulesDir: "/path/to/rules",
      };
      const rulesDir = getEffectiveRulesDir(config);
      assertEquals(rulesDir, "/env/path/to/rules");
    });

    await t.step(
      "getEffectiveRulesDir - 設定がnullでも環境変数があれば取得できる",
      () => {
        Deno.env.set("AIRULES_DIR", "/env/path/to/rules");
        const rulesDir = getEffectiveRulesDir(null);
        assertEquals(rulesDir, "/env/path/to/rules");
      }
    );

    // テスト後のクリーンアップ
    await t.step("cleanup", async () => {
      try {
        await Deno.remove(testConfigPath);
      } catch {
        // ファイルが存在しない可能性があるので無視
      }

      // 環境変数を元に戻す
      if (origEnv === undefined) {
        Deno.env.delete("AIRULES_DIR");
      } else {
        Deno.env.set("AIRULES_DIR", origEnv);
      }
    });
  },
  permissions: {
    env: true,
    read: true,
    write: true,
  },
});
