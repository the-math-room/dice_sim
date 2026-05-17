import { RandomSource, rollOnce } from './rolling.js';
import { quantiles, standardDeviation } from './stats.js';
import { Simulation, SimulationRequest, Roll } from './types.js';

export function simulate(request: SimulationRequest, randomInt: RandomSource): Simulation {
  const { dicePerRoll, trialCount } = request;
  const minTotal = dicePerRoll;
  const maxTotal = dicePerRoll * 6;

  const frequencies = new Map<number, number>();
  const sampleRolls: Roll[] = [];
  let totalSum = 0;

  // Single-pass execution loop
  for (let i = 0; i < trialCount; i++) {
    const roll = rollOnce(dicePerRoll, randomInt);

    // Retain only the tiny subset needed for UI rendering
    if (i < 20) {
      sampleRolls.push(roll);
    }

    // Accumulate metrics on the fly without storing the roll
    const total = roll.reduce((sum, die) => sum + die, 0);
    totalSum += total;
    frequencies.set(total, (frequencies.get(total) || 0) + 1);
  }

  const calculatedMean = trialCount === 0 ? 0 : totalSum / trialCount;
  const { q1, median, q3 } = quantiles(frequencies, minTotal, maxTotal, trialCount);
  const stdDev = standardDeviation(frequencies, calculatedMean, trialCount);

  return {
    request,
    sampleRolls,
    frequencies,
    mean: calculatedMean,
    stdDev,
    minTotal,
    q1,
    median,
    q3,
    maxTotal
  };
}