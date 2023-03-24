export type Color = 'green' | 'red' | string;

export interface Vector2d {
  type: 'Vector';
  startX?: number; // default to 0
  startY?: number; // default to 0
  endX: number;
  endY: number;
  color: Color;
}

export interface Point {
  type: 'Point';
  x: number;
  y: number;
  color: Color;
}

export type MathGridObject = Vector2d | Point;

