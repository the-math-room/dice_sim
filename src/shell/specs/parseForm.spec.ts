import { describe, it, expect } from 'vitest';
import { parseSimulationRequestForm } from '../parseForm.js';

describe('Form parsing', () => {
  it('should parse valid numeric strings', () => {
    const result = parseSimulationRequestForm('2', '1000');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({
        dicePerRoll: 2,
        trialCount: 1000,
      });
    }
  });

  it('should reject empty or non-numeric inputs', () => {
    const result = parseSimulationRequestForm('abc', '1000');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Dice per roll');
    }
  });

  it('should reject decimals and negatives', () => {
    expect(parseSimulationRequestForm('2.5', '1000').success).toBe(false);
    expect(parseSimulationRequestForm('2', '-50').success).toBe(false);
  });

  it('should reject scientific notation', () => {
    expect(parseSimulationRequestForm('1e3', '1000').success).toBe(false);
  });
});