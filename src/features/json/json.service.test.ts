import { describe, expect, it } from "vitest";
import { hasJsonToolsInput, normalizeJsonToolsInput } from "./json.service";

describe("json service", () => {
  it("normalizes user input", () => {
    expect(normalizeJsonToolsInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJsonToolsInput("   ")).toBe(false);
  });
});
