import { describe, expect, it } from 'vitest';
import { RECIPES } from './recipes';

describe('recipe cooking tools', () => {
  it('assigns a cooking tool to every recipe', () => {
    for (const recipe of RECIPES) expect(['wok', 'pan', 'pot', 'oven', 'bowl']).toContain(recipe.tool);
    expect(RECIPES.find((r) => r.id === 'kimchi-fried-rice')?.tool).toBe('wok');
    expect(RECIPES.find((r) => r.id === 'bibimbap')?.tool).toBe('bowl');
    expect(RECIPES.find((r) => r.id === 'shepherds-pie')?.tool).toBe('oven');
  });
});
