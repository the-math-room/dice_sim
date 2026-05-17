import { describe, it, expect } from 'vitest';
import { totals, frequencies, mean } from '../stats.js';

describe('Stats Module', () => {
  it('should compute totals correctly', () => {
    const sampleRolls = [[1, 2], [6, 6], [3, 4]];
    expect(totals(sampleRolls)).toEqual([3, 12, 7]);
  });

  it('should calculate frequencies accurately', () => {
    const sampleTotals = [7, 5, 7, 12, 7];
    const result = frequencies(sampleTotals);
    
    expect(result.get(7)).toBe(3);
    expect(result.get(5)).toBe(1);
    expect(result.get(12)).toBe(1);
    expect(result.get(2)).toBe(undefined); // Unrolled value
  });

  it('should compute the mean total', () => {
    expect(mean([10, 20, 30])).toBe(20);
    expect(mean([])).toBe(0); // Edge case handling
  });
});