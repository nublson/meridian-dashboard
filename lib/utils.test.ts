import { describe, expect, it } from "vitest";
import { cn, formatCompactCurrency, formatCurrency, formatPercent } from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles conditional and array inputs", () => {
    expect(cn("base", false && "hidden", ["flex", "gap-2"])).toBe("base flex gap-2");
  });
});

describe("formatCurrency", () => {
  it("formats USD with two fraction digits", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("formatCompactCurrency", () => {
  it("uses full currency below 1k", () => {
    expect(formatCompactCurrency(999)).toBe("$999.00");
  });

  it("uses k suffix from 1k", () => {
    expect(formatCompactCurrency(1500)).toBe("$2k");
    expect(formatCompactCurrency(1000)).toBe("$1k");
  });

  it("uses M suffix from 1M", () => {
    expect(formatCompactCurrency(2_500_000)).toBe("$2.5M");
  });
});

describe("formatPercent", () => {
  it("appends percent sign", () => {
    expect(formatPercent(12.5)).toBe("12.5%");
  });
});
