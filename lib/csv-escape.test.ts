import { describe, expect, it } from "vitest";
import { csvEscape } from "./csv-escape";

describe("csvEscape", () => {
  it("returns plain strings unchanged", () => {
    expect(csvEscape("hello")).toBe("hello");
    expect(csvEscape("Acme Corp")).toBe("Acme Corp");
  });

  it("quotes fields containing comma", () => {
    expect(csvEscape("a,b")).toBe('"a,b"');
  });

  it("quotes fields containing double quote and escapes quotes", () => {
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
  });

  it("quotes fields containing newline", () => {
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
  });
});
