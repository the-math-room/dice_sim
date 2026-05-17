import type { SimulationRequest, ValidationResult } from '../core/types.js';
import { validateSimulationRequest } from '../core/validation.js';

function parsePositiveInteger(label: string, raw: string): ValidationResult<number> {
  const cleaned = raw.trim();

  if (!/^\d+$/.test(cleaned)) {
    return {
      success: false,
      error: `${label} must be a positive whole number.`,
    };
  }

  const value = Number(cleaned);

  if (!Number.isSafeInteger(value) || value <= 0) {
    return {
      success: false,
      error: `${label} must be a positive whole number.`,
    };
  }

  return {
    success: true,
    value,
  };
}

export function parseSimulationRequestForm(
  diceRaw: string,
  trialsRaw: string
): ValidationResult<SimulationRequest> {
  const diceResult = parsePositiveInteger('Dice per roll', diceRaw);
  if (!diceResult.success) return diceResult;

  const trialsResult = parsePositiveInteger('Number of trials', trialsRaw);
  if (!trialsResult.success) return trialsResult;

  return validateSimulationRequest({
    dicePerRoll: diceResult.value,
    trialCount: trialsResult.value,
  });
}