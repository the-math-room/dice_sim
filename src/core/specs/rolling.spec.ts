import { describe, it, expect } from 'vitest';
import { rollOnce, rollMany } from '../rolling.js';

describe('Rolling Module', () => {
  it('should generate a single roll using the injected random source', () => {
    // A predictable "mock" random function that just alternates numbers
    let toggle = true;
    const fakeRandom = () => {
      toggle = !toggle;
      return toggle ? 3 : 4;
    };

    // Roll 4 dice using our fake generator
    const result = rollOnce(4, fakeRandom);
    
    expect(result).toEqual([4, 3, 4, 3]);
    expect(result.length).toBe(4);
  });

  it('should generate multiple trials accurately', () => {
    // A fake random source that always rolls maximum damage
    const loadedDice = () => 6;

    const trials = rollMany(2, 3, loadedDice); // 2 dice, 3 trials
    
    expect(trials).toEqual([
      [6, 6],
      [6, 6],
      [6, 6]
    ]);
    expect(trials.length).toBe(3);
  });
});