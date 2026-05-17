import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Replace 'dice_sim' with the EXACT name of your GitHub repository
  base: './', 
  test: {
    environment: 'node',
    globals: true,
  },
});