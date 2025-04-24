/**
 * UI utilities for generate command
 */

import { Checkbox } from "@cliffy/prompt";
import type { HeadingItem, RuleFile } from "./types.ts";

/**
 * File selection UI
 *
 * @param ruleFiles List of rule files
 * @returns Selected rule files with headings
 */
export async function selectFiles(ruleFiles: RuleFile[]): Promise<RuleFile[]> {
  // Prepare options for the checkbox
  const options = ruleFiles.map((file) => {
    // Create main file option with relative displayName
    const fileOption = {
      name: file.displayName,
      value: file.sourcePath,
      // Create child options for headings if any
      options:
        file.headings.length > 0
          ? file.headings.map((heading) => ({
              name: heading.text,
              value: `${file.sourcePath}:${heading.text}`,
            }))
          : undefined,
    };

    return fileOption;
  });

  // Display the checkbox prompt with tree structure
  const result = await Checkbox.prompt({
    message: "Select rule files or specific sections to copy",
    options,
    minOptions: 0,
    search: true,
    // Clean UI settings with good visibility
    indent: " ",
    listPointer: "❯",
    groupIcon: "📄",
    groupOpenIcon: "📂",
    pointer: "❯",
    // Help hint with clear instructions
    hint: "↑/↓: Move  →: Expand  ←: Collapse  Space: Select  Enter: Submit",
  });

  // Process selection results
  const selectedValues = Array.isArray(result) ? result : [];

  // Update the selected state in ruleFiles based on the selections
  for (const file of ruleFiles) {
    // Check if file itself is selected
    file.selected = selectedValues.includes(file.sourcePath);

    // Process each heading
    for (const heading of file.headings) {
      const headingValue = `${file.sourcePath}:${heading.text}`;
      heading.selected = file.selected || selectedValues.includes(headingValue);
    }
  }

  return ruleFiles;
}

/**
 * 見出しリストをフォーマットする（長すぎる場合は省略）
 *
 * @param headings 見出しリスト
 * @returns フォーマットされた見出しリスト文字列
 */
export function formatHeadingsList(headings: HeadingItem[]): string {
  if (headings.length <= 3) {
    // 3つ以下なら全て表示
    return headings.map((h) => `"${h.text}"`).join(", ");
  } else {
    // 多い場合は最初の2つと残りの数を表示
    const first = headings
      .slice(0, 2)
      .map((h) => `"${h.text}"`)
      .join(", ");
    return `${first}, and ${headings.length - 2} more`;
  }
}
