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

  // 1. Set UI to loading state
  store.setState({ status: 'LOADING' });

  // 2. Instantiate background Web Worker
  const worker = new Worker(
    new URL('./sim.worker.ts', import.meta.url), 
    { type: 'module' }
  );

  // 3. Handoff payload data
  worker.postMessage(validationResult.value);

  // 4. Capture response
  worker.onmessage = (event) => {
    const { success, simulation, error } = event.data;

    if (success) {
      store.setState({ status: 'SUCCESS', simulation });
    } else {
      store.setState({ status: 'ERROR', error });
    }

    worker.terminate();
  };

  // Fixed: Removed the unused 'err' parameter entirely since it's not needed
  worker.onerror = () => {
    store.setState({ status: 'ERROR', error: 'Worker thread crashed unexpectedly.' });
    worker.terminate();
  };
}