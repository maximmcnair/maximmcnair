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
  const cameraProgram = createProgramFromSources(gl, vertShader, fragShader);

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
  // const uRes = gl.getUniformLocation(program, 'u_resolution');
  // if (!uRes) throw Error('u_res location not created');
  // gl.uniform2f(uRes, canvas.width, canvas.height);

  /* ===== Vertices ===== */
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

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);
  const uvLocation = gl.getAttribLocation(program, `uv`);
  gl.enableVertexAttribArray(uvLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

  /* ===== Camera ===== */
  const uMatrix = gl.getUniformLocation(program, `matrix`);
  // const mvMatrix = mat4.create();
  // const mvpMatrix = mat4.create();
  // gl.uniformMatrix4fv(uMatrix, false, mvpMatrix);
  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [
    config.model.x,
    config.model.y,
    config.model.z,
  ]);
  // const xRotateRad = mapLinear(mousePos.y, 0, window.innerHeight, 0, 0.05);
  // mat4.rotateX(modelMatrix, modelMatrix, xRotateRad);
  // const yRotateRad = mapLinear(mousePos.x, 0, window.innerWidth, 0, 0.05);
  // mat4.rotateY(modelMatrix, modelMatrix, yRotateRad);
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
  // gl.uniformMatrix4fv(cameraProps.uMatrix, false, mvpMatrix);

  return {
    // uRes,
    uMatrix,
  };
}

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

export { cameraSetup, cameraDraw };
