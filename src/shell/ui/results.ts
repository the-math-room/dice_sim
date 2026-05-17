import { Simulation } from '../../core/types.js';
import { 
  prepareHistogramViewModel, 
  prepareSummaryViewModel, 
  SummaryViewModel 
} from '../../core/presentation.js';
import { renderHistogram } from './histogram.js';
import { renderRoll } from './diceFace.js';

export function renderError(parent: HTMLElement, msg: string): void {
  const p = document.createElement('p');
  p.className = "error";
  p.textContent = msg;
  parent.appendChild(p);
}

export function renderSimulation(parent: HTMLElement, sim: Simulation): void {
  const section = document.createElement('section');
  
  const h2 = document.createElement('h2');
  h2.textContent = "Results";
  section.appendChild(h2);

  // Derive our lightweight blueprints from core logic
  const summaryVm = prepareSummaryViewModel(sim);
  const histogramVm = prepareHistogramViewModel(sim);

  renderSummary(section, summaryVm);
  renderHistogram(section, histogramVm);
  renderSampleRolls(section, 20, sim);

  parent.appendChild(section);
}

function renderSummary(parent: HTMLElement, vm: SummaryViewModel): void {
  const summary = document.createElement('div');
  summary.className = "summary";

  stat(summary, "Dice per roll", vm.dicePerRollText);
  stat(summary, "Trials", vm.trialCountText);
  stat(summary, "Mean total", vm.meanTotalText);
  stat(summary, "Std Deviation (σ)", vm.stdDevText);
  stat(summary, "Five-Number Summary", vm.boxPlotText);

  parent.appendChild(summary);
}

function stat(parent: HTMLElement, labelText: string, valueText: string): void {
  const div = document.createElement('div');
  div.className = "stat";

  const strong = document.createElement('strong');
  strong.className = "stat-label";
  strong.textContent = labelText;
  div.appendChild(strong);

  div.appendChild(document.createTextNode(": "));

  const span = document.createElement('span');
  span.className = "stat-value";
  span.textContent = valueText;
  div.appendChild(span);

  parent.appendChild(div);
}

function renderSampleRolls(parent: HTMLElement, maxRows: number, sim: Simulation): void {
  const h3 = document.createElement('h3');
  h3.textContent = "Sample rolls";
  parent.appendChild(h3);

  // Read from our micro-cached array instead of the full trial history
  const displayCount = Math.min(maxRows, sim.sampleRolls.length);
  const p = document.createElement('p');
  p.textContent = `Showing the first ${displayCount} rolls.`;
  parent.appendChild(p);

  const gallery = document.createElement('div');
  gallery.className = "roll-gallery";

  for (let i = 0; i < displayCount; i++) {
    renderRoll(gallery, i + 1, sim.sampleRolls[i]);
  }

  parent.appendChild(gallery);
}