import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/revenue", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns revenue payload shape", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = await GET(req("/api/revenue?dateRange=ytd"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      months: expect.any(Array),
      totalRevenue: expect.any(Number),
      bestMonth: expect.any(String),
      bestMonthAmount: expect.any(Number),
    });
  });
});
