import { describe, expect, it } from "vitest";
import {
  createJwtSecret,
  createPassphrase,
  createPassword,
  hasPasswordGeneratorInput,
  normalizePasswordGeneratorInput,
} from "./password-generator.service";

describe("password-generator service", () => {
  it("normalizes user input", () => {
    expect(normalizePasswordGeneratorInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasPasswordGeneratorInput("   ")).toBe(false);
  });

  it("creates random passwords with requested character classes", () => {
    const result = createPassword({
      avoidAmbiguous: false,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      includeUppercase: true,
      length: 32,
    });

    expect(result.value).toHaveLength(32);
    expect(result.entropyBits).toBeGreaterThan(128);
  });

  it("creates passphrases", () => {
    const result = createPassphrase({ separator: "-", titleCase: false, words: 5 });

    expect(result.value.split("-")).toHaveLength(5);
  });

  it("creates JWT secrets for HS algorithms", () => {
    const env = createJwtSecret({
      format: "env",
      size: 256,
      variableName: "JWT_SECRET",
    });
    const hex = createJwtSecret({
      format: "hex",
      size: 512,
      variableName: "JWT_SECRET",
    });

    expect(env.value).toMatch(/^JWT_SECRET=/);
    expect(env.entropyBits).toBe(256);
    expect(hex.value).toHaveLength(128);
  });
});
