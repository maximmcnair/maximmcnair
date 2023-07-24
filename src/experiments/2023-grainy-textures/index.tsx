import { useEffect, useRef, useState } from 'react';
import { mat4 } from 'gl-matrix';

import { Config } from './types';
import { loadImage, createAndSetupTexture, mapLinear } from './utils';

import { filtersSetup, filtersDraw } from './filters/';
import { convolutionSetup, convolutionDraw } from './convolution/';
import { cameraSetup, cameraDraw } from './camera/';

interface CanvasProps {
  size: { width: number; height: number };
  config: Config;
  image: HTMLImageElement;
}

function Canvas({ size, config, image }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

    // set height & width of canvas
    canvas.width = size.width;
    canvas.height = size.height;

    if (!gl) return;

    /* ===== Vertices ===== */
    const corners = {
      'top-left': [1, -1, 0],
      'top-right': [1, 1, 0],
      'bottom-left': [-1, -1, 0],
      'bottom-right': [-1, 1, 0],
    };
    const vertexData = [
      ...corners['top-right'],
      ...corners['bottom-right'],
      ...corners['bottom-left'],

      ...corners['top-left'],
      ...corners['top-right'],
      ...corners['bottom-left'],
    ];

    function bindVertices(
      gl: WebGL2RenderingContext,
      canvas: HTMLCanvasElement,
      config: Config,
      program: WebGLProgram,
    ) {
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
    }

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    /* ===== Program ===== */
    const { filtersProgram } = filtersSetup(gl, canvas, config);
    bindVertices(gl, canvas, config, filtersProgram);
    const filterProps = filtersDraw(gl, canvas, config, filtersProgram);

    const { convolutionProgram } = convolutionSetup(gl, canvas, config);
    bindVertices(gl, canvas, config, convolutionProgram);
    const convolutionProps = convolutionDraw(
      gl,
      canvas,
      config,
      convolutionProgram,
    );

    const { cameraProgram } = cameraSetup(gl, canvas, config);
    // bindVertices(gl, canvas, config, cameraProgram);
    // NOTE cameraProgram has own vertices
    const cameraProps = cameraDraw(gl, canvas, config, cameraProgram);

    /* ===== Image Texture ===== */
    const imageTexture = createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    // TODO check this doesn't cause issues!!!
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    /* ===== Buffer Textures ===== */
    var textures: WebGLTexture[] = [];
    var framebuffers: WebGLFramebuffer[] = [];
    for (var ii = 0; ii < 2; ++ii) {
      var texture = createAndSetupTexture(gl);
      textures.push(texture);

      // make the texture the same size as the image
      var mipLevel = 0; // the largest mip
      var internalFormat = gl.RGBA; // format we want in the texture
      var border = 0; // must be 0
      var srcFormat = gl.RGBA; // format of data we are supplying
      var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
      var data = null; // no data = create a blank texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        mipLevel,
        internalFormat,
        image.width,
        image.height,
        border,
        srcFormat,
        srcType,
        data,
      );

      // Create a framebuffer
      var fbo = gl.createFramebuffer();
      if (!fbo) throw Error('Framebuffer creation failed');
      framebuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      // Attach a texture to it.
      var attachmentPoint = gl.COLOR_ATTACHMENT0;
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachmentPoint,
        gl.TEXTURE_2D,
        texture,
        mipLevel,
      );

      // set to null to avoid "GL_INVALID_OPERATION: Feedback loop formed between Framebuffer and active Texture."
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function setFramebuffer(
      gl: WebGL2RenderingContext,
      fbo: WebGLBuffer | null,
      uResolutionLocation: WebGLUniformLocation | null,
      width: number,
      height: number,
    ) {
      // make this the framebuffer we are rendering to.
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      // Tell the shader the resolution of the framebuffer.
      if (uResolutionLocation) gl.uniform2f(uResolutionLocation, width, height);
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, width, height);
    }

    let frame: number;
    let time = 0;
    /* ===== Animate LOOP ===== */
    const loop = () => {
      time += 0.01;
      if (!gl) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let writeBuffer = 0;
      let readBuffer = 1;

      /* ===== Image ===== */
      gl.useProgram(filtersProgram);

      // update time uniform
      gl.uniform1f(filterProps.uTime, time);

      console.log(time);

      const imageLocation = gl.getUniformLocation(filtersProgram, 'u_image');
      gl.uniform1i(imageLocation, 0);
      // start with the original image on unit 0
      gl.activeTexture(gl.TEXTURE0 + 0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      // Tell the shader to get the texture from texture unit 0
      // draw
      setFramebuffer(
        gl,
        framebuffers[writeBuffer],
        filterProps.uRes,
        image.width,
        image.height,
      );
      // drawWithKernel
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      // Bind output texture as input texture!!!!
      gl.bindTexture(gl.TEXTURE_2D, textures[writeBuffer]);

      /* ===== Convolution ===== */
      let iterations = config.Blur;

      if (iterations) {
        gl.useProgram(convolutionProgram);
        const conImageLocation = gl.getUniformLocation(
          convolutionProgram,
          'u_image',
        );

        for (var i = 0; i < iterations; i++) {
          // swap buffers
          const temp = writeBuffer;
          writeBuffer = readBuffer;
          readBuffer = temp;
          //
          gl.uniform1i(conImageLocation, 0);
          // draw
          setFramebuffer(
            gl,
            framebuffers[writeBuffer],
            convolutionProps.uRes,
            image.width,
            image.height,
          );
          // gl.bindTexture(gl.TEXTURE_2D, null);
          gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

          gl.bindTexture(gl.TEXTURE_2D, textures[writeBuffer]);
        }
      }

      /* ===== Render to canvas ===== */
      // setFramebuffer(
      //   gl,
      //   null,
      //   // If iterations is more than 0 then convolution run last
      //   iterations > 0 ? convolutionProps.uRes : filterProps.uRes,
      //   // filterProps.uRes,
      //   // convolutionProps.uRes,
      //   gl.canvas.width,
      //   gl.canvas.height,
      // );
      // gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      gl.useProgram(cameraProgram);
      setFramebuffer(gl, null, null, gl.canvas.width, gl.canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

      frame = requestAnimationFrame(loop);
    };

    loop();

    // window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(frame);
      // window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, config, size, image]);

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
    Blur: 40,
  });

  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    async function loadImageAndSetSize() {
      const image = await loadImage('/flowers.jpg');
      const aspectRatio = image.width / image.height;
      setImage(image);
      // set aspect ratio
      const modelXOffset = Math.abs(1 - aspectRatio);
      setConfig(c => ({
        ...c,
        'photo-x-top': aspectRatio,
        model: {
          ...c.model,
          x: -(modelXOffset / 2),
        },
      }));

      // set size
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    loadImageAndSetSize();
  }, []);

  return (
    <section>
      <div className="filtersmulti">
        {image && size.width && size.height && (
          <Canvas image={image} size={size} config={config} />
        )}
      </div>
    </section>
  );
}
