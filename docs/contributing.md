# Contributing

Thanks for helping improve Forge. This document defines the workflow expected
for issues, pull requests, and local development.

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer

## Local Setup

```bash
pnpm install
pnpm dev
```

Run the full local quality gate before opening a pull request:

```bash
pnpm check
pnpm format:check
```

## Branch Names

Use short, descriptive branch names:

```text
feat/json-formatter
fix/sidebar-collapse
docs/tool-guide
refactor/storage-service
test/registry
```

## Commit Messages

Use Conventional Commits:

```text
type(scope): summary
```

Examples:

```text
feat(json): add formatter service
fix(storage): validate persisted tool state
docs(architecture): document registry boundaries
test(search): cover keyword matching
```

Common types:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `build`
- `ci`
- `chore`

## Pull Request Checklist

Every PR should:

- Pass `pnpm check`
- Pass `pnpm format:check`
- Include tests for core, service, or utility changes
- Update docs when architecture or contribution behavior changes
- Include screenshots for visible UI changes
- Keep feature modules isolated
- Avoid direct `localStorage` access from `src/features`

## Review Standards

Maintainers review for:

- Type safety
- Clear ownership boundaries
- Registry-driven integration
- Accessible and responsive UI
- Minimal duplication
- Focused changes with no unrelated refactors

## Adding Tools

New tools must follow `docs/adding-a-new-tool.md`. Do not add tool-specific
entries directly to sidebar, search, router, favorites, or recent tools.
