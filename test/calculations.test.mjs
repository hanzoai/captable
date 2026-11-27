// Deterministic unit tests for captable calculations:
// 1. Dilution math (Priced rounds & investment issuance)
// 2. Cliff & monthly vesting schedules
// 3. SAFE conversion (Pre-money & Post-money caps, discounts)
// 4. Rounding and integer invariant checks

import test from "node:test";
import assert from "node:assert/strict";

// Vesting Calculation Function
export function calculateVestedShares({
  totalShares,
  monthsElapsed,
  totalVestingMonths = 48,
  cliffMonths = 12,
}) {
  if (totalShares <= 0 || monthsElapsed <= 0) {
    return 0;
  }
  if (monthsElapsed < cliffMonths) {
    return 0; // Cliff not reached
  }
  if (monthsElapsed >= totalVestingMonths) {
    return totalShares; // Fully vested
  }
  // Standard monthly vesting
  const monthlyRate = totalShares / totalVestingMonths;
  return Math.floor(monthlyRate * monthsElapsed);
}

// SAFE Conversion Calculation Function
export function calculateSafeConversion({
  investmentAmount,
  valuationCap,
  discountRate = 0, // e.g., 0.20 for 20% discount
  pricedRoundPreMoneyValuation,
  pricedRoundPricePerShare,
  companyTotalSharesPreRound,
  isPostMoney = true,
}) {
  // Cap price per share calculation
  let capPricePerShare = 0;
  if (isPostMoney) {
    capPricePerShare = valuationCap / (companyTotalSharesPreRound + (valuationCap / pricedRoundPricePerShare));
  } else {
    capPricePerShare = valuationCap / companyTotalSharesPreRound;
  }

  const discountPricePerShare = pricedRoundPricePerShare * (1 - discountRate);

  // Conversion price is minimum of cap price and discounted price
  const conversionPrice = Math.min(
    capPricePerShare > 0 ? capPricePerShare : pricedRoundPricePerShare,
    discountPricePerShare > 0 ? discountPricePerShare : pricedRoundPricePerShare
  );

  const convertedShares = Math.floor(investmentAmount / conversionPrice);
  return {
    conversionPrice,
    convertedShares,
    capPricePerShare,
    discountPricePerShare,
  };
}

// Dilution & Cap Table Percentage Function
export function calculateDilution({
  existingShares,
  newInvestmentAmount,
  pricePerShare,
}) {
  const newShares = Math.floor(newInvestmentAmount / pricePerShare);
  const totalPostRoundShares = existingShares + newShares;
  const investorOwnershipPct = (newShares / totalPostRoundShares) * 100;
  const founderDilutionFactor = existingShares / totalPostRoundShares;

  return {
    newShares,
    totalPostRoundShares,
    investorOwnershipPct: Number(investorOwnershipPct.toFixed(4)),
    founderDilutionFactor: Number(founderDilutionFactor.toFixed(6)),
  };
}

// --- TESTS ---

test("Vesting: returns 0 shares before 1-year cliff", () => {
  const total = 48000;
  assert.equal(calculateVestedShares({ totalShares: total, monthsElapsed: 0 }), 0);
  assert.equal(calculateVestedShares({ totalShares: total, monthsElapsed: 6 }), 0);
  assert.equal(calculateVestedShares({ totalShares: total, monthsElapsed: 11 }), 0);
});

test("Vesting: cliff release exactly at month 12 (25%)", () => {
  const total = 48000;
  const vestedAtCliff = calculateVestedShares({ totalShares: total, monthsElapsed: 12 });
  assert.equal(vestedAtCliff, 12000); // 12/48 = 25%
});

test("Vesting: monthly vesting increments monotonically and caps at month 48", () => {
  const total = 48000;
  const atMonth24 = calculateVestedShares({ totalShares: total, monthsElapsed: 24 });
  const atMonth36 = calculateVestedShares({ totalShares: total, monthsElapsed: 36 });
  const atMonth48 = calculateVestedShares({ totalShares: total, monthsElapsed: 48 });
  const atMonth60 = calculateVestedShares({ totalShares: total, monthsElapsed: 60 });

  assert.equal(atMonth24, 24000); // 50%
  assert.equal(atMonth36, 36000); // 75%
  assert.equal(atMonth48, 48000); // 100%
  assert.equal(atMonth60, 48000); // capped at 100%
});

test("SAFE: Pre-money cap conversion math with discount", () => {
  const result = calculateSafeConversion({
    investmentAmount: 100000, // $100k
    valuationCap: 5000000,     // $5M cap
    discountRate: 0.20,        // 20% discount
    pricedRoundPreMoneyValuation: 10000000, // $10M round
    pricedRoundPricePerShare: 2.0,           // $2.00 / share
    companyTotalSharesPreRound: 5000000,     // 5M shares
    isPostMoney: false,
  });

  // Pre-money cap price: $5M / 5M = $1.00
  // Discount price: $2.00 * 0.8 = $1.60
  // Optimal conversion price: $1.00
  assert.equal(result.capPricePerShare, 1.0);
  assert.equal(result.discountPricePerShare, 1.6);
  assert.equal(result.conversionPrice, 1.0);
  assert.equal(result.convertedShares, 100000);
});

test("SAFE: Discount triggered when cap is higher than round valuation", () => {
  const result = calculateSafeConversion({
    investmentAmount: 50000,
    valuationCap: 10000000,    // $10M cap
    discountRate: 0.15,        // 15% discount
    pricedRoundPreMoneyValuation: 5000000, // $5M round
    pricedRoundPricePerShare: 1.0,          // $1.00 / share
    companyTotalSharesPreRound: 5000000,
    isPostMoney: false,
  });

  // Cap price: $10M / 5M = $2.00
  // Discount price: $1.00 * 0.85 = $0.85
  // Conversion price should be discount price ($0.85)
  assert.equal(result.conversionPrice, 0.85);
  assert.equal(result.convertedShares, Math.floor(50000 / 0.85));
});

test("Dilution: priced round math and ownership invariants", () => {
  const result = calculateDilution({
    existingShares: 10000000,      // 10M shares
    newInvestmentAmount: 2000000,  // $2M raised
    pricePerShare: 1.0,            // $1.00 / share
  });

  assert.equal(result.newShares, 2000000);
  assert.equal(result.totalPostRoundShares, 12000000);
  // Investor owns 2M / 12M = 16.6667%
  assert.equal(result.investorOwnershipPct, 16.6667);
  // Founder dilution factor: 10M / 12M = 0.833333
  assert.equal(result.founderDilutionFactor, 0.833333);
});

test("Invariants: non-integer division preserves floor rounding invariants", () => {
  // Check odd investment amount that produces fractional shares
  const result = calculateDilution({
    existingShares: 1000000,
    newInvestmentAmount: 33333,
    pricePerShare: 1.5,
  });

  assert.equal(Number.isInteger(result.newShares), true);
  assert.equal(result.newShares, 22222); // floor(33333 / 1.5)
  assert.equal(result.totalPostRoundShares, 1022222);
});
