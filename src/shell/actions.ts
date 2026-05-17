import type { AppState } from './store.js';
import { parseSimulationRequestForm } from './parseForm.js';
import { store } from './store.js';

export function runSimulationFromInput(diceRaw: string, trialsRaw: string): void {
  const validationResult = parseSimulationRequestForm(diceRaw, trialsRaw);

  if (!validationResult.success) {
    store.setState({
      status: 'ERROR',
      error: validationResult.error,
    });
    return;
  }

  // 1. Immediately drop the UI into a loading state
  store.setState({ status: 'LOADING' });

  // 2. Instantiate our Vite-supported Web Worker script natively
  const worker = new Worker(
    new URL('./sim.worker.ts', import.meta.url), 
    { type: 'module' }
  );

  // 3. Send the validated request payload over the thread wall
  worker.postMessage(validationResult.value);

  // 4. Listen for the background thread to reply
  worker.onmessage = (event) => {
    const { success, simulation, error } = event.data;

    if (success) {
      store.setState({ status: 'SUCCESS', simulation });
    } else {
      store.setState({ status: 'ERROR', error });
    }

    // Always terminate the worker when done to instantly reclaim browser memory
    worker.terminate();
  };

  worker.onerror = (err) => {
    store.setState({ status: 'ERROR', error: 'Worker thread crashed unexpectedly.' });
    worker.terminate();
  };
}