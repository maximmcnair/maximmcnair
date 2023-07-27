import { CELL_SIZE } from './constants';
import { Point } from './types'

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  point: Point
){
  ctx.beginPath();
  ctx.arc(point.x * CELL_SIZE, point.y * CELL_SIZE * -1, 5, 0, 2 * Math.PI)
  ctx.fillStyle = 'red';
  ctx.fill()
  ctx.closePath();
}
