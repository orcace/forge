import { describe, expect, it } from "vitest";
import {
  convertJsonYaml,
  hasJsonYamlInput,
  normalizeJsonYamlInput,
} from "./json-yaml.service";

describe("json-yaml service", () => {
  it("normalizes user input", () => {
    expect(normalizeJsonYamlInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJsonYamlInput("   ")).toBe(false);
  });

  it("converts nested JSON to YAML", () => {
    expect(
      convertJsonYaml(
        '{"name":"Forge","tools":["json","yaml"],"meta":{"local":true,"version":1}}',
        "json-to-yaml",
      ).value,
    ).toBe("name: Forge\ntools:\n  - json\n  - yaml\nmeta:\n  local: true\n  version: 1");
  });

  it("converts nested YAML to JSON", () => {
    expect(
      convertJsonYaml(
        "name: Forge\ntools:\n  - json\n  - yaml\nmeta:\n  local: true\n  version: 1",
        "yaml-to-json",
      ).value,
    ).toBe(
      '{\n  "name": "Forge",\n  "tools": [\n    "json",\n    "yaml"\n  ],\n  "meta": {\n    "local": true,\n    "version": 1\n  }\n}',
    );
  });

  it("supports custom indentation", () => {
    expect(convertJsonYaml('{"a":{"b":1}}', "json-to-yaml", 4).value).toBe(
      "a:\n    b: 1",
    );
    expect(convertJsonYaml("a:\n  b: 1", "yaml-to-json", 4).value).toContain('    "b"');
  });

  it("returns parser position for invalid JSON", () => {
    const result = convertJsonYaml('{\n  "a": true,\n}', "json-to-yaml");

    expect(result.error).toBeTruthy();
    expect(result.errorLine).toBe(3);
  });
});
