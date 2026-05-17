import { Simulation } from './types.js';

export interface HistogramRowViewModel {
  readonly labelText: string; // Changed from totalText to support ranges
  readonly barWidthStyle: string;
  readonly countText: string;
}

export interface SummaryViewModel {
  readonly dicePerRollText: string;
  readonly trialCountText: string;
  readonly meanTotalText: string;
  readonly stdDevText: string;
  readonly boxPlotText: string;
}

/**
 * Transforms simulation frequencies into a strictly size-bounded layout matrix.
 * Enforces a hard limit on DOM nodes regardless of the number of dice rolled.
 */
export function prepareHistogramViewModel(sim: Simulation, maxBins = 25): HistogramRowViewModel[] {
  const { frequencies, request } = sim;
  const trialCount = request.trialCount;
  
  if (frequencies.size === 0) return [];

  // 1. Dynamic Viewport Isolation: Calculate boundaries from actual rolled data
  const observedTotals = Array.from(frequencies.keys());
  const observedMin = Math.min(...observedTotals);
  const observedMax = Math.max(...observedTotals);
  
  const totalObservedRange = observedMax - observedMin + 1;
  const useBinning = totalObservedRange > maxBins;
  
  // 2. Compute bin widths relative only to where the data actually lives
  const binWidth = useBinning ? Math.ceil(totalObservedRange / maxBins) : 1;
  const calculatedBinCount = useBinning ? Math.ceil(totalObservedRange / binWidth) : totalObservedRange;

  const binCounts: number[] = new Array(calculatedBinCount).fill(0);
  const binLabels: string[] = new Array(calculatedBinCount);

  // 3. Map frequencies into the zoomed layout slices
  for (let i = 0; i < calculatedBinCount; i++) {
    const binMin = observedMin + i * binWidth;
    const binMax = Math.min(binMin + binWidth - 1, observedMax);
    
    binLabels[i] = binMin === binMax ? `${binMin}` : `${binMin}–${binMax}`;
    
    let accumulatedCount = 0;
    for (let currentTotal = binMin; currentTotal <= binMax; currentTotal++) {
      accumulatedCount += frequencies.get(currentTotal) || 0;
    }
    binCounts[i] = accumulatedCount;
  }

  const maxBinCount = binCounts.length > 0 ? Math.max(...binCounts) : 0;

  return binCounts.map((count, index) => {
    const totalPct = trialCount === 0 ? 0 : (count / trialCount) * 100;
    const barPct = maxBinCount === 0 ? 0 : (count / maxBinCount) * 100;

    return {
      labelText: binLabels[index],
      barWidthStyle: `${barPct}%`,
      countText: `${count} / ${totalPct.toFixed(2)}%`
    };
  });
}

export function prepareSummaryViewModel(sim: Simulation): SummaryViewModel {
  return {
    dicePerRollText: String(sim.request.dicePerRoll),
    trialCountText: String(sim.request.trialCount),
    meanTotalText: sim.mean.toFixed(2),
    stdDevText: sim.stdDev.toFixed(2),
    boxPlotText: `[Min: ${sim.minTotal} | Q1: ${sim.q1} | Med: ${sim.median} | Q3: ${sim.q3} | Max: ${sim.maxTotal}]`
  };
}