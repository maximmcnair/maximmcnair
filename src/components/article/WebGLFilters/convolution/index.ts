import { createProgramFromSources } from '$/utils/webgl';
import { Config } from '../types';

// @ts-ignore
import vertShader from './vert.glsl';
// @ts-ignore
import fragShader from './frag.glsl';

function convolutionSetup(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
) {
  /* ===== Program ===== */
  const convolutionProgram = createProgramFromSources(
    gl,
    vertShader,
    fragShader,
  );

  return {
    convolutionProgram,
  };
}

function convolutionDraw(
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

  // const uPhoto = gl.getUniformLocation(program, 'textureID');
  // gl.uniform1i(uPhoto, 0);

  // function computeKernelWeight(kernel: number[]) {
  //   var weight = kernel.reduce(function (prev, curr) {
  //     return prev + curr;
  //   });
  //   return weight <= 0 ? 1 : weight;
  // }
  //
  // var kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
  // var kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
  // // prettier-ignore
  // const gaussianBlur = [
  //   0.045, 0.122, 0.045,
  //   0.122, 0.332, 0.122,
  //   0.045, 0.122, 0.045,
  //   
  //   // 0, 0, 0,
  //   // 0, 1, 0,
  //   // 0, 0, 0,
  //
  //    // -2, -1,  0,
  //    // -1,  1,  1,
  //    //  0,  1,  2,
  // ];
  // gl.uniform1fv(kernelLocation, gaussianBlur);
  // gl.uniform1f(kernelWeightLocation, computeKernelWeight(gaussianBlur));

  return {
    uRes,
  };
}

export { convolutionSetup, convolutionDraw };
