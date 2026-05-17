import { Roll, Die } from '../../core/types.js';

const PIP_POSITIONS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9]
};

export function renderRoll(parent: HTMLElement, ix: number, roll: Roll): void {
  const card = document.createElement('div');
  card.className = "roll-card";

  const title = document.createElement('div');
  title.className = "roll-title";
  const total = roll.reduce((a, b) => a + b, 0);
  title.textContent = `#${ix} total ${total}`;
  card.appendChild(title);

  const row = document.createElement('div');
  row.className = "dice-row";
  for (const die of roll) {
    renderDie(row, die);
  }
  card.appendChild(row);

  parent.appendChild(card);
}

function renderDie(parent: HTMLElement, n: Die): void {
  const die = document.createElement('div');
  die.className = `die die-${n}`;

  const activePips = PIP_POSITIONS[n] || [];

  for (let pos = 1; pos <= 9; pos++) {
    const span = document.createElement('span');
    span.className = activePips.includes(pos) ? "pip on" : "pip";
    die.appendChild(span);
  }

  parent.appendChild(die);
}