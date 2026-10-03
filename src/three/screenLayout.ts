const CAMERA_DISTANCE = 5;
const CAMERA_FOV = 29;
const VIEW_PADDING = 1.2;

const worldHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE;

export function plushPixelScale(size: number): number {
  return (size * VIEW_PADDING) / worldHeight;
}

export function screenPosition(rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>, canvas: { width: number; height: number }): [number, number, number] {
  return [rect.left + rect.width / 2 - canvas.width / 2, canvas.height / 2 - rect.top - rect.height / 2, 0];
}

export function isOnscreen(rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>, canvas: { width: number; height: number }): boolean {
  return rect.right >= 0 && rect.left <= canvas.width && rect.bottom >= 0 && rect.top <= canvas.height;
}
