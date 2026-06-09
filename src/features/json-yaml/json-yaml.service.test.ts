import { describe, expect, it } from "vitest";
import { hasJsonYamlInput, normalizeJsonYamlInput } from "./json-yaml.service";

describe("json-yaml service", () => {
  it("normalizes user input", () => {
    expect(normalizeJsonYamlInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJsonYamlInput("   ")).toBe(false);
  });
});
