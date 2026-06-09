import { describe, expect, it } from "vitest";
import { hasUrlEncoderInput, normalizeUrlEncoderInput } from "./url-encoder.service";

describe("url-encoder service", () => {
  it("normalizes user input", () => {
    expect(normalizeUrlEncoderInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasUrlEncoderInput("   ")).toBe(false);
  });
});
