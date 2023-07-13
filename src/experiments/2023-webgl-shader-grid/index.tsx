import { useEffect, useRef, useState } from 'react';

import { createProgramFromSources } from '@/utils/webgl';
import { Position } from '@/types';
import styles from './styles.module.css';

// @ts-ignore
import vertShader from './vert.glsl';
// @ts-ignore
import fragShader from './frag.glsl';

export default function WebGLShader() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

    // set height & width of canvas
    canvas.width = size.width;
    canvas.height = size.height;

    if (!gl) return;

    /* ===== Program ===== */
    const program = createProgramFromSources(gl, vertShader, fragShader);

    /* ===== Vertices ===== */
    const corners = {
      'top-left': [1, -1, 0],
      'top-right': [1, 1, 0],
      'bottom-left': [-1, -1, 0],
      'bottom-right': [-1, 1, 0],
    };

    // prettier-ignore
    const vertexData = [
    ...corners['top-right'],
    ...corners['bottom-right'],
    ...corners['bottom-left'],
    ...corners['top-left'],
    ...corners['top-right'],
    ...corners['bottom-left'],
  ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW,
    );
    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // useProgram must come before uniforms!
    gl.useProgram(program);

    /* ===== Uniforms - u_resolution ===== */
    const uRes = gl.getUniformLocation(program, `u_resolution`);
    // console.log(canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);

    /* ===== Uniforms - u_time ===== */
    const uTime = gl.getUniformLocation(program, 'u_time');
    let time = 1.0;
    gl.uniform1f(uTime, time);

    /* ===== Uniforms - u_mouse ===== */
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    let mouse = 1.0;
    gl.uniform1f(uMouse, mouse);

    let mousePos: Position = { x: 0, y: 0 };

    const handleMouseMove = (evt: MouseEvent) => {
      mousePos.x = evt.clientX || evt.pageX;
      mousePos.y = evt.clientY || evt.pageY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frame: number;
    /* ===== Animate LOOP ===== */
    const loop = () => {
      if (!gl) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      // update time
      time += 0.01;
      gl.uniform1f(uTime, time);

      // gl.uniform2f(uMouse, mousePos.x, mousePos.y);
      // NOTE - this will only work for full screen canvas
      gl.uniform2f(uMouse, mousePos.x / size.width, mousePos.y / size.height);

      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, size]);

  return (
    <section className={styles.shader}>
      {size.width && size.height && (
        <canvas ref={canvasRef} width={size.width} height={size.height} />
      )}
    </section>
  );
}
