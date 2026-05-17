import { HistogramRowViewModel } from '../../core/presentation.js';

export function renderHistogram(parent: HTMLElement, rows: readonly HistogramRowViewModel[]): void {
  const h3 = document.createElement('h3');
  h3.textContent = "Total distribution";
  parent.appendChild(h3);

  const container = document.createElement('div');
  container.className = "histogram";

  for (const row of rows) {
    const divRow = document.createElement('div');
    divRow.className = "hist-row";

    const totalLabel = document.createElement('div');
    totalLabel.className = "hist-total";
    totalLabel.textContent = row.labelText; // Updated
    divRow.appendChild(totalLabel);

    const barWrap = document.createElement('div');
    barWrap.className = "hist-bar-wrap";
    const bar = document.createElement('div');
    bar.className = "hist-bar";
    bar.style.width = row.barWidthStyle;
    barWrap.appendChild(bar);
    divRow.appendChild(barWrap);

    const countLabel = document.createElement('div');
    countLabel.className = "hist-count";
    countLabel.textContent = row.countText;
    divRow.appendChild(countLabel);

    container.appendChild(divRow);
  }

  parent.appendChild(container);
}