import { describe, expect, it } from "vitest";
import { buildExportUrl } from "./export-url";

describe("buildExportUrl", () => {
  it("includes format and dateRange", () => {
    const u = buildExportUrl("json", "30d");
    expect(u).toBe("/api/export?format=json&dateRange=30d");
  });

  it("adds q when non-empty after trim", () => {
    expect(buildExportUrl("csv", "7d", "  acme  ")).toBe(
      "/api/export?format=csv&dateRange=7d&q=acme",
    );
  });

  it("omits q when missing or whitespace-only", () => {
    expect(buildExportUrl("json", "ytd", "")).toBe(
      "/api/export?format=json&dateRange=ytd",
    );
    expect(buildExportUrl("json", "ytd", "   ")).toBe(
      "/api/export?format=json&dateRange=ytd",
    );
  });

  it("joins stages", () => {
    expect(buildExportUrl("json", "6m", undefined, ["Qualified", "Discovery"])).toBe(
      "/api/export?format=json&dateRange=6m&stages=Qualified%2CDiscovery",
    );
  });

  it("omits stages when empty array", () => {
    expect(buildExportUrl("json", "3m", undefined, [])).toBe(
      "/api/export?format=json&dateRange=3m",
    );
  });
});
