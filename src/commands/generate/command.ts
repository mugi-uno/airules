/**
 * airules generate command
 *
 * Select and copy files/sections from registered rule directory
 */

import { Command } from "@cliffy/command";
import { exists } from "std/fs";
import { getEffectiveRulesDir, loadConfig } from "../../config.ts";
import { copyWholeFile, extractSelectedHeadings } from "./file-operations.ts";
import { listRuleFiles } from "./file-listing.ts";
import { selectFiles } from "./ui.ts";
import { determineDestDir } from "./destination.ts";
import type { GenerateOptions } from "./types.ts";

/**
 * Define generate command
 */
export const generateCommand = new Command()
  .name("generate")
  .description("Generate rule files from registered directory")
  .arguments("[destDir:string]")
  .option("-d, --dry-run", "Show what would be done without copying files", {
    default: false,
  })
  .option("-f, --force", "Overwrite existing files", {
    default: false,
  })
  // .option("-p, --preset <name:string>", "Use a saved preset", {})
  .action(async (options: GenerateOptions, destDir?) => {
    // Get rules directory
    const config = await loadConfig();
    const rulesDir = getEffectiveRulesDir(config);

    if (!rulesDir) {
      console.error("Error: No rules directory configured");
      console.error("Please run 'airules setup <rulesDir>' first");
      return false;
    }

    // Check if directory exists
    if (!(await exists(rulesDir))) {
      console.error(`Error: Rules directory ${rulesDir} does not exist`);
      return false;
    }

    // Determine destination directory
    const targetDir = await determineDestDir(destDir);
    if (!targetDir) {
      return false;
    }

    console.log(`Rules directory: ${rulesDir}`);
    console.log(`Destination directory: ${targetDir}`);
    console.log(`Dry run: ${options.dryRun ? "enabled" : "disabled"}`);
    console.log(`Force overwrite: ${options.force ? "enabled" : "disabled"}`);

    // Get rule file list
    const ruleFiles = await listRuleFiles(rulesDir);
    if (ruleFiles.length === 0) {
      console.error("Error: No rule files found in the rules directory");
      return false;
    }

    // Show file selection UI
    const selectedRuleFiles = await selectFiles(ruleFiles);

    // Count selected files and headings
    let selectedFileCount = 0;
    let selectedHeadingCount = 0;

    for (const file of selectedRuleFiles) {
      if (file.selected) {
        selectedFileCount++;
      } else {
        // Count individual headings only if the file itself is not selected
        for (const heading of file.headings) {
          if (heading.selected) {
            selectedHeadingCount++;
          }
        }
      }
    }

    const totalSelections = selectedFileCount + selectedHeadingCount;

    if (totalSelections === 0) {
      console.log("No files or sections selected. Exiting.");
      return true;
    }

    console.log(
      `Selected ${selectedFileCount} files and ${selectedHeadingCount} sections.`
    );

    // Process each selected file
    for (const file of selectedRuleFiles) {
      if (file.selected) {
        // Process whole file
        await copyWholeFile(file.sourcePath, targetDir, options);
      } else {
        // Process only selected headings
        const selectedHeadings = file.headings.filter((h) => h.selected);
        if (selectedHeadings.length > 0) {
          const content = await Deno.readTextFile(file.sourcePath);
          await extractSelectedHeadings(
            content,
            selectedHeadings,
            file.sourcePath,
            targetDir,
            options
          );
        }
      }
    }

    return true;
  });
