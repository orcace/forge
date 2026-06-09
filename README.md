# Forge

Forge is a fast, privacy-first developer toolbox built with React, TypeScript,
and Vite.

The project is designed as a browser-based developer workstation: tools are
registered once, discovered through the registry, and surfaced consistently in
navigation, search, routing, favorites, and recent tools.

## Status

Forge is in early foundation work. The architecture, contributor workflow, and
tool conventions are being established before the first stable release.

## Features

- Browser-only developer tools with no backend requirement for core workflows
- Registry-driven tool model
- Keyboard-first UX and command palette direction
- Persistent workspace primitives
- Privacy-first local execution

## Tech Stack

- React 19
- TypeScript strict mode
- Vite
- Tailwind CSS 4
- shadcn/ui conventions
- Zustand
- React Router
- Zod
- Monaco Editor
- Lucide Icons

## Getting Started

Requirements:

- Node.js 22 or newer
- pnpm 10 or newer

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run quality checks:

```bash
pnpm check
```

## Documentation

- [Architecture](docs/architecture.md)
- [Contributing](docs/contributing.md)
- [Adding a new tool](docs/adding-a-new-tool.md)
- [Coding conventions](docs/coding-conventions.md)
- [Roadmap](docs/roadmap.md)

## Project Principles

- Registry first
- Feature isolation
- Shared UI primitives
- Strict TypeScript
- No direct `localStorage` access from feature modules
- Tools run entirely in the browser whenever possible

## Contributing

Please read [docs/contributing.md](docs/contributing.md) before opening a pull
request. New tools should follow [docs/adding-a-new-tool.md](docs/adding-a-new-tool.md).

## License

MIT License

## Development History

Forge is developed in small milestones so shell, registry, and tool modules can
be reviewed independently.

## Development History

Forge is developed in small milestones so shell, registry, and tool modules can
be reviewed independently.
