# Adding A New Tool

This guide describes the expected shape of a Forge tool.

## 1. Choose A Category

Allowed categories:

- Workspace
- Editors
- Data
- Encoding
- Crypto
- Utilities

Add a new category only when the existing categories cannot describe the tool
without ambiguity.

## 2. Create The Feature Folder

Use kebab-case for folders:

```text
src/features/json-formatter/
```

Recommended files:

```text
JsonFormatterPage.tsx
json-formatter.service.ts
json-formatter.schema.ts
index.ts
```

Use a schema file when the tool accepts external input, reads persisted data, or
imports files.

## 3. Implement Service Logic First

Keep parsing, formatting, validation, conversion, and generation logic outside
the page component.

Good:

```text
JsonFormatterPage.tsx -> json-formatter.service.ts
```

Avoid:

```text
JsonFormatterPage.tsx contains parser, formatter, storage, and UI logic
```

## 4. Validate Inputs

Use Zod for external data:

- User-pasted structured data
- Imported files
- URL parameters
- Storage payloads

Return typed results that the UI can render without guessing.

## 5. Register The Tool

Each tool exports metadata compatible with the registry.

```ts
export const jsonFormatterTool = {
  id: "json-formatter",
  name: "JSON Formatter",
  category: "Data",
  description: "Format and validate JSON.",
  keywords: ["json", "format", "validate"],
  persist: true,
  icon: Braces,
  component: lazy(() => import("./JsonFormatterPage")),
};
```

Then add the definition to:

```text
src/core/registry/tool.registry.ts
```

The registry should be the only place that needs to know the new tool exists.

## 6. Persistence Rules

Use `persist: true` when restoring user input is useful:

- Markdown preview
- HTML preview
- Diff checker
- JSON formatter

Use `persist: false` when output is disposable:

- UUID generator
- Timestamp converter
- Hash generator
- Password generator

Persistent tools must use the storage service. Do not access `localStorage`
inside feature components.

## 7. UI Rules

- Use `ToolLayout` for tool pages.
- Use shared UI primitives from `src/shared/ui`.
- Use Lucide icons.
- Keep controls keyboard accessible.
- Keep generated output copyable.
- Show validation errors close to the relevant input.

## 8. Tests

Required for:

- Service logic
- Schema validation
- Registry integration

Recommended for:

- Complex keyboard behavior
- Import/export behavior
- Persistence behavior

## Done Checklist

- Feature folder follows naming conventions
- Tool service is separated from UI
- Inputs are validated with Zod where needed
- Tool is registered through the registry
- No sidebar/search/router hardcoding was added
- Tests cover service or core behavior
- `pnpm check` passes
- `pnpm format:check` passes

## Implementation Note 2

Milestone 2 keeps Forge aligned with the registry-first architecture and white-first interface direction.
