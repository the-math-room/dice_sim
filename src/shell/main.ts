import { store } from './store.js';
import { renderControls } from './ui/controls.js';
import { renderSimulation, renderError } from './ui/results.js';
import { runSimulationFromInput } from './actions.js';
import './ui/styles.css'; 

function main(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('Could not find root #app element.');

  const app = document.createElement('main');
  const h1 = document.createElement('h1');
  h1.textContent = 'Dice statistics simulator';
  app.appendChild(h1);

  const resultsViewport = document.createElement('div');

  // Trigger our revamped async process action pipeline directly
  renderControls(app, (diceRaw, trialsRaw) => {
    runSimulationFromInput(diceRaw, trialsRaw);
  });

  app.appendChild(resultsViewport);
  root.appendChild(app);

  store.subscribe((state) => {
    resultsViewport.replaceChildren();
    
    // Toggle button access so users can't spam inputs while loading
    const rollButton = app.querySelector('button');
    if (rollButton) {
      rollButton.disabled = state.status === 'LOADING';
    }

    switch (state.status) {
      case 'IDLE': {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'Choose dice and trials, then roll.';
        resultsViewport.appendChild(emptyState);
        break;
      }

      case 'LOADING': { // Added!
        const loadingIndicator = document.createElement('p');
        loadingIndicator.className = 'loading-state';
        loadingIndicator.textContent = 'Simulating outcomes in background thread...';
        resultsViewport.appendChild(loadingIndicator);
        break;
      }

      case 'ERROR':
        renderError(resultsViewport, state.error);
        break;

      case 'SUCCESS':
        renderSimulation(resultsViewport, state.simulation);
        break;
    }
  });
}

window.addEventListener('DOMContentLoaded', main);