import process from "node:process";

const toolName = process.argv[2];

if (!toolName) {
  console.error("Usage: pnpm create:tool <tool-id>");
  process.exit(1);
}

console.log(
  `Tool scaffolding for "${toolName}" is not implemented yet. Follow docs/adding-a-new-tool.md.`,
);
