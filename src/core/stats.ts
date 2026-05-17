import type { Roll } from './types.js';

/**
 * Calculates the sum of each individual roll.
 * Maps [[2, 3], [6, 1]] to [5, 7]
 */
export function totals(rolls: readonly Roll[]): number[] {
  return rolls.map(roll => roll.reduce((sum, die) => sum + die, 0));
}

/**
 * Aggregates rolled totals into a frequency map.
 * Maps [5, 7, 5] to Map { 5 => 2, 7 => 1 }
 */
export function frequencies(rollTotals: readonly number[]): Map<number, number> {
  const freqMap = new Map<number, number>();
  
  for (const total of rollTotals) {
    freqMap.set(total, (freqMap.get(total) || 0) + 1);
  }
  
  return freqMap;
}

/**
 * Calculates the arithmetic mean of the roll totals.
 */
export function mean(rollTotals: readonly number[]): number {
  if (rollTotals.length === 0) return 0;
  
  const sum = rollTotals.reduce((acc, x) => acc + x, 0);
  return sum / rollTotals.length;
}

/**
 * Calculates the population standard deviation from a frequency map.
 */
export function standardDeviation(
  frequencies: Map<number, number>,
  mean: number,
  trialCount: number
): number {
  if (trialCount === 0) return 0;

  let varianceSum = 0;
  for (const [total, freq] of frequencies.entries()) {
    varianceSum += freq * Math.pow(total - mean, 2);
  }

  return Math.sqrt(varianceSum / trialCount);
}

/**
 * Extracts Q1, Median, and Q3 from a frequency map using a cumulative search.
 * Running time is bounded by the small range of possible dice sums, not trial counts.
 */
export function quantiles(
  frequencies: Map<number, number>,
  minTotal: number,
  maxTotal: number,
  trialCount: number
): { q1: number; median: number; q3: number } {
  if (trialCount === 0) return { q1: 0, median: 0, q3: 0 };

  const targetQ1 = trialCount * 0.25;
  const targetMedian = trialCount * 0.50;
  const targetQ3 = trialCount * 0.75;

  let cumulativeCount = 0;
  let q1 = minTotal;
  let median = minTotal;
  let q3 = minTotal;

  let foundQ1 = false;
  let foundMedian = false;
  let foundQ3 = false;

  // Linear scan across the tight range of possible outcome values
  for (let total = minTotal; total <= maxTotal; total++) {
    const freq = frequencies.get(total) || 0;
    cumulativeCount += freq;

    if (!foundQ1 && cumulativeCount >= targetQ1) {
      q1 = total;
      foundQ1 = true;
    }
    if (!foundMedian && cumulativeCount >= targetMedian) {
      median = total;
      foundMedian = true;
    }
    if (!foundQ3 && cumulativeCount >= targetQ3) {
      q3 = total;
      foundQ3 = true;
      break; // Found everything we need
    }
  }

  return { q1, median, q3 };
}