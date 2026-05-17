import { Roll } from './types.js';

// Define a type for our random number generator function contract
export type RandomSource = (min: number, max: number) => number;

/**
 * Simulates a single roll of a given number of dice.
 * It uses the provided random source instead of hardcoding global Math.random.
 */
export function rollOnce(diceCount: number, randomInt: RandomSource): Roll {
  const roll: number[] = [];
  
  for (let i = 0; i < diceCount; i++) {
    roll.push(randomInt(1, 6));
  }
  
  return roll;
}

/**
 * Simulates multiple independent trials of dice rolls.
 */
export function rollMany(
  dicePerRoll: number, 
  trialCount: number, 
  randomInt: RandomSource
): Roll[] {
  const rolls: Roll[] = [];
  
  for (let i = 0; i < trialCount; i++) {
    rolls.push(rollOnce(dicePerRoll, randomInt));
  }
  
  return rolls;
}