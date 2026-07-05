import { describe, expect, it } from "vitest";
import {
  generateHashResult,
  generateHashes,
  hasHashGeneratorInput,
  normalizeHashGeneratorInput,
} from "./hash.service";

describe("hash service", () => {
  it("normalizes user input", () => {
    expect(normalizeHashGeneratorInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasHashGeneratorInput("   ")).toBe(false);
  });

  it("generates SHA digests", async () => {
    const hashes = await generateHashes("Forge");

    expect(hashes).toHaveLength(4);
    expect(hashes.find((hash) => hash.algorithm === "SHA-256")?.value).toBe(
      "8899ecd1626db63dd12b9c57879efda72a1a78a21b498e943c07229dedc09ea7",
    );
  });

  it("supports HMAC output formats", async () => {
    const result = await generateHashResult("payload", {
      algorithm: "SHA-256",
      format: "base64url",
      key: "secret",
      mode: "hmac",
    });

    expect(result.error).toBeUndefined();
    expect(result.digests[0].label).toBe("HMAC-SHA-256");
    expect(result.digests[0].value).not.toContain("+");
  });

  it("requires a HMAC key", async () => {
    const result = await generateHashResult("payload", {
      algorithm: "SHA-256",
      format: "hex",
      key: "",
      mode: "hmac",
    });

    expect(result.error).toBe("Enter an HMAC secret key.");
  });
});
