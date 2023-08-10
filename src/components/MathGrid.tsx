import { useEffect, useRef } from 'react';
import { drawGrid, drawArrow, drawPoint, MathGridObject } from '@/math-grid/'

interface Props {
  items: MathGridObject[];
}

export function MathGrid({ items }: Props){
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refFrame = useRef<number>(0);

  function render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number
  ){
    ctx.save();
    // clear screen
    ctx.clearRect(0, 0, width, height);

    // center
    ctx.translate(width / 2, height / 2);

    drawGrid(ctx, width, height);

    for (let item of items) {
      switch(item.type) {
        case 'Point':
          drawPoint(ctx, item);
          break;
        case 'Vector':
          drawArrow(ctx, item);
          break;
        default:
          console.warn('MathGrid type not found');
          break;
      }
    }

    // drawVectors(ctx, [
    //   [-2, -1, "blue"],
    //   [4, 1, "red"],
    //   [8, 2, "green"],
    // ]);

    // add
    // drawArrow(ctx, [0, 0], [8, 2, "yellow"]);
    // drawArrow(ctx, [8, 2], [9, 3, "white"]);
    // drawArrow(ctx, [0, 0], [9, 3, "purple"]);

    // scalar mult
    // a=[2,1], x=3, a * x = [6, 3]
    // drawArrow(ctx, [0, 0], [6, 3, "white"]);
    // drawArrow(ctx, [0, 0], [2, 1, "red"]);

    // dot product - circle
    // ctx.beginPath();
    // ctx.arc(0, 0, 4 * CELL_SIZE, 0, 2 * Math.PI);
    // ctx.lineWidth = 4;
    // ctx.strokeStyle = "grey";
    // ctx.stroke();
    // ctx.closePath();

    // drawPoint(ctx, [2, 3]);

    // WIP trig animation
    // drawArrow(ctx, [0, 0], [4 * Math.cos(frame), 0, "red"]);
    // drawArrow(ctx, [0, 0], [4 * Math.cos(frame), 4 * Math.sin(frame), "red"]);
    // drawArrow(ctx, [0, 0], [0, 4 * Math.sin(frame), "red"]);

    // restore
    ctx.restore();

    frame += 0.01;

    // window.requestAnimationFrame(() => render(ctx, width, height, frame));
  }

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    // update CELL_SIZE to window
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    // canvas.width = width;
    // canvas.height = height;

    let width = canvas.width;
    let height = canvas.height;

    // ctx
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // const eventResize = () => {
      // width = canvas.width;
      // height = canvas.height;

      // width = window.innerWidth;
      // height = window.innerHeight;
      // canvas.width = width;
      // canvas.height = height;
      // render(ctx, width, height);
    // }

    // window.addEventListener("resize", eventResize);

    window.requestAnimationFrame(() => render(ctx, width, height, refFrame.current));

    return () => {
      // window.removeEventListener('resize', eventResize);
    }
  }, [refCanvas]);

  return (
    <canvas ref={refCanvas} width={660} height={400} style={{ marginBottom: 25 }} />
  );
}
