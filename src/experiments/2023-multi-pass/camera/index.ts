import { createProgramFromSources } from '@/utils/webgl';
import { Config } from '../types';
import { mat4, vec4 } from 'gl-matrix';

// @ts-ignore
import vertShader from './vert.glsl';
// @ts-ignore
import fragShader from './frag.glsl';

function cameraSetup(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
) {
  /* ===== Program ===== */
  const cameraProgram = createProgramFromSources(
    gl,
    vertShader,
    fragShader,
  );

  return {
    cameraProgram,
  };
}

function cameraDraw(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
  program: WebGLProgram,
) {
  gl.useProgram(program);

  /* ===== Uniforms ===== */
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  if (!uRes) throw Error('u_res location not created');
  gl.uniform2f(uRes, canvas.width, canvas.height);

  /* ===== Camera ===== */
  const uMatrix = gl.getUniformLocation(program, `matrix`);
  const mvMatrix = mat4.create();
  const mvpMatrix = mat4.create();
  gl.uniformMatrix4fv(uMatrix, false, mvpMatrix);

  return {
    uRes,
    uMatrix,
  };
}

export { cameraSetup, cameraDraw };
