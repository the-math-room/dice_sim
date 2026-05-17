import { simulate } from '../core/sim.js';
import type { SimulationRequest } from '../core/types.js';
import type { RandomSource } from '../core/rolling.js';

const nativeRandomInt: RandomSource = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Listen for the main thread to hand off a simulation request
self.addEventListener('message', (event: MessageEvent<SimulationRequest>) => {
  const request = event.data;

  try {
    // Run the computation on this isolated background thread
    const simulation = simulate(request, nativeRandomInt);
    
    // Post the completed simulation data back to the main thread
    self.postMessage({ success: true, simulation });
  } catch (err) {
    self.postMessage({ 
      success: false, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred.' 
    });
  }
});