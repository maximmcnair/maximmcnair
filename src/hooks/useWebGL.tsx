import React, { useEffect, useRef, useState } from 'react';

interface UseWebGLOptions {
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
      const canvas = canvasRef.current as HTMLCanvasElement;
      const GL = canvas.getContext('webgl2');

      // set height&width of canvas
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
      canvas.width = 300;
      canvas.height = 150;

      options.onInit(GL, canvas);
    }

    return () => options.onExit && options.onExit();
  }, [canvasRef]);

  return [
    <canvas ref={canvasRef} />,
  ];
};

export default useWebGL;
