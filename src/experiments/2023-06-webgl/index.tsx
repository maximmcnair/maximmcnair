import useWebGL from '@/hooks/useWebGL';
import { useEffect } from 'react';
import {
  createShader,
  createProgramFromSources,
  resizeCanvasToDisplaySize,
} from './webgl';

const vertShader = `#version 300 es
precision highp float;

uniform float time;

in vec2 position;

void main(void){
    vec2 rotated = vec2
    (
        position.x * cos(time) - position.y * sin(time),
        position.x * sin(time) + position.y * cos(time)
    );
    gl_Position = vec4(rotated, 0.0, 1.0);

    // gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragShader = `#version 300 es
precision highp float;

out vec4 frag_color;

void main(void){
  // frag_color = vec4(1.0, 1.0, 1.0, 1.0);
  frag_color = vec4(1.0, 0.5, 0.25, 1.0);
}`;

async function loadImage(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = '/photo-test1.jpg';
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject();
    };
  });
}

function render(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  image: Image,
) {
  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vs = createShader(gl, gl.VERTEX_SHADER, vertShader);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragShader);
  if (!vs || !fs) throw Error('Failed to create WebGLShaders');

  // setup program
  const program = gl.createProgram();
  if (!program) throw Error('Failed to create program');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // vertices
  const h = Math.sqrt(0.75);

  // prettier-ignore
  const vertices = [
     -0.5,     -h / 3,
     -0.0, 2 * -h / 3,
     0.5,      -h / 3,
  ];
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const time = gl.getUniformLocation(program, "time");

  function draw(timestamp: number) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.uniform1f(time, timestamp / 1000);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);
}

export default function WebGL() {
  const [canvas] = useWebGL({
    onInit: async (
      gl: WebGL2RenderingContext | null,
      canvas: HTMLCanvasElement,
    ) => {
      if (!gl) return;
      const image = await loadImage();
      render(gl, canvas, image);
    },
  });

  return <>{canvas}</>;
}
