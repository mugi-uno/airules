# airules

A CLI tool for managing AI editor rule files

![image](https://github.com/mugi-uno/airules/blob/main/docs/images/demo.gif?raw=true)

## Overview

airules is a CLI tool that helps manage rule files for AI editors like Cursor and VS Code extensions. It lets you copy only the parts you need from your rule repository to where AI editors can read them.

### Problems It Solves

- AI editors require rule files in different locations (`.cursor/rules/*.mdc`, `github/prompts/*.prompt.md`, etc.)
- Manual file copying is tedious
- Sometimes you only need parts of files or sections

## Installation

```bash
deno install --allow-read --allow-write --allow-env -f -n airules jsr:@mugi-uno/airules --global
```

## Usage

### Setting Up Rules Directory

```bash
airules setup <rulesDir>
```

Options:

- `--force` (`-f`): Overwrite existing settings

### Generating Rule Files

```bash
airules generate [destDir]
```

Options:

- `--dry-run` (`-d`): Show what would be done without copying files
- `--force` (`-f`): Overwrite existing files

UI Controls:

- **↑/↓**: Move
- **Space**: Select
- **→**: Preview/Select headings
- **Enter**: Copy
- **q/Ctrl-C**: Cancel

## Configuration

- Environment variable `AIRULES_DIR` takes priority over config file if set
- Config file is stored at `~/.config/airules/config.json`

## License

MIT

## Contributing

Pull Requests and Issues are welcome!
