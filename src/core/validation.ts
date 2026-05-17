import { MAX_DICE_PER_ROLL, MAX_TRIAL_COUNT } from './config.js';
import type { SimulationRequest, ValidationResult } from './types.js';

export function validateSimulationRequest(
  request: SimulationRequest
): ValidationResult<SimulationRequest> {
  const { dicePerRoll, trialCount } = request;

  if (!Number.isInteger(dicePerRoll) || dicePerRoll <= 0) {
    return {
      success: false,
      error: 'Dice per roll must be a positive whole number.',
    };
  }

  if (!Number.isInteger(trialCount) || trialCount <= 0) {
    return {
      success: false,
      error: 'Number of trials must be a positive whole number.',
    };
  }

  if (dicePerRoll > MAX_DICE_PER_ROLL) {
    return {
      success: false,
      error: `Please use ${MAX_DICE_PER_ROLL} or fewer dice per roll.`,
    };
  }

  if (trialCount > MAX_TRIAL_COUNT) {
    return {
      success: false,
      error: `Please use ${MAX_TRIAL_COUNT} or fewer trials.`,
    };
  }

  return {
    success: true,
    value: request,
  };
}