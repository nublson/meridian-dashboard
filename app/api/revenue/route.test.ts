import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/revenue", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns revenue payload shape", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
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

  it("returns period-appropriate bucket counts", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const cases: [string, number][] = [
      ["7d", 7],
      ["30d", 4],
      ["3m", 3],
      ["6m", 6],
      ["ytd", 6],
    ];
    for (const [range, len] of cases) {
      const res = await GET(req(`/api/revenue?dateRange=${range}`));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.months).toHaveLength(len);
    }
  });
});
