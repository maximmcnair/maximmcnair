import { mat4, vec4 } from 'gl-matrix';

import {
  createProgramFromSources,
  loadTexture,
} from '$/utils/webgl';

import { Config } from '../types'
// @ts-ignore
import vertShader from './vert.glsl';
// @ts-ignore
import fragShader from './frag.glsl';

function filtersSetup(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
) {
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
) {
  gl.useProgram(program);

  /* ===== Uniforms ===== */
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  if (!uRes) throw Error('u_res location not created');
  gl.uniform2f(uRes, canvas.width, canvas.height);
  // const uPhoto = gl.getUniformLocation(program, 'textureID');
  // gl.uniform1i(uPhoto, 0);

  /* ===== Filter - Brightness ===== */
  const uBrightnessMatrix = gl.getUniformLocation(
    program,
    'u_brightnessMatrix',
  );
  const brightnessMatrix = mat4.create();
  gl.uniformMatrix4fv(uBrightnessMatrix, false, brightnessMatrix);
  const uBrightnessOffset = gl.getUniformLocation(
    program,
    'u_brightnessOffset',
  );
  const brightnessOffset = vec4.create();

  function updateBrightness(brightness: number) {
    if (!gl) return;
    // brightness between -1 and 1
    gl.uniformMatrix4fv(uBrightnessMatrix, false, brightnessMatrix);
    vec4.set(brightnessOffset, brightness, brightness, brightness, 0);
    gl.uniform4f(
      uBrightnessOffset,
      brightnessOffset[0],
      brightnessOffset[1],
      brightnessOffset[2],
      brightnessOffset[3],
    );
  }
  updateBrightness(config.Brightness);

  /* ===== Filter - Contrast ===== */
  const uContrastMatrix = gl.getUniformLocation(program, 'u_contrastMatrix');
  const contrastMatrix = mat4.create();
  gl.uniformMatrix4fv(uContrastMatrix, false, contrastMatrix);
  const uContrastOffset = gl.getUniformLocation(program, 'u_contrastOffset');
  const contrastOffset = vec4.create();
  gl.uniform4f(
    uContrastOffset,
    contrastOffset[0],
    contrastOffset[1],
    contrastOffset[2],
    contrastOffset[3],
  );
  function updateContrast(contrast: number) {
    if (!gl) return;
    // contrast between -1 and 1
    const c = 1 + contrast;
    const o = 0.5 * (1 - c);
    // prettier-ignore
    mat4.transpose(contrastMatrix, [
      c, 0, 0, 0,
      0, c, 0, 0,
      0, 0, c, 0,
      0, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(uContrastMatrix, false, contrastMatrix);
    vec4.set(contrastOffset, o, o, o, 0);
    gl.uniform4f(uContrastOffset, o, o, o, 0);
  }
  updateContrast(config.Contrast);

  /* ===== Filter - Exposure ===== */
  const uExposureMatrix = gl.getUniformLocation(program, 'u_exposureMatrix');
  const exposureMatrix = mat4.create();
  gl.uniformMatrix4fv(uExposureMatrix, false, exposureMatrix);
  function updateExposure(exposure: number) {
    if (!gl) return;
    // Exposure between -1 and 1
    const e = 1 + exposure;
    // prettier-ignore
    mat4.transpose(exposureMatrix, [
      e, 0, 0, 0,
      0, e, 0, 0,
      0, 0, e, 0,
      0, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(uExposureMatrix, false, exposureMatrix);
  }
  updateExposure(config.Exposure);

  /* ===== Filter - Saturation ===== */
  const uSaturationMatrix = gl.getUniformLocation(
    program,
    'u_saturationMatrix',
  );
  const saturationMatrix = mat4.create();
  gl.uniformMatrix4fv(uSaturationMatrix, false, saturationMatrix);
  function updateSaturation(saturation: number) {
    if (!gl) return;
    // Saturation between -1 and 1
    const s = 1 + saturation;

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const lr = 0.2126;
    const lg = 0.7152;
    const lb = 0.0722;

    const sr = (1 - s) * lr;
    const sg = (1 - s) * lg;
    const sb = (1 - s) * lb;

    // prettier-ignore
    mat4.transpose(saturationMatrix, [
      sr + s, sg, sb, 0,
      sr, sg + s, sb, 0,
      sr, sg, sb + s, 0,
      0, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(uSaturationMatrix, false, saturationMatrix);
  }
  updateSaturation(config.Saturation);

  /* ===== Filter - Hue ===== */
  const uHue = gl.getUniformLocation(program, 'u_hue');
  gl.uniform1f(uHue, config.Hue);
  function updateHue(hue: number) {
    if (!gl) return;
    gl.uniform1f(uHue, hue);
  }
  updateHue(config.Hue);

  /* ===== Effects - Grain ===== */
  const uGrainAmount = gl.getUniformLocation(program, 'u_grain_amount');
  gl.uniform1f(uGrainAmount, config.Grain);

  /* ===== Effects - Pixelate ===== */
  const uPixelateAmount = gl.getUniformLocation(program, 'u_pixelate');
  gl.uniform1f(uPixelateAmount, config.Pixelate);

  /* ===== Effects - Vignette ===== */
  const uVignetteAmount = gl.getUniformLocation(program, 'u_vignette');
  gl.uniform1f(uVignetteAmount, config.Vignette);

  /* ===== Effects - Duotone ===== */
  const uDuotoneAmount = gl.getUniformLocation(program, 'u_duotone');
  gl.uniform1f(uDuotoneAmount, config.Duotone);
  const uDuotoneHigh = gl.getUniformLocation(program, "u_duotone_hi");
  gl.uniform4fv(uDuotoneHigh, config.DuotoneHigh);
  const uDuotoneLow = gl.getUniformLocation(program, "u_duotone_lo");
  gl.uniform4fv(uDuotoneLow, config.DuotoneLow);

  return {
    uRes,
    uDuotoneHigh,
    uDuotoneLow,
  }
}

export {
  filtersSetup,
  filtersDraw,
}
