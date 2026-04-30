import { describe, expect, it } from "vitest";
import { explainCron } from "@/lib/cron";

describe("cron", () => {
  it("rejects expressions without 5 fields", () => {
    const r = explainCron("* * *");
    expect(r.ok).toBe(false);
  });

  it("explains every-minute", () => {
    const r = explainCron("* * * * *");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.fields[0].description).toMatch(/every minute/);
  });

  it("explains a weekly schedule", () => {
    const r = explainCron("0 9 * * 1");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fields[4].description).toMatch(/Monday/);
      expect(r.fields[1].description).toMatch(/hour 9/);
    }
  });

  it("rejects out-of-range values", () => {
    const r = explainCron("* 25 * * *");
    expect(r.ok).toBe(false);
  });

  it("handles step values", () => {
    const r = explainCron("*/15 * * * *");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.fields[0].description).toMatch(/every 15/);
  });
});
