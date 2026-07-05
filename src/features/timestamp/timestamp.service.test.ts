import { describe, expect, it } from "vitest";
import {
  convertTimestampInput,
  hasTimestampInput,
  normalizeTimestampInput,
} from "./timestamp.service";

describe("timestamp service", () => {
  it("normalizes user input", () => {
    expect(normalizeTimestampInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasTimestampInput("   ")).toBe(false);
  });

  it("parses millisecond timestamps", () => {
    const result = convertTimestampInput("1700000000000");

    expect(result?.seconds).toBe(1700000000);
    expect(result?.microseconds).toBe(1700000000000000);
  });
});
