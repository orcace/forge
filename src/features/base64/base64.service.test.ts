import { describe, expect, it } from "vitest";
import {
  decodeBase64,
  detectBase64Variant,
  encodeBase64,
  hasBase64Input,
  normalizeBase64Input,
  transformBase64,
} from "./base64.service";

describe("base64 service", () => {
  it("normalizes user input", () => {
    expect(normalizeBase64Input("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasBase64Input("   ")).toBe(false);
  });

  it("encodes and decodes UTF-8 text", () => {
    const encoded = encodeBase64("Forge tiếng Việt");

    expect(encoded).toBe("Rm9yZ2UgdGnhur9uZyBWaeG7h3Q=");
    expect(decodeBase64(encoded).value).toBe("Forge tiếng Việt");
  });

  it("supports Base64URL without padding", () => {
    const encoded = encodeBase64("https://forge.cuthanhcam.workers.dev/?raw=???", {
      padding: false,
      variant: "url",
    });

    expect(encoded).not.toContain("=");
    expect(encoded).not.toContain("+");
    expect(decodeBase64(encoded, { variant: "url" }).value).toBe(
      "https://forge.cuthanhcam.workers.dev/?raw=???",
    );
    expect(detectBase64Variant(encoded)).toBe("url");
  });

  it("supports UTF-16LE text", () => {
    const encoded = encodeBase64("Forge", { textEncoding: "utf-16le" });

    expect(encoded).toBe("RgBvAHIAZwBlAA==");
    expect(decodeBase64(encoded, { textEncoding: "utf-16le" }).value).toBe("Forge");
  });

  it("wraps MIME lines when requested", () => {
    const encoded = encodeBase64("a".repeat(80), { lineWrap: true });

    expect(encoded).toContain("\n");
    expect(decodeBase64(encoded).value).toBe("a".repeat(80));
  });

  it("returns errors through transform", () => {
    const result = transformBase64("not valid !!!", "decode");

    expect(result.error).toBeTruthy();
    expect(result.value).toBe("");
  });
});
