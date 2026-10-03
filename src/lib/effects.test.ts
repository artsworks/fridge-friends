import { describe, expect, it } from 'vitest';
import { effectsMode, setEffectsMode } from './effects';

describe('effects mode', () => {
  it('defaults to lite and switches to full on request', () => {
    expect(effectsMode()).toBe('lite');
    setEffectsMode('full');
    expect(effectsMode()).toBe('full');
    setEffectsMode('lite');
    expect(effectsMode()).toBe('lite');
  });
});
