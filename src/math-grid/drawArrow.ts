import { CELL_SIZE } from './constants';
import { Vector2d } from './types'

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  vec: Vector2d
) {
  const {
    startX: sX = 0,
    startY: sY = 0,
    endX: eX = 0,
    endY: eY = 0,
    color,
  } = vec;

  const headlen = 10;

  const startX = sX * CELL_SIZE;
  // flip y position to handle canvas rendering
  const startY = sY * CELL_SIZE * -1;

  const x = eX * CELL_SIZE;
  // flip y position to handle canvas rendering
  const y = eY * CELL_SIZE * -1;

  const angle = Math.atan2(y - startY, x - startX);

  ctx.beginPath();
  // draw line
  ctx.moveTo(startX, startY);
  ctx.lineTo(x, y);
  // arrow head
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - headlen * Math.cos(angle - Math.PI / 7),
    y - headlen * Math.sin(angle - Math.PI / 7)
  );
  ctx.lineTo(
    x - headlen * Math.cos(angle + Math.PI / 7),
    y - headlen * Math.sin(angle + Math.PI / 7)
  );
  ctx.lineTo(x, y);
  ctx.lineTo(
    x - headlen * Math.cos(angle - Math.PI / 7),
    y - headlen * Math.sin(angle - Math.PI / 7)
  );

  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}
