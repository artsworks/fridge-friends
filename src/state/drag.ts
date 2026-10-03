export const DRAG_THRESHOLD = 8;

interface Point {
  x: number;
  y: number;
}

export class DragGesture {
  private origin: Point = { x: 0, y: 0 };
  private distance = 0;

  begin(point: Point) {
    this.origin = point;
    this.distance = 0;
  }

  move(point: Point) {
    this.distance = Math.max(this.distance, Math.hypot(point.x - this.origin.x, point.y - this.origin.y));
  }

  get dragged() {
    return this.distance >= DRAG_THRESHOLD;
  }
}
