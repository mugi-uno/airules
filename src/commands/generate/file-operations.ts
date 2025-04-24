/**
 * File operation utilities for generate command
 */

import { exists } from "std/fs";
import { basename, join } from "std/path";
import {
  extractFrontMatter,
  combineFrontMatter,
} from "../../markdown/frontmatter.ts";
import { sliceMarkdownByHeading } from "../../markdown/slice.ts";
import { formatHeadingsList } from "./ui.ts";
import type { GenerateOptions, HeadingItem } from "./types.ts";

/**
 * Extract selected headings from content
 *
 * @param content File content
 * @param selectedHeadings Selected headings
 * @param sourcePath Source file path
 * @param targetDir Target directory
 * @param options Command options
 */
export async function extractSelectedHeadings(
  content: string,
  selectedHeadings: HeadingItem[],
  sourcePath: string,
  targetDir: string,
  options: GenerateOptions
): Promise<void> {
  // 出力するファイル名は元のファイル名をそのまま使用
  const fileName = basename(sourcePath);
  const targetPath = join(targetDir, fileName);

  // FrontMatterを抽出
  const {
    frontMatter,
    content: contentWithoutFrontMatter,
    hasFrontMatter,
  } = extractFrontMatter(content);

  // 複数の見出しの内容を結合するための配列
  const extractedContents: string[] = [];

  // 各見出しの内容を抽出して配列に追加
  for (const heading of selectedHeadings) {
    const result = await sliceMarkdownByHeading(
      contentWithoutFrontMatter,
      heading.text
    );

    if (!result.foundHeading) {
      console.error(`Error: Heading "${heading.text}" not found in the file.`);
      continue;
    }

    extractedContents.push(result.content);
  }

  // 抽出した内容が何もなければ終了
  if (extractedContents.length === 0) {
    return;
  }

  // 複数の見出しの内容を結合
  const extractedContent = extractedContents.join("\n\n");

  // FrontMatterと結合した最終コンテンツ
  const finalContent = combineFrontMatter(frontMatter, extractedContent);

  // ファイルの存在確認
  const fileExists = await exists(targetPath);
  if (fileExists && !options.force) {
    console.error(
      `Error: File ${fileName} already exists. Use --force to overwrite.`
    );
    return;
  }

  // ドライランまたは実際の書き込み
  if (options.dryRun) {
    const headingNames = formatHeadingsList(selectedHeadings);
    console.log(
      `Would write ${selectedHeadings.length} sections (${headingNames})${
        hasFrontMatter ? " with frontmatter" : ""
      } to ${targetPath}`
    );
  } else {
    const headingNames = formatHeadingsList(selectedHeadings);
    await Deno.writeTextFile(targetPath, finalContent);
    console.log(
      `Extracted ${selectedHeadings.length} sections (${headingNames})${
        hasFrontMatter ? " with frontmatter" : ""
      } to ${targetPath}`
    );
  }
}

/**
 * Copy a whole file
 *
 * @param sourcePath Source file path
 * @param targetDir Target directory
 * @param options Command options
 */
export async function copyWholeFile(
  sourcePath: string,
  targetDir: string,
  options: GenerateOptions
): Promise<void> {
  const fileName = basename(sourcePath);
  const targetPath = join(targetDir, fileName);

  // Check if the file already exists
  const fileExists = await exists(targetPath);
  if (fileExists && !options.force) {
    console.error(
      `Error: File ${fileName} already exists. Use --force to overwrite.`
    );
    return;
  }

  // Dry run or actual copy
  if (options.dryRun) {
    console.log(`Would copy ${sourcePath} to ${targetPath}`);
  } else {
    // For markdown files, we can just copy the file directly since we want to copy everything including frontmatter
    await Deno.copyFile(sourcePath, targetPath);
    console.log(`Copied ${fileName} to ${targetPath}`);
  }
}
