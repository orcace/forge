import { describe, expect, it } from "vitest";
import {
  decodeJwt,
  generateJwtExample,
  getJwtBreakdownRows,
  hasJwtDecoderInput,
  normalizeJwtDecoderInput,
  verifyJwtSignature,
} from "./jwt-decoder.service";

const hs256Token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQyIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmZvcmdlLmxvY2FsIiwiYXVkIjoiZm9yZ2UtYXBpIiwiaWF0IjoxNzE5ODAwMDAwLCJuYmYiOjE3MTk4MDAwMDAsImV4cCI6MjUzMjQwMDAwMH0.I5QWq5bQ8YPsUn740ax_QE1XVNXAHf171NukCN5PEN8";

describe("jwt-decoder service", () => {
  it("normalizes user input", () => {
    expect(normalizeJwtDecoderInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasJwtDecoderInput("   ")).toBe(false);
  });

  it("decodes header, payload and registered claims", () => {
    const decoded = decodeJwt(hs256Token, new Date("2026-01-01T00:00:00.000Z"));

    expect(decoded.error).toBeUndefined();
    expect(decoded.algorithm).toBe("HS256");
    expect(decoded.header).toContain('"typ": "JWT"');
    expect(decoded.payload).toContain('"sub": "user_42"');
    expect(decoded.claims.find((claim) => claim.name === "exp")?.status).toBe("active");
  });

  it("reports malformed tokens", () => {
    const decoded = decodeJwt("abc.def");

    expect(decoded.error).toBe("JWT must contain exactly three dot-separated sections.");
  });

  it("warns about unsigned tokens and missing validation claims", () => {
    const decoded = decodeJwt(
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyXzQyIn0.",
    );

    expect(decoded.warnings.some((warning) => warning.title === "Unsigned token")).toBe(
      true,
    );
    expect(
      decoded.warnings.some((warning) => warning.title === "No expiration claim"),
    ).toBe(true);
  });

  it("verifies HS256 signatures locally", async () => {
    await expect(verifyJwtSignature(hs256Token, "forge-secret")).resolves.toMatchObject({
      status: "verified",
    });
    await expect(verifyJwtSignature(hs256Token, "wrong-secret")).resolves.toMatchObject({
      status: "failed",
    });
  });

  it("generates signed HMAC examples", async () => {
    const token = await generateJwtExample("HS384", "forge-secret");
    const decoded = decodeJwt(token);

    expect(decoded.algorithm).toBe("HS384");
    await expect(verifyJwtSignature(token, "forge-secret")).resolves.toMatchObject({
      status: "verified",
    });
  });

  it("generates inspectable asymmetric examples", async () => {
    const token = await generateJwtExample("RS256", "forge-secret");
    const decoded = decodeJwt(token);

    expect(decoded.algorithm).toBe("RS256");
    await expect(verifyJwtSignature(token, "forge-secret")).resolves.toMatchObject({
      status: "unsupported",
    });
  });

  it("builds breakdown rows for decoded sections", () => {
    const decoded = decodeJwt(hs256Token);
    const headerRows = getJwtBreakdownRows(decoded.headerJson, "header");
    const payloadRows = getJwtBreakdownRows(decoded.payloadJson, "payload");

    expect(headerRows.find((row) => row.name === "alg")?.description).toContain(
      "Algorithm",
    );
    expect(payloadRows.find((row) => row.name === "exp")?.status).toBe("active");
  });
});
