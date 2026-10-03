import { useSyncExternalStore } from 'react';

export type EffectsMode = 'lite' | 'full';

const KEY = 'ff-effects';
const listeners = new Set<() => void>();

function read(): EffectsMode {
  try {
    return globalThis.localStorage?.getItem(KEY) === 'full' ? 'full' : 'lite';
  } catch {
    return 'lite';
  }
}

let mode = read();

export function effectsMode(): EffectsMode {
  return mode;
}

export function setEffectsMode(next: EffectsMode): void {
  mode = next;
  try {
    globalThis.localStorage?.setItem(KEY, next);
  } catch {
    // Storage can be unavailable in private browsing; keep the in-memory choice.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useEffectsMode(): EffectsMode {
  return useSyncExternalStore(subscribe, effectsMode, () => 'lite');
}
