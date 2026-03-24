import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/export", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns JSON with expected top-level keys", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = await GET(req("/api/export?format=json&dateRange=30d"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body).toMatchObject({
      dateRange: "30d",
      metrics: expect.any(Array),
      leadSources: expect.objectContaining({
        slices: expect.any(Array),
        totalLeads: expect.any(Number),
      }),
      revenue: expect.objectContaining({
        months: expect.any(Array),
        totalRevenue: expect.any(Number),
        bestMonth: expect.any(String),
        bestMonthAmount: expect.any(Number),
      }),
      deals: expect.any(Array),
      exportedAt: expect.any(String),
    });
  });

  it("returns CSV with header and text/csv", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = await GET(req("/api/export?format=csv&dateRange=7d"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    const text = await res.text();
    const lines = text.split("\n");
    expect(lines[0]).toBe(
      "id,dealName,client,stage,value,owner,expectedClose",
    );
    expect(lines.length).toBeGreaterThan(1);
  });
});
