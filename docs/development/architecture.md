# airules Architecture

This document explains the architecture of the airules CLI tool.

## Project Structure

```
airules/
├─ airules.ts           # Entry point with shebang
├─ src/
│   ├─ commands/        # Command implementations
│   ├─ markdown/        # Markdown processing
│   └─ config.ts        # Configuration I/O
├─ tests/               # Test files
```

## Process Flow

### Setup Command Flow

1. Validate input directory (exists, is a directory, has `.git`)
2. Load existing configuration (if any)
3. Check for force flag if config exists
4. Save new configuration
5. Display confirmation message

### Generate Command Flow

1. Get rules directory from config or environment
2. Determine destination directory
   - Check for standard directories (`.cursor/rules/`, `github/prompts/`)
   - Ask user if none found
3. List all rule files in the rules directory
4. Display file selection UI
5. For each selected file:
   - If has headings, display heading selection UI
   - For each selected heading:
     - Extract section using the slice module
     - Save to destination with appropriate name
   - If whole file selected, copy file directly

## Implementation Details

### Configuration Storage

Configuration is stored as JSON:

```json
{
  "rulesDir": "/path/to/rules"
}
```

### File Processing

- Supported file extensions: `.md`, `.mdc`, `.prompt.md`
- Files are copied with their original names
- Sections are extracted as `orig--heading-slug.md`

### Interactive UI

- Uses Cliffy prompts for interactive UI
- `Checkbox` for multi-selection
- `Select` for single option selection
- Key bindings follow standard terminal conventions

### Error Handling

- Directory validation with helpful error messages
- Configuration validation with fallbacks
- File operation errors with clear error reporting
