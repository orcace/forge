import { describe, expect, it } from "vitest";
import { hasBase64Input, normalizeBase64Input } from "./base64.service";

describe("base64 service", () => {
  it("normalizes user input", () => {
    expect(normalizeBase64Input("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasBase64Input("   ")).toBe(false);
  });
});
