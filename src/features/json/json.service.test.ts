import { describe, expect, it } from "vitest";
import {
  formatJson,
  getJsonStats,
  hasJsonToolsInput,
  sortJsonKeys,
  normalizeJsonToolsInput,
} from "./json.service";

describe("json service", () => {
  it("normalizes user input", () => {
    expect(normalizeJsonToolsInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJsonToolsInput("   ")).toBe(false);
  });

  it("formats with configurable indentation", () => {
    expect(formatJson('{"a":1}', 4).value).toContain('    "a"');
    expect(formatJson('{"a":1}', "tab").value).toContain('\t"a"');
  });

  it("sorts nested object keys", () => {
    expect(sortJsonKeys('{"z":1,"a":{"b":2,"a":1}}').value).toBe(
      '{\n  "a": {\n    "a": 1,\n    "b": 2\n  },\n  "z": 1\n}',
    );
  });

  it("collects structural stats", () => {
    expect(getJsonStats({ a: [1, "two", false, null] })).toEqual({
      arrays: 1,
      booleans: 1,
      keys: 1,
      nulls: 1,
      numbers: 1,
      objects: 1,
      strings: 1,
    });
  });

  it("returns parser position when available", () => {
    const result = formatJson('{\n  "a": true,\n}');

    expect(result.error).toBeTruthy();
    expect(result.errorLine).toBe(3);
  });
});
