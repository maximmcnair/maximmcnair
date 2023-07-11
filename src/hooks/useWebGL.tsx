import React, { useEffect, useRef, useState } from 'react';

interface UseWebGLOptions {
  width: number;
  height: number;
  onInit: (
    GL: WebGL2RenderingContext | null,
    canvas: HTMLCanvasElement,
  ) => void;
  onExit?: () => void;
}

const useWebGL = (options: UseWebGLOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (options.onInit) {
      // setSize({ width: window.innerWidth, height: window.innerHeight });
      const canvas = canvasRef.current as HTMLCanvasElement;
      // const GL = canvas.getContext('webgl2');
      const GL = canvas.getContext('webgl2', {preserveDrawingBuffer: true});

      // set height & width of canvas
      canvas.width = options.width;
      canvas.height = options.height;
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;

      options.onInit(GL, canvas);
    }

    return () => options.onExit && options.onExit();
  }, [canvasRef]);

  // return [<canvas ref={canvasRef} width={size.width} height={size.height}/>];
  return [
    <canvas ref={canvasRef} width={options.width} height={options.height}/>
  ];
};

export default useWebGL;
