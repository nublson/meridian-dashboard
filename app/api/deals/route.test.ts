import { describe, expect, it } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/deals", () => {
  it("returns DealsResponse shape with defaults", async () => {
    const res = await GET(req("/api/deals"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalPages: expect.any(Number),
      total: expect.any(Number),
      deals: expect.any(Array),
    });
    expect(body.deals.length).toBeLessThanOrEqual(10);
  });

  it("clamps pageSize between 5 and 50", async () => {
    const low = await (await GET(req("/api/deals?pageSize=2"))).json();
    expect(low.pageSize).toBe(5);
    const high = await (await GET(req("/api/deals?pageSize=99"))).json();
    expect(high.pageSize).toBe(50);
  });

  it("paginates with page and pageSize", async () => {
    const p1 = await (await GET(req("/api/deals?page=1&pageSize=5"))).json();
    const p2 = await (await GET(req("/api/deals?page=2&pageSize=5"))).json();
    expect(p1.page).toBe(1);
    expect(p1.deals).toHaveLength(5);
    expect(p2.page).toBe(2);
    expect(p2.deals[0].id).not.toBe(p1.deals[0].id);
  });

  it("filters by search query on dealName and client", async () => {
    const all = await (await GET(req("/api/deals?pageSize=50"))).json();
    const firstName = all.deals[0]?.dealName as string | undefined;
    expect(firstName).toBeDefined();
    const token = firstName!.split(/\s+/)[0]!.toLowerCase();
    const filtered = await (await GET(req(`/api/deals?q=${encodeURIComponent(token)}&pageSize=50`))).json();
    expect(filtered.total).toBeGreaterThan(0);
    expect(
      filtered.deals.every(
        (d: { dealName: string; client: string }) =>
          d.dealName.toLowerCase().includes(token) || d.client.toLowerCase().includes(token),
      ),
    ).toBe(true);
  });

  it("filters by allowed stages only and ignores invalid tokens", async () => {
    const mixed = await (
      await GET(req("/api/deals?stages=Qualified,NotAStage&pageSize=50"))
    ).json();
    expect(
      mixed.deals.every((d: { stage: string }) => d.stage === "Qualified"),
    ).toBe(true);
  });

  it("sorts by expectedClose ascending", async () => {
    const data = await (await GET(req("/api/deals?pageSize=50"))).json();
    const times = data.deals.map((d: { expectedClose: string }) =>
      new Date(d.expectedClose).getTime(),
    );
    const sorted = [...times].sort((a, b) => a - b);
    expect(times).toEqual(sorted);
  });
});
