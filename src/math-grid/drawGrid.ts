import { CELL_SIZE } from './constants';

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const xMid = width / 2;
  const yMid = height / 2;
  const xCells = width / CELL_SIZE;
  const yCells = height / CELL_SIZE;
  const color = "grey";

  // draw y axis
  ctx.beginPath();
  ctx.moveTo(-xMid, 0);
  ctx.lineTo(xMid, 0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();

  // y axis notches
  for (let i = 0; i < yCells / 2; i++) {
    // minus
    ctx.beginPath();
    ctx.moveTo(-10, -(i * CELL_SIZE + CELL_SIZE));
    ctx.lineTo(10, -(i * CELL_SIZE + CELL_SIZE));
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    // plus
    ctx.beginPath();
    ctx.moveTo(-10, i * CELL_SIZE + CELL_SIZE);
    ctx.lineTo(10, i * CELL_SIZE + CELL_SIZE);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }

  // draw x axis
  ctx.beginPath();
  ctx.moveTo(0, -yMid);
  ctx.lineTo(0, yMid);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();

  // x axis notches
  for (let i = 0; i < xCells / 2; i++) {
    // minus
    ctx.beginPath();
    ctx.moveTo(-(i * CELL_SIZE + CELL_SIZE), -10);
    ctx.lineTo(-(i * CELL_SIZE + CELL_SIZE), 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    // plus
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE + CELL_SIZE, -10);
    ctx.lineTo(i * CELL_SIZE + CELL_SIZE, 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}
