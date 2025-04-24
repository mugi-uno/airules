import { assertEquals } from "std/assert";
import { join } from "std/path";
import { ensureDir } from "std/fs";
import { validateRulesDir } from "./setup.ts";

// テスト用の一時ディレクトリを設定
const testDir = join(Deno.cwd(), ".tmp", "test-setup");
const validDir = join(testDir, "valid_dir");
const gitDir = join(validDir, ".git");
const invalidDir = join(testDir, "non_existent_dir");

// 標準出力・標準エラー出力のモック
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// テスト環境のセットアップ
Deno.test({
  name: "setup.ts validateRulesDir",
  async fn(t) {
    // テスト用ディレクトリを作成
    await ensureDir(validDir);
    await ensureDir(gitDir);

    // 標準出力・標準エラー出力をモック
    console.error = () => {};
    console.warn = () => {};

    await t.step("valid directory with .git", async () => {
      const result = await validateRulesDir(validDir);
      assertEquals(result, true);
    });

    await t.step("non-existent directory", async () => {
      const result = await validateRulesDir(invalidDir);
      assertEquals(result, false);
    });

    // 標準出力・標準エラー出力を元に戻す
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;

    // テスト後のクリーンアップ
    await t.step("cleanup", async () => {
      try {
        await Deno.remove(testDir, { recursive: true });
      } catch {
        // ディレクトリが存在しない可能性があるので無視
      }
    });
  },
  permissions: {
    read: true,
    write: true,
  },
});
