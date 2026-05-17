import { describe, it, expect, beforeEach, vi } from 'vitest';
import { runSimulationFromInput } from '../actions.js';
import { store } from '../store.js';
import { simulate } from '../../core/sim.js';

// 1. Updated MockWorker to simulate real asynchronous thread deferral
class MockWorker implements Partial<Worker> {
  onmessage: ((event: any) => void) | null = null;

  postMessage(requestData: any): void {
    // Wrap execution in a setTimeout to push it to the next event loop tick.
    // This gives the main thread time to assign the .onmessage handler first!
    setTimeout(() => {
      try {
        const mockResult = simulate(requestData, () => 6);
        if (this.onmessage) {
          this.onmessage({
            data: { success: true, simulation: mockResult }
          });
        }
      } catch (err) {
        if (this.onmessage) {
          this.onmessage({
            data: { success: false, error: 'Simulation failed' }
          });
        }
      }
    }, 0);
  }

  terminate(): void {}
}

globalThis.Worker = MockWorker as any;

describe('Application actions with Web Worker', () => {
  beforeEach(() => {
    store.setState({ status: 'IDLE' });
  });

  it('updates the store with an error state for invalid form input', () => {
    // This remains synchronous because validation happens before the worker is created
    runSimulationFromInput('abc', '100');

    const state = store.getState();
    expect(state.status).toBe('ERROR');
    if (state.status === 'ERROR') {
      expect(state.error).toContain('Dice per roll');
    }
  });

  // 2. Added 'async' keyword to the test block
  it('updates the store with a success state for valid form input', async () => {
    runSimulationFromInput('2', '3');

    // 3. Use vi.waitFor to poll until the asynchronous mock completes
    await vi.waitFor(() => {
      const state = store.getState();
      expect(state.status).toBe('SUCCESS');
    });

    // 4. Once passed, pull the completed state and assert against the outcomes
    const state = store.getState();
    expect(state.status).toBe('SUCCESS');
    if (state.status === 'SUCCESS') {
      expect(state.simulation.sampleRolls).toEqual([
        [6, 6],
        [6, 6],
        [6, 6],
      ]);
      expect(state.simulation.mean).toBe(12);
      expect(state.simulation.stdDev).toBe(0);
    }
  });
});