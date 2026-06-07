# Roadmap

Forge is being built in small milestones. The priority is a stable workstation
architecture before expanding the tool catalog.

## v0.1 Foundation

Status: In progress

Goals:

- Vite, React, TypeScript, Tailwind, and shadcn/ui-style foundation
- Strict linting, formatting, testing, and CI
- App shell
- Registry contract
- Basic documentation for contributors

Exit criteria:

- `pnpm check` passes in CI
- `pnpm format:check` passes in CI or locally before PRs
- Tool registry contract is implemented
- First tool can be registered without shell changes

## v0.2 Workspace Shell

Goals:

- App layout
- Sidebar
- Header
- Tool layout
- Theme provider
- Favorites and recent tools

Exit criteria:

- Navigation is registry-driven
- Theme preference persists
- Sidebar and command surfaces read from the registry

## v0.3 Editors

Tools:

- Markdown Preview
- HTML Preview
- Diff Checker

Focus:

- Monaco integration
- Persistent editor state
- Copy/export actions
- Validation and error states

## v0.4 Data Tools

Tools:

- JSON Formatter
- JSON Validator
- JSON to YAML
- YAML to JSON
- JWT Decoder

Focus:

- Structured validation
- Clear error messages
- Copyable output
- Service-level tests

## v0.5 Utilities

Tools:

- UUID Generator
- Timestamp Converter
- Case Converter
- Slugify
- Base64 Encode/Decode
- URL Encode/Decode

Focus:

- Fast single-screen workflows
- Consistent action buttons
- Shared input/output patterns

## v0.6 Crypto

Tools:

- SHA-256
- SHA-512
- HMAC Generator
- Password Generator

Focus:

- Browser-native crypto APIs where possible
- Clear security limitations
- No secret persistence by default

## v1.0 Stable

Requirements:

- Stable architecture
- Complete core documentation
- Tests for registry, storage, search, and utilities
- Accessibility review
- Responsive shell and tools
- Public contribution workflow

## Non-Goals

- Backend dependency for core workflows
- Account system
- Cloud sync by default
- Replacing a full IDE
