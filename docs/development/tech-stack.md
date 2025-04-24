# airules Tech Stack

This document describes the technology stack used in the airules CLI tool.

## Core Technologies

### Deno 2

- Modern runtime for JavaScript and TypeScript
- Used with minimum permissions (`--allow-read --allow-write --allow-env`)
- Native TypeScript support without transpilation
- Built-in testing framework

### Cliffy

- Command line framework for Deno
- Used for defining the CLI structure and commands
- Provides interactive prompts with Vi/Emacs keybindings
- Components used:
  - `@cliffy/command` for command definitions
  - `@cliffy/prompt` for interactive UI elements

### Markdown Processing

- **remark**: Markdown parser and processor
- **unified**: Interface for processing content through syntax trees
- **unist-util-visit**: Tree traversal utility for unified syntax trees
- Used to extract specific sections from markdown files by heading

## Build & Distribution

- `deno compile` for creating self-contained executables
- Cross-platform binaries for Linux, macOS, and Windows
- Distribution through GitHub Releases and Deno registry

## Testing

- Deno's built-in testing framework
- Standard assertions from `std/assert`
- UI snapshot testing with `std/testing/snapshot`

## Project Configuration

- `deno.jsonc` for script definitions and import mappings
- Uses JSR (JavaScript Registry) and npm packages
- Standardized formatting with `deno fmt`
- Linting with `deno lint`
