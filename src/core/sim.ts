import { RandomSource, rollOnce } from './rolling.js';
import { quantiles, standardDeviation } from './stats.js';
import { Simulation, SimulationRequest, Roll } from './types.js';

export function simulate(request: SimulationRequest, randomInt: RandomSource): Simulation {
  const { dicePerRoll, trialCount } = request;

  const theoreticalMinTotal = dicePerRoll;
  const theoreticalMaxTotal = dicePerRoll * 6;

  const frequencies = new Map<number, number>();
  const sampleRolls: Roll[] = [];
  let totalSum = 0;

  let observedMinTotal = Number.POSITIVE_INFINITY;
  let observedMaxTotal = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < trialCount; i++) {
    const roll = rollOnce(dicePerRoll, randomInt);

    if (i < 20) {
      sampleRolls.push(roll);
    }

    const total = roll.reduce((sum, die) => sum + die, 0);
    totalSum += total;

    observedMinTotal = Math.min(observedMinTotal, total);
    observedMaxTotal = Math.max(observedMaxTotal, total);

    frequencies.set(total, (frequencies.get(total) || 0) + 1);
  }

  const calculatedMean = trialCount === 0 ? 0 : totalSum / trialCount;

  const minTotal = trialCount === 0 ? 0 : observedMinTotal;
  const maxTotal = trialCount === 0 ? 0 : observedMaxTotal;

  const { q1, median, q3 } = quantiles(
    frequencies,
    theoreticalMinTotal,
    theoreticalMaxTotal,
    trialCount
  );

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