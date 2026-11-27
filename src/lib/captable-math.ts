/**
 * Deterministic cap-table calculation helpers for vesting schedules,
 * round dilution, and SAFE conversions.
 *
 * All share counts are integer-rounded deterministically so conservation
 * invariants (`vested + unvested === total`, `sum(shares) === totalShares`)
 * hold across arbitrary inputs.
 */

export interface VestingSpec {
  totalYears: number;
  cadenceMonths: number;
  cliffYears: number;
}

export interface VestingResult {
  totalShares: number;
  vestedShares: number;
  unvestedShares: number;
  vestedRatio: number;
  cliffReached: boolean;
}

export interface StakeholderHolding {
  id: string;
  shares: number;
}

export interface DilutedHolding extends StakeholderHolding {
  preOwnership: number;
  postOwnership: number;
  dilutionPercent: number;
}

export interface DilutionResult {
  preTotalShares: number;
  newInvestorShares: number;
  newPoolShares: number;
  postTotalShares: number;
  holdings: DilutedHolding[];
  newInvestorOwnership: number;
  newPoolOwnership: number;
}

export interface SafeConversionInput {
  investmentAmount: number;
  valuationCap: number | null;
  discountPercent: number | null;
  roundPricePerShare: number;
  capitalizationShares: number;
}

export interface SafeConversionResult {
  conversionPrice: number;
  appliedMechanism: "cap" | "discount" | "round";
  convertedShares: number;
  effectiveCost: number;
  unallocatedAmount: number;
}

/**
 * Parse a `VESTING_<years>_<cadenceMonths>_<cliffYears>` schedule code
 * (e.g. `VESTING_4_1_1` -> 4 years, monthly, 1-year cliff).
 */
export function parseVestingSchedule(schedule: string): VestingSpec {
  const match = /^VESTING_(\d+)_(\d+)_(\d+)$/.exec(schedule);
  if (!match) {
    throw new Error(`Invalid vesting schedule: ${schedule}`);
  }
  return {
    totalYears: Number(match[1]),
    cadenceMonths: Number(match[2]),
    cliffYears: Number(match[3]),
  };
}

/**
 * Calculate whole UTC calendar months elapsed between `startDate` and `asOfDate`.
 * A month is counted once `asOfDate`'s day-of-month reaches `startDate`'s day
 * (clamped to the last day of `asOfDate`'s month for month-end grants).
 */
