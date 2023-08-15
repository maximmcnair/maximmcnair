import { useEffect, useRef, useState } from 'react';

import { createProgramFromSources, loadTexture, clamp, mapLinear } from '@/utils/webgl';
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
  style?: React.CSSProperties;
  renderTitle?: boolean;
  height?: number;
  width?: number;
  imgSrc?: string;
  fx?: number;
  fy?: number;
  fz?: number;
  fw?: number;
  mouse?: boolean;
}

export default function ShaderView({
  frag,
  vert,
  title,
  className,
  style,
  renderTitle = false,
  height,
  width,
  imgSrc,
  fx = 1,
  fy = 1,
  fz = 1,
  fw = 1,
  mouse = false,
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
        const aspectRatio = height / width;
        const minWidth = Math.min(width, window.innerWidth);
        setSize({
          width: minWidth,
          height: aspectRatio * minWidth,
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
  }, [width, height]);

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
    const uFw = gl.getUniformLocation(programRef.current, 'u_fw');
    gl.uniform1f(uFw, fw);
  }, [fx, fy, fz, fw]);

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
    const uFw = gl.getUniformLocation(program, 'u_fw');
    gl.uniform1f(uFw, fw);

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

      if (canvasRef.current) {
        const { left, top } = canvasRef.current.getBoundingClientRect();
        gl.uniform2f(
          uMouse,
          (mousePos.x - left) / size.width,
          (canvas.height - (mousePos.y - top)) / size.height,
        );
      }

      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, size, frag, vert]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (evt: MouseEvent) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const { left, top } = canvasRef.current.getBoundingClientRect();
        const x = evt.clientX || evt.pageX;
        const y = evt.clientY || evt.pageY;
        setMousePos({
          x: clamp((x - left) / size.width, 0, 1),
          y: clamp((canvas.height - (y - top)) / size.height, 0, 1),
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasRef, size]);

  return (
    <section className={className} ref={containerRef} style={style}>
      <div
        style={{
          position: 'relative',
          width: size.width,
          height: size.height,
        }}
      >
        {renderTitle ? <span>{title}</span> : null}
        {mouse ? (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${mapLinear(mousePos.x, 0, 1, 0, 100)}%`,
              width: '50px',
              height: '50px',
              transform: 'translate3d(-25px, -10px, 0)',
              backgroundColor: 'var(--color-black-off)',
              borderRadius: '50%',
              border: '1px solid var(--color-black-off)',
              padding: '10px',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>
        ) : null}
        {!!(size.width && size.height) && (
          <canvas ref={canvasRef} width={size.width} height={size.height} />
        )}
      </div>
    </section>
  );
}
