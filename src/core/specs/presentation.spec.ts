import { describe, it, expect } from 'vitest';
import { prepareHistogramViewModel, prepareSummaryViewModel } from '../presentation.js';
import { Simulation } from '../types.js';

describe('Presentation Module', () => {
  const mockSim: Simulation = {
    request: { dicePerRoll: 1, trialCount: 2 },
    sampleRolls: [[3], [4]], // Changed from rolls
    frequencies: new Map([[3, 1], [4, 1]]),
    mean: 3.5,
    stdDev: 0.5,
    minTotal: 1,
    q1: 3,
    median: 3,
    q3: 4,
    maxTotal: 6
  };

  it('should format summary strings predictably', () => {
    const vm = prepareSummaryViewModel(mockSim);
    
    expect(vm.meanTotalText).toBe('3.50');
    expect(vm.stdDevText).toBe('0.50');
    expect(vm.boxPlotText).toBe('[Min: 1 | Q1: 3 | Med: 3 | Q3: 4 | Max: 6]');
  });

it('should map complex histogram bounds to exact string outputs', () => {
    const rows = prepareHistogramViewModel(mockSim);
    
    // Total observed range is 3 to 4, which is 2 steps.
    expect(rows.length).toBe(2); 
    
    // Index 0 matches total 3
    const rowForTotalThree = rows[0];
    expect(rowForTotalThree.labelText).toBe('3');
    expect(rowForTotalThree.barWidthStyle).toBe('100%');
    expect(rowForTotalThree.countText).toBe('1 / 50.00%');
  });
});