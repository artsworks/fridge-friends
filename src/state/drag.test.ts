import { describe, expect, it } from 'vitest';
import { DRAG_THRESHOLD, DragGesture } from './drag';

describe('DragGesture', () => {
  it('treats small pointer movement as a tap', () => {
    const gesture = new DragGesture();
    gesture.begin({ x: 100, y: 200 });
    gesture.move({ x: 105, y: 205 });
    expect(gesture.dragged).toBe(false);
  });

  it('starts a drag at the distance threshold', () => {
    const gesture = new DragGesture();
    gesture.begin({ x: 100, y: 200 });
    gesture.move({ x: 100 + DRAG_THRESHOLD, y: 200 });
    expect(gesture.dragged).toBe(true);
  });

  it('remembers a drag even when the pointer returns to its origin', () => {
    const gesture = new DragGesture();
    gesture.begin({ x: 100, y: 200 });
    gesture.move({ x: 120, y: 200 });
    gesture.move({ x: 100, y: 200 });
    expect(gesture.dragged).toBe(true);
  });

  it('does not suppress the next tap after a drag', () => {
    const gesture = new DragGesture();
    gesture.begin({ x: 100, y: 200 });
    gesture.move({ x: 120, y: 200 });
    gesture.begin({ x: 100, y: 200 });
    expect(gesture.dragged).toBe(false);
  });
});
