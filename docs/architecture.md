# Architecture

Forge is a browser-based developer workstation. It is not a set of isolated
utility pages; each tool is treated as a module that plugs into a shared
workspace shell.

## Goals

- Keep tool behavior predictable through a single registry.
- Keep feature modules isolated so tools can be added without editing unrelated
  UI surfaces.
- Keep user data local by default.
- Make core systems testable outside React components.

## Stack

- React 19 for the UI
- TypeScript in strict mode
- Vite for development and production builds
- Tailwind CSS 4 and shadcn/ui conventions for styling
- Zustand for workspace state
- React Router for navigation
- Zod for validating user, storage, and import data
- Monaco Editor for editor-heavy tools
- Lucide React for icons

## Layers

```text
src/app       Application entry, providers, global styles
src/layouts   Shared page and tool layouts
src/core      Product engines and cross-tool state
src/features  Isolated developer tools
src/widgets   Composed shell UI such as sidebar and command palette
src/shared    UI primitives, hooks, utilities, and types
```

## Dependency Rules

Allowed:

```text
app -> layouts -> widgets -> core -> shared
features -> core
features -> shared
widgets -> core
widgets -> shared
```

Forbidden:

```text
core -> features
feature A -> feature B
shared -> app/core/features/widgets
```

These rules keep the registry as the integration point instead of allowing
hidden coupling between tools.

## Core Systems

### Registry

The registry is the source of truth for available tools. Sidebar, routing,
search, command palette, favorites, and recent tools must read registry data
instead of maintaining separate tool lists.

### Storage

Features must not call `localStorage` directly. Storage access goes through the
storage service so schema validation, migrations, and key naming stay
centralized.

### Workspace

Workspace state contains cross-tool UI state such as active tool, favorites,
recent tools, sidebar state, and user preferences. Domain logic belongs in the
store or service layer, not inline in components.

### Search

Search is registry-driven. It indexes tool name, category, description, and
keywords. Search results should not depend on hardcoded page lists.

## Tool Contract

A tool module owns its page, service, schema, and public metadata. A tool should
export a `ToolDefinition` that includes:

```ts
export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  keywords: string[];
  icon: LucideIcon;
  persist: boolean;
  component: LazyExoticComponent<ComponentType>;
}
```

## Testing Strategy

Required:

- Registry behavior
- Storage service and migrations
- Search indexing and ranking
- Utility and service logic

Recommended:

- Tool service behavior
- Accessibility checks for complex interactions
- Smoke tests for shell-level rendering

Not required by default:

- Thin UI wrappers with no logic

## Non-Goals

- Forge does not require a backend for core functionality.
- Forge does not aim to become a full IDE.
- Forge does not store user data externally by default.

## Implementation Note 1

Milestone 1 keeps Forge aligned with the registry-first architecture and white-first interface direction.
