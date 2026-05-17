import { 
  DEFAULT_DICE_PER_ROLL, 
  DEFAULT_TRIAL_COUNT, 
  MAX_DICE_PER_ROLL, 
  MAX_TRIAL_COUNT 
} from '../../core/config.js';

export function renderControls(
  parent: HTMLElement, 
  onRoll: (diceRaw: string, trialsRaw: string) => void
): void {
  const section = document.createElement('section');
  
  const h2 = document.createElement('h2');
  h2.textContent = "Dice simulator";
  section.appendChild(h2);

  const diceInput = numberField(
    section,
    "Dice per roll",
    DEFAULT_DICE_PER_ROLL,
    "1",
    MAX_DICE_PER_ROLL,
    `Example: 2 means roll 2d6. Max: ${MAX_DICE_PER_ROLL}.`
  );

  const trialsInput = numberField(
    section,
    "Number of trials",
    DEFAULT_TRIAL_COUNT,
    "1",
    MAX_TRIAL_COUNT,
    `Example: 1000 means run the roll 1000 times. Max: ${MAX_TRIAL_COUNT}.`
  );

  const button = document.createElement('button');
  button.textContent = "Roll";
  button.addEventListener('click', () => {
    onRoll(diceInput.value, trialsInput.value);
  });
  section.appendChild(button);

  parent.appendChild(section);
}

function numberField(
  parent: HTMLElement, 
  labelText: string, 
  initial: number, 
  min: string, 
  max: number, 
  helperText: string
): HTMLInputElement {
  const div = document.createElement('div');
  div.className = "field";

  const inputId = `input-${labelText.toLowerCase().replace(/\s+/g, '-')}`;

  const label = document.createElement('label');
  label.textContent = labelText;
  label.setAttribute('for', inputId); 
  div.appendChild(label);

  const input = document.createElement('input');
  input.type = "number";
  input.id = inputId; 
  input.value = String(initial);
  input.min = min;
  input.max = String(max);
  div.appendChild(input);

  const small = document.createElement('small');
  small.textContent = helperText;
  div.appendChild(small);

  parent.appendChild(div);
  return input;
}