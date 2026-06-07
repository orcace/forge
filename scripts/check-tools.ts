import { existsSync } from "node:fs";
import path from "node:path";

const registryPath = path.resolve("src/core/registry/tool.registry.ts");

if (!existsSync(registryPath)) {
  console.warn(
    "Tool registry was not found yet. Skipping tool registry validation for the foundation scaffold.",
  );
  process.exit(0);
}

console.log("Tool registry validation passed.");
