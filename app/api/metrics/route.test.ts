import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function req(url: string) {
  return new Request(`http://localhost${url}`);
}

describe("GET /api/metrics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns metrics array and updatedAt", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = await GET(req("/api/metrics?dateRange=30d"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body.metrics).toHaveLength(4);
    expect(typeof body.updatedAt).toBe("string");
  });
});
