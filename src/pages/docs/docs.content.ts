export interface DocPageContent {
  description: string;
  id: string;
  markdown: string;
  title: string;
}

export const docPages: DocPageContent[] = [
  {
    description: "How Forge is organized, why it exists, and how to move through it.",
    id: "overview",
    title: "Product docs",
    markdown: `# Product docs

Forge is a local-first developer workstation for everyday utility work: previewing Markdown and HTML, formatting data, decoding tokens, generating secrets, comparing text, and transforming strings without losing your place.

The project is shaped around one idea: every tool should feel like part of the same product. The toolbar, panes, copy actions, validation states, and navigation all follow one shared design language.

## Product principles

- **Local-first by default.** Sensitive inputs such as JWTs, secrets, passwords, hashes, and text snippets stay in the browser.
- **Fast paths for repeated work.** Common actions such as copy, export, clear, generate, and format are placed near the thing they affect.
- **Dense but calm interfaces.** Forge is a workstation, not a marketing page. Tool surfaces prioritize scanning, comparison, and repeated use.
- **Consistent affordances.** Segmented controls, sliders, toggles, pane headers, and result cards behave the same across tools.

## Tool families

### Editors

Markdown Preview, HTML Preview, and Diff Checker provide full-height workspaces with live review loops. They set the interaction model for the rest of Forge: input on one side, result on the other, with compact controls above.

### Data

JSON Formatter, JSON YAML Converter, and JWT Decoder focus on validation, structure, and readable output. Errors are shown inline, not hidden behind dialogs.

### Encoding

Base64 and URL Encoder keep encode/decode flows close together and make copy actions visible because these tools are usually used in quick loops.

### Crypto

JWT Secret Generator, Hash Generator, and Password Generator run locally and make generated values easy to inspect, hide, copy, or export.

### Utilities

UUID Generator, Timestamp Converter, Case Converter, Slugify, and Regex Tester support common implementation tasks that usually happen between coding and debugging.

## Navigation model

The left navigation is the product map. Tool categories stay stable, while support and documentation live in the help menu at the bottom. The header reflects the active page or tool, and each tool owns its own compact toolbar inside the workspace.

## What to build next

When adding a new feature, start with the workflow:

1. What does the user paste, type, or generate?
2. What result do they need to copy or export?
3. What validation or warning prevents mistakes?
4. Which controls should be near the input, and which should be near the output?
5. Does it follow the existing ToolSurface, PaneHeader, button, toggle, and segmented-control patterns?
`,
  },
  {
    description:
      "Implementation guidance for extending Forge without breaking the product language.",
    id: "guides",
    title: "Guides",
    markdown: `# Guides

These guides are written for continuing Forge development. They are intentionally practical: follow the existing patterns first, then add abstraction only when the code asks for it.

## Add a new tool

Every tool should have a feature folder under \`src/features/<tool-id>\`.

\`\`\`txt
src/features/example-tool/
  ExampleToolPage.tsx
  example-tool.service.ts
  example-tool.service.test.ts
  example-tool.schema.ts
  index.ts
\`\`\`

Register the tool in \`src/core/registry/tool.registry.ts\` with a stable id, route, category, keywords, icon, and status. Then connect the page in \`ToolPlaceholderPage.tsx\`.

## Use the Forge workspace pattern

Most tools should use:

- \`ToolSurface\` for the outer shell.
- \`ToolToolbar\` for compact mode controls and primary actions.
- \`PaneHeader\` for input/result labels and lightweight stats.
- Two-pane grids for edit-and-result workflows.
- Result cards for copyable outputs.

Avoid hero-style layouts inside tools. Tool screens should feel operational and repeatable.

## Place actions by intent

Put global actions in the toolbar: generate, export, clear, reset, download.

Put value-specific actions next to the value: copy, show, hide, inspect, validate. This is why Password Generator and JWT Secret Generator place Copy and Show/Hide beside the generated output.

## Validation and errors

Validation should be visible in the workspace:

- Use rose panels for invalid input.
- Keep the original input editable.
- Preserve partial results when useful.
- Avoid modal-only errors.

## Tests

Services should own deterministic behavior and test coverage. UI can stay focused when service tests cover parsing, formatting, conversion, and edge cases.

Before finishing a feature, run:

\`\`\`bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
\`\`\`

## Commit shape

Prefer small commits that tell the development story:

1. Service and tests.
2. Workspace UI.
3. Registry or route wiring.
4. Polish or consistency fixes.
`,
  },
  {
    description: "Keyboard shortcuts and interaction conventions used across Forge.",
    id: "shortcuts",
    title: "Keyboard shortcuts",
    markdown: `# Keyboard shortcuts

Forge keeps shortcuts small and predictable. The goal is to speed up repeated work without making the product feel like it has hidden rules.

## Global shortcuts

| Shortcut | Action |
| --- | --- |
| \`Ctrl K\` | Open command palette |
| \`Cmd K\` | Open command palette on macOS |
| \`Esc\` | Close dialogs, menus, and popovers when supported |

## Editor conventions

Text-heavy tools support normal editor expectations:

- \`Ctrl A\` selects editable content.
- \`Ctrl C\` copies selected text.
- \`Tab\` inserts indentation in JSON-style editors where implemented.
- Long outputs should support wrapping controls when horizontal inspection matters.

## Navigation conventions

- Tool routes live under \`/tools/:toolId\`.
- Documentation lives under \`/docs\` and \`/docs/:docId\`.
- Support pages live under \`/support/:mode\`.

## Copy conventions

Copy buttons should be visible beside generated or transformed output. Header copy actions are only useful when the page has a single obvious output.
`,
  },
];

export function getDocPage(docId?: string): DocPageContent {
  return docPages.find((page) => page.id === docId) ?? docPages[0];
}
