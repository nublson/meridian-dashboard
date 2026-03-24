import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/lead-sources", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns slices and totalLeads", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = await GET(req("/api/lead-sources?dateRange=3m"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slices.length).toBeGreaterThan(0);
    expect(body.totalLeads).toBe(
      body.slices.reduce((a: number, s: { count: number }) => a + s.count, 0),
    );
  });
});
