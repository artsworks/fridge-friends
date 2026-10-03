import { createElement, forwardRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { HTMLMotionProps, PanInfo } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BY_ID } from '../data/ingredients';
import { anchors } from '../state/dom';
import { IngredientChip } from './IngredientChip';

const probe = vi.hoisted(() => ({
  button: null as HTMLMotionProps<'button'> | null,
  start: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  setDraggingId: vi.fn(),
}));

vi.mock('motion/react', () => ({
  motion: {
    button: forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>((props, ref) => {
      probe.button = props;
      return createElement('button', { ref });
    }),
    span: 'span',
  },
  useDragControls: () => ({ start: probe.start }),
  useReducedMotion: () => false,
}));

vi.mock('../state/KitchenContext', () => ({
  useKitchen: () => ({ state: { bench: [] }, add: probe.add, remove: probe.remove, setDraggingId: probe.setDraggingId }),
}));

const pointer = (x: number, y: number) => ({
  clientX: x, clientY: y, pageX: x + 600, pageY: y + 900,
  isPrimary: true, button: 0, buttons: 1, type: 'pointerup',
}) as unknown as React.PointerEvent<HTMLButtonElement>;

const click = (detail = 1) => ({ detail }) as React.MouseEvent<HTMLButtonElement>;
const pan = {} as PanInfo;

beforeEach(() => {
  vi.clearAllMocks();
  renderToStaticMarkup(createElement(IngredientChip, { ing: BY_ID.get('egg')!, index: 0 }));
});

afterEach(() => { anchors.bench = null; });

describe('ingredient gestures', () => {
  it('keeps press activation native instead of mounting Motion press listeners', () => {
    expect(probe.button?.type).toBe('button');
    expect(probe.button?.whileTap).toBeUndefined();
    expect(probe.button?.onTap).toBeUndefined();
    expect(probe.button?.onClick).toBeTypeOf('function');
  });

  it('starts Motion with an eight-pixel threshold and accepts a micro-drag tap', () => {
    const button = probe.button!;
    button.onPointerDown?.(pointer(100, 100));
    expect(probe.start).toHaveBeenCalledWith(expect.anything(), { distanceThreshold: 8 });
    button.onPointerMoveCapture?.(pointer(105, 105));
    button.onPointerUpCapture?.(pointer(105, 105));
    button.onClick?.(click());
    expect(probe.add).toHaveBeenCalledTimes(1);
  });

  it('suppresses a real drag but not the next click when no post-drag click arrives', () => {
    const button = probe.button!;
    button.onPointerDown?.(pointer(100, 100));
    button.onPointerMoveCapture?.(pointer(150, 150));
    button.onClick?.(click());
    expect(probe.add).not.toHaveBeenCalled();
    button.onPointerDown?.(pointer(100, 100));
    button.onClick?.(click());
    expect(probe.add).toHaveBeenCalledTimes(1);
  });

  it('accepts keyboard activation after a drag', () => {
    const button = probe.button!;
    button.onPointerDown?.(pointer(100, 100));
    button.onPointerMoveCapture?.(pointer(150, 150));
    button.onClick?.(click(0));
    expect(probe.add).toHaveBeenCalledTimes(1);
  });

  it('highlights the bench and drops using client rather than page coordinates', () => {
    anchors.bench = {
      getBoundingClientRect: () => ({ left: 100, right: 400, top: 200, bottom: 300 }),
    } as HTMLElement;
    const button = probe.button!;
    button.onPointerDown?.(pointer(100, 100));
    button.onDragStart?.(pointer(150, 250) as unknown as PointerEvent, pan);
    expect(probe.setDraggingId).toHaveBeenCalledWith('egg');
    button.onDragEnd?.(pointer(150, 250) as unknown as PointerEvent, pan);
    expect(probe.setDraggingId).toHaveBeenLastCalledWith(null);
    expect(probe.add).toHaveBeenCalledWith('egg', null);
    button.onClick?.(click());
    expect(probe.add).toHaveBeenCalledTimes(1);
  });

  it('does not add an ingredient for an outside or cancelled drop', () => {
    anchors.bench = {
      getBoundingClientRect: () => ({ left: 100, right: 400, top: 200, bottom: 300 }),
    } as HTMLElement;
    const button = probe.button!;
    button.onDragEnd?.(pointer(50, 50) as unknown as PointerEvent, pan);
    button.onDragEnd?.({ ...pointer(150, 250), type: 'pointercancel' } as unknown as PointerEvent, pan);
    expect(probe.add).not.toHaveBeenCalled();
    expect(probe.setDraggingId).toHaveBeenLastCalledWith(null);
  });
});
