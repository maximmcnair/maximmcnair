export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const clamp = (a: number, min: number = 0, max: number = 1) =>
  Math.min(max, Math.max(min, a));
export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
export const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
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

export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string
): WebGLShader | undefined {
  const shader: WebGLShader | null = gl.createShader(type);
  if (!shader) return;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  // gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;
  // handle no shader
  // console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragShader: WebGLShader
): WebGLProgram | undefined {
  const program: WebGLProgram | null = gl.createProgram();
  if (!program) throw Error('Failed to create WebGLProgram');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;
  // handle no program
  // console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export function createProgramFromSources(
  gl: WebGL2RenderingContext,
  vertexShaderSrc: string,
  fragShaderSrc: string
): WebGLProgram {
  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
  if (!vertexShader || !fragShader) {
    throw Error('Failed to create WebGLShaders');
  }

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragShader);
  if (!program) throw Error('No program');
  return program;
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  // console.log('resizeCanvasToDisplaySize', dpr);

  const { width, height } = canvas.getBoundingClientRect();

  const displayWidth = Math.floor(width * dpr);
  const displayHeight = Math.floor(height * dpr);

  // console.log(canvas.width, displayWidth, canvas.height, displayHeight);
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

interface TexturePayload {
  texture: WebGLTexture;
  aspectRatio: number;
}

export async function loadTexture(
  gl: WebGL2RenderingContext,
  url: string
): Promise<TexturePayload> {
  return new Promise((resolve, reject) => {
    const texture = gl.createTexture();
    const image = new Image();
    image.onload = () => {
      if (!texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      resolve({ texture, aspectRatio: image.width / image.height });
    };
    image.src = url;
    // return texture;
  });
}

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
