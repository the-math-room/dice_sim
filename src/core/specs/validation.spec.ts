import { describe, it, expect } from 'vitest';
import { validateSimulationRequest } from '../validation.js';
import { MAX_DICE_PER_ROLL, MAX_TRIAL_COUNT } from '../config.js';

describe('Validation Module', () => {
  it('should accept a valid simulation request', () => {
    const result = validateSimulationRequest({
      dicePerRoll: 2,
      trialCount: 1000,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.dicePerRoll).toBe(2);
      expect(result.value.trialCount).toBe(1000);
    }
  });

  it('should fail on decimals or negative values', () => {
    const decimalResult = validateSimulationRequest({
      dicePerRoll: 2.5,
      trialCount: 1000,
    });

    expect(decimalResult.success).toBe(false);

    const negativeResult = validateSimulationRequest({
      dicePerRoll: 2,
      trialCount: -50,
    });

    expect(negativeResult.success).toBe(false);
  });

  it('should enforce maximum configuration boundaries', () => {
    const brokenDice = validateSimulationRequest({
      dicePerRoll: MAX_DICE_PER_ROLL + 1,
      trialCount: 100,
    });

    expect(brokenDice.success).toBe(false);

    const brokenTrials = validateSimulationRequest({
      dicePerRoll: 2,
      trialCount: MAX_TRIAL_COUNT + 1,
    });

    expect(brokenTrials.success).toBe(false);
  });
});