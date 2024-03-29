import { useEffect, useRef, useState } from 'react';
import { mat4, vec4 } from 'gl-matrix';

import { createProgramFromSources, loadTexture } from '@/utils/webgl';
import styles from './filters-effects.module.css';

// @ts-ignore
import vertShader from './vert.glsl';
// @ts-ignore
import fragShader from './frag.glsl';

async function loadImage(src: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = function () {
      resolve(image.width / image.height);
    };
    image.onerror = function () {
      reject();
    };
  });
}

type Vec3 = { x: number; y: number; z: number };

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min: number = 0, max: number = 1) =>
  Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
  lerp(x2, y2, invlerp(x1, y1, a));

interface Position {
  x: number;
  y: number;
}

interface Config {
  // View
  FOVAngle: number;
  FOVRadius: number;
  'photo-x-top': number;
  'photo-x-bottom': number;
  'photo-y-left': number;
  'photo-y-right': number;
  model: Vec3;
  camera: Vec3;
  zoom: number;
  // filters
  Brightness: number;
  Contrast: number;
  Exposure: number;
  Saturation: number;
  Hue: number;
  // filters
  Grain: number;
  Pixelate: number;
  Vignette: number;
  Duotone: number;
}

// async function setup(
function setup(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  config: Config,
) {
  /* ===== Program ===== */
  const program = createProgramFromSources(gl, vertShader, fragShader);

  /* ===== Vertices ===== */
  function buildPhotoVertexData(
    xTop: number,
    xBottom: number,
    yLeft: number,
    yRight: number,
  ) {
    const topLeft = [xTop, yLeft, 0];
    const topRight = [xTop, yRight, 0];
    const bottomLeft = [xBottom, yLeft, 0];
    const bottomRight = [xBottom, yRight, 0];

    return [
      ...topRight,
      ...bottomRight,
      ...bottomLeft,

      ...topLeft,
      ...topRight,
      ...bottomLeft,
    ];
  }

  // prettier-ignore
  let vertexData = buildPhotoVertexData(
    config['photo-x-top'],
    config['photo-x-bottom'],
    config['photo-y-left'],
    config['photo-y-right'],
  );
  // prettier-ignore
  const uvData = [
    // -90%
    // 1, 1, // top right
    // 1, 0, // bottom right
    // 0, 0, // bottom left
    // 0, 1, // top left
    // 1, 1, // top right
    // 0, 0, // bottom left
    // 0%
    1, 0, // top right -> bottom right 
    0, 0, // bottom right -> bottom left
    0, 1, // bottom left -> top left
    1, 1, // top left -> top right 
    1, 0, // top right -> bottom right
    0, 1, // bottom left -> top left
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  function updatePhotoVertices(gl: WebGL2RenderingContext, config: Config) {
    vertexData = buildPhotoVertexData(
      config['photo-x-top'],
      config['photo-x-bottom'],
      config['photo-y-left'],
      config['photo-y-right'],
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  }

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);
  const uvLocation = gl.getAttribLocation(program, `uv`);
  gl.enableVertexAttribArray(uvLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

  /* ===== Photo Texture ===== */
  loadTexture(gl, '/flowers.jpg').then(({ texture, aspectRatio }) => {
    setTexture(gl, texture, aspectRatio);
    config.camera = { x: 0, y: 0, z: 0.6 };
    // zoom = 1;
  });

  function setTexture(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    aspectRatio: number,
  ) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // set correct aspect ratio
    config['photo-x-top'] = aspectRatio;
    config['photo-x-bottom'] = -1;
    config['photo-y-right'] = 1;
    config['photo-y-left'] = -1;
    // TODO update model x & y
    const modelXOffset = Math.abs(1 - aspectRatio);
    // console.log(aspectRatio, modelXOffset);
    config.model.x = -(modelXOffset / 2);
    updatePhotoVertices(gl, config);
  }

  // useProgram must come before uniforms!
  gl.useProgram(program);

  /* ===== Uniforms ===== */
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  gl.uniform2f(uRes, canvas.width, canvas.height);
  const uPhoto = gl.getUniformLocation(program, 'textureID');
  gl.uniform1i(uPhoto, 0);

  /* ===== Camera ===== */
  const uMatrix = gl.getUniformLocation(program, `matrix`);
  const mvMatrix = mat4.create();
  const mvpMatrix = mat4.create();
  gl.uniformMatrix4fv(uMatrix, false, mvpMatrix);

  /* ===== Filters ===== */

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
  gl.uniform4f(
    uBrightnessOffset,
    brightnessOffset[0],
    brightnessOffset[1],
    brightnessOffset[2],
    brightnessOffset[3],
  );
  function updateBrightness(brightness: number) {
    if (!gl) return;
    // brightness between -1 and 1
    // gl.uniformMatrix4fv(uBrightnessMatrix, false, brightnessMatrix);
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
      sr + s, sg    , sb    , 0,
      sr    , sg + s, sb    , 0,
      sr    , sg    , sb + s, 0,
      0     , 0     , 0     , 1,
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

  // end of render function
  return {
    uMatrix,
    vertexData,
  };
}

const filters = [
  {
    name: 'Brightness',
    key: 'Brightness',
    min: -1,
    max: 1,
    step: 0.01,
  },
  // {
  //   name: 'Zoom',
  //   key: 'zoom',
  //   min: 0.1,
  //   max: 0.89,
  //   step: 0.01,
  // },
  {
    name: 'Contrast',
    key: 'Contrast',
    min: -1,
    max: 1,
    step: 0.01,
  },
  {
    name: 'Exposure',
    key: 'Exposure',
    min: -1,
    max: 1,
    step: 0.01,
  },
  {
    name: 'Saturation',
    key: 'Saturation',
    min: -1,
    max: 1,
    step: 0.01,
  },
  {
    name: 'Grain',
    key: 'Grain',
    min: 0,
    max: 0.2,
    step: 0.01,
  },
  {
    name: 'Pixelate',
    key: 'Pixelate',
    min: 0.001,
    max: 400,
    step: 0.001,
  },
  {
    name: 'Vignette',
    key: 'Vignette',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'Duotone',
    key: 'Duotone',
    min: 0,
    max: 1,
    step: 0.01,
    disabled: true,
  },
  // Disabled
  {
    name: 'Hue',
    key: 'Hue',
    min: 0,
    max: 1,
    step: 0.01,
    disabled: true,
  },
];

interface CanvasProps {
  size: { width: number; height: number };
  config: Config;
  aspectRatio: number;
}

function Canvas({ size, config, aspectRatio }: CanvasProps) {
  // function Canvas({ config, aspectRatio }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  //
  // useEffect(() => {
  //   const handleMouseMove = (evt: MouseEvent) => {
  //     setMousePos({
  //       x: evt.clientX || evt.pageX,
  //       y: evt.clientY || evt.pageY,
  //     });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);
  //
  // console.log(mousePos);

  // const [size, setSize] = useState({ width: 0, height: 0 });
  // useEffect(() => {
  //   function onWindowResize() {
  //     console.log('onWindowResize');
  //     setSize({ width: window.innerWidth, height: window.innerHeight });
  //     console.log({ width: window.innerWidth, height: window.innerHeight });
  //     const ctx = canvasRef.current?.getContext('webgl2');
  //     if (ctx) {
  //       ctx.canvas.width = window.innerWidth;
  //       ctx.canvas.height = window.innerHeight;
  //       console.log('*', size);
  //     }
  //   }
  //   onWindowResize();
  //   window.addEventListener('resize', onWindowResize);
  //   return () => window.removeEventListener('resize', onWindowResize);
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

    // set height & width of canvas
    canvas.width = size.width;
    canvas.height = size.height;

    if (!gl) return;

    const { uMatrix, vertexData } = setup(gl, canvas, config);

    let mousePos: Position = { x: 0, y: 0 };

    const handleMouseMove = (evt: MouseEvent) => {
        // mousePos.x = evt.clientX || evt.pageX;
        // mousePos.y = evt.clientY || evt.pageY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // console.log(config.zoom);
    function mapLinear(
      x: number,
      a1: number,
      a2: number,
      b1: number,
      b2: number,
    ) {
      return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
    }

    let frame: number;
    /* ===== Animate LOOP ===== */
    const loop = () => {
      if (!gl) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      // gl.clearColor(0, 0, 0, 1);
      // Matrix
      const modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, [
        config.model.x,
        config.model.y,
        config.model.z,
      ]);

      const xRotateRad = mapLinear(mousePos.y, 0, window.innerHeight, 0, 0.05);
      mat4.rotateX(modelMatrix, modelMatrix, xRotateRad);
      const yRotateRad = mapLinear(mousePos.x, 0, window.innerWidth, 0, 0.05);
      mat4.rotateY(modelMatrix, modelMatrix, yRotateRad);
      const cameraMatrix = mat4.create();
      mat4.translate(cameraMatrix, cameraMatrix, [
        config.camera.x,
        config.camera.y,
        config.camera.z,
      ]);
      const projectionMatrix = mat4.create();
      mat4.perspective(
        projectionMatrix,
        // ((config.FOVAngle * Math.PI) / config.FOVRadius) * (1 - config.zoom),
        (config.FOVAngle * Math.PI) / config.FOVRadius,
        //canvas.width / canvas.height, // aspect ratio
        gl.canvas.width / gl.canvas.height, // aspect ratio
        1e-3, // near cull
        Infinity, // far cull
      );
      // mat4.ortho(
      //   projectionMatrix, // out
      //   -1.0 * zoom, // left
      //   1.0 * zoom, // right
      //   -1.0 * zoom, // bottom
      //   1.0 * zoom, // top
      //   0.1, // near cull
      //   100, // far cull
      // );
      const mvMatrix = mat4.create();
      const mvpMatrix = mat4.create();
      mat4.invert(cameraMatrix, cameraMatrix);
      mat4.multiply(mvMatrix, cameraMatrix, modelMatrix);
      mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
      gl.uniformMatrix4fv(uMatrix, false, mvpMatrix);
      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, config, aspectRatio, size]);

  return <canvas ref={canvasRef} width={size.width} height={size.height} />;
}

export default function WebGL() {
  const [config, setConfig] = useState<Config>({
    // View
    FOVAngle: 75,
    FOVRadius: 100,
    model: { x: 0, y: 0, z: 0 },
    camera: { x: 0, y: 0, z: 0.6 },

    // photo size
    'photo-x-top': 1,
    'photo-x-bottom': -1,
    'photo-y-right': 1,
    'photo-y-left': -1,

    zoom: 1.0,

    // filter
    Brightness: 0,
    Contrast: 0,
    Exposure: 0,
    Saturation: 0,
    Hue: 0,

    // effects
    Grain: 0,
    Pixelate: 0.001,
    Vignette: 0,
    Duotone: 0,
  });

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    async function loadImageAndSetSize() {
      const aspectRatio = await loadImage('/flowers.jpg');
      setAspectRatio(aspectRatio);
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    loadImageAndSetSize();
  }, []);

  return (
    <section>
      <div className={styles.wrapper}>
        {size.width && size.height && (
          <Canvas size={size} config={config} aspectRatio={aspectRatio} />
        )}
      </div>
      <section className={styles.filters}>
        {filters.map(f => (
          <label
            className={styles.filter}
            data-disabled={f.disabled}
            key={f.name}
          >
            <span>{f.name}</span>
            <input
              className={styles.filterinput}
              type='range'
              min={f.min}
              max={f.max}
              step={f.step}
              // @ts-ignore
              value={config[f.key]}
              onChange={evt =>
                setConfig(c => ({
                  ...c,
                  [f.key]: parseFloat(evt.target.value),
                }))
              }
            />
          </label>
        ))}
      </section>
    </section>
  );
}
