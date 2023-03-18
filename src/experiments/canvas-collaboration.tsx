import { useEffect } from 'react';

function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  function render(ctx: CanvasRenderingContext2D) {
    window.requestAnimationFrame(() => render(ctx));
  }
  render(ctx);
}

export default function Temp() {
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasAnimation(canvas, ctx);
  });

  return <canvas id="canvas" className="canvas" />;
}

