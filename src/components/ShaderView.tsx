import { useEffect, useRef, useState } from 'react';

import { createProgramFromSources, loadTexture } from '@/utils/webgl';
import { Position } from '@/types';

// @ts-ignore
import vertDefault from './ShaderDefaultVert.glsl';
// @ts-ignore
import fragDefault from './ShaderDefaultFrag.glsl';

interface Props {
  vert?: string;
  frag?: string;
  title?: string;
  className?: string;
  renderTitle?: boolean;
  height?: number;
  width?: number;
  imgSrc?: string;
  fx?: number;
  fy?: number;
  fz?: number;
}

export default function ShaderView({
  frag,
  vert,
  title,
  className,
  renderTitle = false,
  height,
  width,
  imgSrc,
  fx = 1,
  fy = 1,
  fz = 1,
}: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<WebGLProgram>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function handleResize() {
      if (!containerRef.current) return;
      // Use height/width props
      if (height && width) {
        setSize({
          width,
          height,
        });
      } else {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({
          width: offsetWidth,
          height: offsetHeight,
        });
        // const canvas = canvasRef.current as HTMLCanvasElement;
        // if (!canvas) return;
        // canvas.width = offsetWidth;
        // canvas.height = offsetHeight;
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl || !imgSrc) return;
    loadTexture(gl, imgSrc).then(({ texture, aspectRatio }) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    });
  }, [imgSrc]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl || !programRef.current) return;
    const uFx = gl.getUniformLocation(programRef.current, 'u_fx');
    gl.uniform1f(uFx, fx);
    const uFy = gl.getUniformLocation(programRef.current, 'u_fy');
    gl.uniform1f(uFy, fy);
    const uFz = gl.getUniformLocation(programRef.current, 'u_fz');
    gl.uniform1f(uFz, fz);
  }, [fx, fy, fz]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

    // set height & width of canvas
    canvas.width = size.width;
    canvas.height = size.height;

    if (!gl) return;

    /* ===== Program ===== */
    const program = createProgramFromSources(
      gl,
      vert || vertDefault,
      frag || fragDefault,
    );
    // @ts-ignore
    programRef.current = program;

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

    /* ===== Uniforms - u_image ===== */
    const uImage = gl.getUniformLocation(program, 'u_image');
    gl.uniform1i(uImage, 0);
    if (imgSrc) {
      loadTexture(gl, imgSrc).then(({ texture, aspectRatio }) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      });
    }

    /* ===== Uniforms - generic ===== */
    const uFx = gl.getUniformLocation(program, 'u_fx');
    gl.uniform1f(uFx, fx);
    const uFy = gl.getUniformLocation(program, 'u_fy');
    gl.uniform1f(uFy, fy);
    const uFz = gl.getUniformLocation(program, 'u_fz');
    gl.uniform1f(uFz, fz);

    /* ===== Animate LOOP ===== */
    let frame: number;
    const loop = () => {
      if (!gl) return;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      // update u_resolution
      gl.uniform2f(uRes, canvas.width, canvas.height);

      // update u_time
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
  }, [canvasRef, size, frag, vert]);

  return (
    <section className={className} ref={containerRef}>
      {renderTitle ? <span>{title}</span> : null}
      {!!(size.width && size.height) && (
        <canvas ref={canvasRef} width={size.width} height={size.height} />
      )}
    </section>
  );
}
