import {
  createProgramFromSources,
  loadTexture,
} from '@/utils/webgl';
import { Config } from '../types'
import vertShader from './vert.glsl';
import fragShader from './frag.glsl';

function filtersSetup(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
){
  /* ===== Program ===== */
  const filtersProgram = createProgramFromSources(gl, vertShader, fragShader);

  return {
    filtersProgram,
  };
}

function filtersDraw(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
  program: WebGLProgram,
){
  gl.useProgram(program);

  /* ===== Uniforms ===== */
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  if (!uRes) throw Error('u_res location not created');
  gl.uniform2f(uRes, canvas.width, canvas.height);
  // const uPhoto = gl.getUniformLocation(program, 'textureID');
  // gl.uniform1i(uPhoto, 0);
  
  return {
    uRes
  }
}

export {
  filtersSetup,
  filtersDraw,
}