export function elapsedMonthsUTC(startDate: Date, asOfDate: Date): number {
  if (asOfDate.getTime() < startDate.getTime()) return 0;

  let months =
    (asOfDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (asOfDate.getUTCMonth() - startDate.getUTCMonth());

  const lastDayOfAsOfMonth = new Date(
    Date.UTC(asOfDate.getUTCFullYear(), asOfDate.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const targetDay = Math.min(startDate.getUTCDate(), lastDayOfAsOfMonth);

  if (asOfDate.getUTCDate() < targetDay) {
    months -= 1;
  }
  return Math.max(0, months);
}

/**
 * Compute deterministic integer vested/unvested shares at `elapsedMonths`.
 */
export function calculateVesting(
  totalShares: number,
  schedule: string | VestingSpec,
  elapsedMonths: number,
): VestingResult {
  if (!Number.isInteger(totalShares) || totalShares < 0) {
    throw new Error(
      `totalShares must be a non-negative integer, got ${totalShares}`,
    );
  }
  const spec =
    typeof schedule === "string" ? parseVestingSchedule(schedule) : schedule;
  const totalMonths = spec.totalYears * 12;
  const cliffMonths = spec.cliffYears * 12;
  const months = Math.max(0, Math.floor(elapsedMonths));

  // Immediate vesting (e.g. VESTING_0_0_0)
  if (totalMonths === 0 && cliffMonths === 0) {
    return {
      totalShares,
      vestedShares: totalShares,
      unvestedShares: 0,
      vestedRatio: totalShares === 0 ? 1 : 1,
      cliffReached: true,
    };
  }

  // Cliff-only vesting (e.g. VESTING_0_0_1)
  if (totalMonths === 0 && cliffMonths > 0) {
    const reached = months >= cliffMonths;
    const vestedShares = reached ? totalShares : 0;
    return {
      totalShares,
      vestedShares,
      unvestedShares: totalShares - vestedShares,
      vestedRatio: totalShares === 0 ? 0 : vestedShares / totalShares,
      cliffReached: reached,
    };
  }

  const cliffReached = months >= cliffMonths;
  if (!cliffReached) {
    return {
      totalShares,
      vestedShares: 0,
      unvestedShares: totalShares,
      vestedRatio: 0,
      cliffReached: false,
    };
  }

  if (months >= totalMonths) {
    return {
      totalShares,
      vestedShares: totalShares,
      unvestedShares: 0,
      vestedRatio: 1,
      cliffReached: true,
    };
  }

  const cadence = Math.max(1, spec.cadenceMonths);
  const completedTranches = Math.floor(months / cadence);
  const totalTranches = Math.floor(totalMonths / cadence);
  const vestedShares =
    totalTranches <= 0
      ? totalShares
      : Math.floor((totalShares * completedTranches) / totalTranches);

  return {
    totalShares,
    vestedShares,
    unvestedShares: totalShares - vestedShares,
    vestedRatio: totalShares === 0 ? 0 : vestedShares / totalShares,
    cliffReached: true,
  };
}

/**
 * Compute pre- and post-round ownership and dilution across existing stakeholders.
 */
export function calculateDilution(
  holdings: StakeholderHolding[],
  newInvestorShares: number,
  newPoolShares = 0,
): DilutionResult {
  if (newInvestorShares < 0 || !Number.isInteger(newInvestorShares)) {
    throw new Error("newInvestorShares must be a non-negative integer");
  }
  if (newPoolShares < 0 || !Number.isInteger(newPoolShares)) {
    throw new Error("newPoolShares must be a non-negative integer");
  }

  const preTotalShares = holdings.reduce((sum, h) => {
    if (h.shares < 0 || !Number.isInteger(h.shares)) {
      throw new Error(`Invalid share count for ${h.id}: ${h.shares}`);
    }
    return sum + h.shares;
  }, 0);

  const postTotalShares = preTotalShares + newInvestorShares + newPoolShares;

  const diluted: DilutedHolding[] = holdings.map((h) => {
    const preOwnership = preTotalShares === 0 ? 0 : h.shares / preTotalShares;
    const postOwnership =
      postTotalShares === 0 ? 0 : h.shares / postTotalShares;
    const dilutionPercent =
      preOwnership === 0
        ? 0
        : ((preOwnership - postOwnership) / preOwnership) * 100;
    return {
      ...h,
      preOwnership,
      postOwnership,
      dilutionPercent,
    };
  });

  return {
    preTotalShares,
    newInvestorShares,
    newPoolShares,
    postTotalShares,
    holdings: diluted,
    newInvestorOwnership:
      postTotalShares === 0 ? 0 : newInvestorShares / postTotalShares,
    newPoolOwnership:
      postTotalShares === 0 ? 0 : newPoolShares / postTotalShares,
  };
}

/**
 * Calculate SAFE conversion shares using the most favorable (lowest) price
 * among valuation cap, discount rate, and priced-round price per share.
 */
export function calculateSafeConversion(
  input: SafeConversionInput,
): SafeConversionResult {
  const {
    investmentAmount,
    valuationCap,
    discountPercent,
    roundPricePerShare,
    capitalizationShares,
  } = input;

  if (investmentAmount <= 0) {
    throw new Error("investmentAmount must be positive");
  }
  if (roundPricePerShare <= 0) {
    throw new Error("roundPricePerShare must be positive");
  }
  if (capitalizationShares <= 0) {
    throw new Error("capitalizationShares must be positive");
  }

  let conversionPrice = roundPricePerShare;
  let appliedMechanism: "cap" | "discount" | "round" = "round";

  if (valuationCap !== null && valuationCap > 0) {
    const capPrice = valuationCap / capitalizationShares;
    if (capPrice < conversionPrice) {
      conversionPrice = capPrice;
      appliedMechanism = "cap";
    }
  }

  if (
    discountPercent !== null &&
    discountPercent > 0 &&
    discountPercent < 100
  ) {
    const discountPrice = roundPricePerShare * (1 - discountPercent / 100);
    if (discountPrice < conversionPrice) {
      conversionPrice = discountPrice;
      appliedMechanism = "discount";
    }
  }

  // Floor to whole shares; track unallocated residual from integer rounding.
  const convertedShares = Math.floor(investmentAmount / conversionPrice);
  const effectiveCost = convertedShares * conversionPrice;
  const unallocatedAmount = Math.max(0, investmentAmount - effectiveCost);

  return {
    conversionPrice,
    appliedMechanism,
    convertedShares,
    effectiveCost,
    unallocatedAmount,
  };
}
