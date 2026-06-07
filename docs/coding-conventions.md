# Coding Conventions

Forge optimizes for readable, maintainable code. Consistency is more important
than personal style.

## TypeScript

- Keep `strict` mode enabled.
- Do not use `any`; prefer `unknown` and validate with Zod.
- Use interfaces for object contracts.
- Use type aliases for unions and mapped types.
- Exported functions should have explicit return types.
- Prefer named exports.

Good:

```ts
export function formatJson(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2);
}
```

Avoid:

```ts
export default function f(value: any) {
  return JSON.stringify(JSON.parse(value), null, 2);
}
```

## React

- Components use PascalCase.
- Keep one primary component per file.
- Keep components focused; extract hooks or children when files grow too large.
- Put business logic in services, stores, or hooks instead of page components.
- Use named exports.

## State

- Use one Zustand store per domain.
- Keep domain actions inside the store.
- Components should call actions rather than reconstructing state transitions.

## Storage

- Feature modules must not call `localStorage` directly.
- Use the storage service for saving, loading, validation, and migrations.
- Validate persisted payloads before using them.

## Styling

- Use Tailwind CSS utilities and shared shadcn/ui-style components.
- Avoid one-off CSS unless the styling is global or cannot be expressed cleanly
  with utilities.
- Keep page layouts responsive by default.
- Use stable dimensions for controls that should not shift during interaction.

## Icons

- Use `lucide-react`.
- Do not introduce another icon library without approval.

## Errors

- Do not silently swallow errors.
- Report errors through the shared logger or visible UI state.
- Use typed result objects for expected validation failures.

## Tests

Prioritize tests for:

- Core services
- Registry behavior
- Search behavior
- Storage migrations
- Tool service logic

UI smoke tests are useful for shell-level confidence, but service tests should
carry most behavior coverage.

## Imports

- Use `@/` for imports from `src`.
- Do not import from another feature module.
- Keep `src/shared` independent from app, core, widgets, and features.
