import { describe, expect, it } from "vitest";
import { hasJwtDecoderInput, normalizeJwtDecoderInput } from "./jwt-decoder.service";

describe("jwt-decoder service", () => {
  it("normalizes user input", () => {
    expect(normalizeJwtDecoderInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJwtDecoderInput("   ")).toBe(false);
  });
});
