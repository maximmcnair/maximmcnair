import { Vec4 } from './types';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject();
    };
  });
}

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const clamp = (a: number, min: number = 0, max: number = 1) =>
  Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
  lerp(x2, y2, invlerp(x1, y1, a));

export function mapLinear(
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number,
): number {
  return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export function createAndSetupTexture(
  gl: WebGL2RenderingContext,
): WebGLTexture {
  var texture = gl.createTexture();
  if (!texture) throw Error('Texture setup failed');
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

// export function createPingpong(gl: WebGL2RenderingContext, image: HTMLImageElement, amount: number) {
//   const textures = [];
//   const framebuffers = [];
//   for (var ii = 0; ii < 2; ++ii) {
//     var texture = createAndSetupTexture(gl);
//     textures.push(texture);
//     // make the texture the same size as the image
//     gl.texImage2D(
//       gl.TEXTURE_2D,
//       0,
//       gl.RGBA,
//       image.width,
//       image.height,
//       0,
//       gl.RGBA,
//       gl.UNSIGNED_BYTE,
//       null,
//     );
//
//     // Create a framebuffer
//     const fbo = gl.createFramebuffer();
//     framebuffers.push(fbo);
//     gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//
//     gl.framebufferTexture2D(
//       gl.FRAMEBUFFER,
//       gl.COLOR_ATTACHMENT0,
//       gl.TEXTURE_2D,
//       texture,
//       0,
//     );
//   }
//
//   return { textures, framebuffers };
// }

export function HEXtoRGBAVec4(hexCode: string, opacity: number = 1): Vec4 {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = range(0, 250, 0, 1, parseInt(hex.substring(0, 2), 16));
  const g = range(0, 250, 0, 1, parseInt(hex.substring(2, 4), 16));
  const b = range(0, 250, 0, 1, parseInt(hex.substring(4, 6), 16));

  return [r, g, b, opacity];
}
