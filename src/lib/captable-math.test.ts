import { describe, expect, it } from "vitest";
import {
  calculateDilution,
  calculateSafeConversion,
  calculateVesting,
  elapsedMonthsUTC,
  parseVestingSchedule,
} from "./captable-math";
import { VestingSchedule } from "./vesting";

describe("parseVestingSchedule", () => {
  it("parses every documented schedule key in VestingSchedule", () => {
    for (const key of Object.keys(VestingSchedule)) {
      const spec = parseVestingSchedule(key);
      expect(spec.totalYears).toBeGreaterThanOrEqual(0);
      expect(spec.cadenceMonths).toBeGreaterThanOrEqual(0);
      expect(spec.cliffYears).toBeGreaterThanOrEqual(0);
    }
  });

  it("throws on malformed schedule strings", () => {
    expect(() => parseVestingSchedule("INVALID")).toThrow();
  });
});

describe("elapsedMonthsUTC", () => {
  it("counts whole calendar months and respects day-of-month boundary", () => {
    const start = new Date("2025-01-15T00:00:00.000Z");
    expect(elapsedMonthsUTC(start, new Date("2025-01-14T00:00:00.000Z"))).toBe(
      0,
    );
    expect(elapsedMonthsUTC(start, new Date("2025-02-14T00:00:00.000Z"))).toBe(
      0,
    );
    expect(elapsedMonthsUTC(start, new Date("2025-02-15T00:00:00.000Z"))).toBe(
      1,
    );
    expect(elapsedMonthsUTC(start, new Date("2026-01-15T00:00:00.000Z"))).toBe(
      12,
    );
  });

  it("handles month-end grants across shorter months (Feb 28/29)", () => {
    const start = new Date("2025-01-31T00:00:00.000Z");
    expect(elapsedMonthsUTC(start, new Date("2025-02-28T00:00:00.000Z"))).toBe(
      1,
    );
  });
});

describe("calculateVesting", () => {
  it("supports immediate vesting (VESTING_0_0_0)", () => {
    const r = calculateVesting(10_000, "VESTING_0_0_0", 0);
    expect(r.vestedShares).toBe(10_000);
    expect(r.unvestedShares).toBe(0);
    expect(r.cliffReached).toBe(true);
  });

  it("enforces 1-year cliff before vesting monthly (VESTING_4_1_1)", () => {
    // Before cliff: 0 vested
    const m11 = calculateVesting(48_000, "VESTING_4_1_1", 11);
    expect(m11.cliffReached).toBe(false);
    expect(m11.vestedShares).toBe(0);
    expect(m11.unvestedShares).toBe(48_000);

    // At 12-month cliff: 25% (12,000) vests
    const m12 = calculateVesting(48_000, "VESTING_4_1_1", 12);
    expect(m12.cliffReached).toBe(true);
    expect(m12.vestedShares).toBe(12_000);
    expect(m12.unvestedShares).toBe(36_000);

    // At 13 months: 13/48ths vests
    const m13 = calculateVesting(48_000, "VESTING_4_1_1", 13);
    expect(m13.vestedShares).toBe(13_000);

    // At 48+ months: 100% vested
    const m48 = calculateVesting(48_000, "VESTING_4_1_1", 60);
    expect(m48.vestedShares).toBe(48_000);
    expect(m48.unvestedShares).toBe(0);
  });

  it("supports quarterly cadence with 1-year cliff (VESTING_4_3_1)", () => {
    expect(calculateVesting(16_000, "VESTING_4_3_1", 14).vestedShares).toBe(
      4_000,
    );
    expect(calculateVesting(16_000, "VESTING_4_3_1", 15).vestedShares).toBe(
      5_000,
    );
  });

  it("maintains share conservation and monotonicity under odd share counts", () => {
    const total = 10_003; // prime-ish indivisible by 48
    let prev = 0;
    for (let m = 0; m <= 50; m++) {
      const r = calculateVesting(total, "VESTING_4_1_1", m);
      expect(r.vestedShares + r.unvestedShares).toBe(total);
      expect(r.vestedShares).toBeGreaterThanOrEqual(prev);
      expect(Number.isInteger(r.vestedShares)).toBe(true);
      prev = r.vestedShares;
    }
    expect(prev).toBe(total);
  });
});

describe("calculateDilution", () => {
  it("computes pre/post ownership and dilution across a priced round + pool expansion", () => {
    const result = calculateDilution(
      [
        { id: "founder-1", shares: 4_000_000 },
        { id: "founder-2", shares: 4_000_000 },
        { id: "angel", shares: 2_000_000 },
      ],
      2_000_000,
      500_000,
    );

    expect(result.preTotalShares).toBe(10_000_000);
    expect(result.postTotalShares).toBe(12_500_000);

    const f1 = result.holdings[0];
    expect(f1?.preOwnership).toBeCloseTo(0.4, 10);
    expect(f1?.postOwnership).toBeCloseTo(0.32, 10);
    expect(f1?.dilutionPercent).toBeCloseTo(20, 10);

    // Ownership conservation invariant: all post-round stakes sum to 1.0
    const totalPostOwnership =
      result.holdings.reduce((s, h) => s + h.postOwnership, 0) +
      result.newInvestorOwnership +
      result.newPoolOwnership;
    expect(totalPostOwnership).toBeCloseTo(1.0, 12);
  });
});

describe("calculateSafeConversion", () => {
  it("picks valuation cap when cap price is lower than discount and round price", () => {
    const res = calculateSafeConversion({
      investmentAmount: 250_000,
      valuationCap: 5_000_000,
      discountPercent: 20,
      roundPricePerShare: 1.0,
      capitalizationShares: 10_000_000,
    });

    // capPrice = 5M / 10M = $0.50 < discountPrice = $0.80 < roundPrice = $1.00
    expect(res.appliedMechanism).toBe("cap");
    expect(res.conversionPrice).toBeCloseTo(0.5, 10);
    expect(res.convertedShares).toBe(500_000);
    expect(res.unallocatedAmount).toBe(0);
  });

  it("picks discount price when discount beats cap and round price", () => {
    const res = calculateSafeConversion({
      investmentAmount: 100_000,
      valuationCap: 15_000_000,
      discountPercent: 20,
      roundPricePerShare: 1.0,
      capitalizationShares: 10_000_000,
    });

    // capPrice = $1.50, discountPrice = $0.80 -> discount wins
    expect(res.appliedMechanism).toBe("discount");
    expect(res.conversionPrice).toBeCloseTo(0.8, 10);
    expect(res.convertedShares).toBe(125_000);
  });

  it("preserves integer share rounding invariant and tracks residual", () => {
    const res = calculateSafeConversion({
      investmentAmount: 100_000,
      valuationCap: 7_000_000,
      discountPercent: null,
      roundPricePerShare: 1.0,
      capitalizationShares: 10_000_000,
    });

    expect(Number.isInteger(res.convertedShares)).toBe(true);
    expect(res.effectiveCost + res.unallocatedAmount).toBeCloseTo(100_000, 6);
    expect(res.unallocatedAmount).toBeGreaterThanOrEqual(0);
    expect(res.unallocatedAmount).toBeLessThan(res.conversionPrice);
  });
});
