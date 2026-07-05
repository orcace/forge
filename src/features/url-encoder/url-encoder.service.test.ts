import { describe, expect, it } from "vitest";
import {
  decodeUrlComponent,
  encodeUrlComponent,
  getQueryParams,
  getUrlParts,
  hasUrlEncoderInput,
  normalizeUrlEncoderInput,
  transformUrl,
} from "./url-encoder.service";

describe("url-encoder service", () => {
  it("normalizes user input", () => {
    expect(normalizeUrlEncoderInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasUrlEncoderInput("   ")).toBe(false);
  });

  it("encodes and decodes URL components", () => {
    const encoded = encodeUrlComponent("Markdown Preview & JSON/YAML");

    expect(encoded).toBe("Markdown%20Preview%20%26%20JSON%2FYAML");
    expect(decodeUrlComponent(encoded).value).toBe("Markdown Preview & JSON/YAML");
  });

  it("supports form encoding with plus spaces", () => {
    const encoded = transformUrl("hello forge", "encode", {
      encodeSpaceAsPlus: true,
      strategy: "form",
    });

    expect(encoded.value).toBe("hello+forge");
    expect(transformUrl(encoded.value, "decode", { strategy: "form" }).value).toBe(
      "hello forge",
    );
  });

  it("encodes full URLs while preserving structure", () => {
    const result = transformUrl(
      "https://forge.local/tools/url encoder?q=hello forge#result panel",
      "encode",
      { strategy: "full-url" },
    );

    expect(result.value).toContain("https://forge.local/");
    expect(result.value).toContain("url%20encoder");
    expect(result.value).toContain("hello%20forge");
    expect(result.value).toContain("#result%20panel");
  });

  it("extracts URL parts and query parameters", () => {
    const url = "https://forge.local/tools?name=Markdown%20Preview&lang=vi-VN";

    expect(getUrlParts(url).find((part) => part.label === "Host")?.value).toBe(
      "forge.local",
    );
    expect(getQueryParams(url)).toEqual([
      { key: "name", value: "Markdown Preview" },
      { key: "lang", value: "vi-VN" },
    ]);
  });

  it("returns decode errors", () => {
    const result = transformUrl("%E0%A4%A", "decode");

    expect(result.error).toBeTruthy();
  });
});
