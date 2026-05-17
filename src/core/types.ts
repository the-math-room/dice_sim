// Type Aliases: Giving semantic meaning to primitive types
export type Die = number;     // Must be an integer 1-6
export type Roll = Die[];    // A collection of rolled dice (e.g., [3, 5, 1])

// This represents the raw, validated input from a user
export interface SimulationRequest {
  readonly dicePerRoll: number;
  readonly trialCount: number;
}

// This represents the entire structural outcome of a simulation run
export interface Simulation {
  readonly request: SimulationRequest;
  readonly sampleRolls: Roll[]; // Bounded to a tiny display sample (e.g., max 20)
  readonly frequencies: Map<number, number>;
  readonly mean: number;
  readonly stdDev: number;
  readonly minTotal: number;
  readonly q1: number;
  readonly median: number;
  readonly q3: number;
  readonly maxTotal: number;
}

// Validation types to enforce error handling without throwing exceptions
export type ValidationResult<T> = 
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: string };