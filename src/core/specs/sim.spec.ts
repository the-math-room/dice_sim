import { describe, it, expect } from 'vitest';
import { simulate } from '../sim.js';
import { SimulationRequest } from '../types.js';

describe('Simulation Orchestration Module', () => {
  it('should stitch rolling and stats components together perfectly', () => {
    const request: SimulationRequest = {
      dicePerRoll: 2,
      trialCount: 3
    };

    let current = 3;
    const alternatingDice = () => {
      const rolled = current;
      current = current === 3 ? 4 : 3;
      return rolled;
    };

    const simResult = simulate(request, alternatingDice);

    // Verify the bounded UI sample array works
    expect(simResult.sampleRolls).toEqual([
      [3, 4], 
      [3, 4], 
      [3, 4]  
    ]);

    // Assert your new mathematical engine properties
    expect(simResult.mean).toBe(7);
    expect(simResult.stdDev).toBe(0); // Identical totals mean 0 variance
    expect(simResult.q1).toBe(7);
    expect(simResult.median).toBe(7);
    expect(simResult.q3).toBe(7);
    
    expect(simResult.minTotal).toBe(7);
    expect(simResult.maxTotal).toBe(7);
    expect(simResult.frequencies.get(7)).toBe(3);
  });
});