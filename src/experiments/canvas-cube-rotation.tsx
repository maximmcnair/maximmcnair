import { useEffect } from 'react';
import * as glMatrix from "gl-matrix";

const { mat4, vec4 } = glMatrix;

// const config = {
//   aspectRatio: 1,
//   fovAngle: 30,
//   zNear: 0,
//   zFar: 800,
//   distance: 2,
// };
//
function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  // set height&width of canvas
  let width = window.innerWidth;
  let height = window.innerHeight;

  window.addEventListener('resize', onResize);
  // TODO handle removal?

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // if (window.devicePixelRatio > 1) {
    //   canvas.width = canvas.clientWidth * 2;
    //   canvas.height = canvas.clientHeight * 2;
    //   ctx.scale(2, 2);
    // } else {
    //   canvas.width = canvas.offsetWidth;
    //   canvas.height = canvas.offsetHeight;
    // }
  }

  onResize();

  const renderVertices: glMatrix.vec4[] = [
    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),

    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),
    vec4.fromValues(1, 1, 1, 1),
  ];

  // cube origin x
  const cx = 0;
  // cube origin y
  const cy = 0;
  // cube origin z
  const cz = 0;
  // cube size
  const cs = 0.9;

  /*
  back/left = (-,+)
  back/right = (+,+)
  front/left = (-,-)
  front/right = (+,-)
  */

  const vertices: glMatrix.vec4[] = [
    // Top corner vertices
    // 0 - top/back/left (-10, 10, 10)
    vec4.fromValues(cx - cs, cy + cs, cz + cs, 1),
    // 1 - top/back/right (10, 10, 10)
    vec4.fromValues(cx + cs, cy + cs, cz + cs, 1),
    // 2 - top/front/left (-10, -10, 10)
    vec4.fromValues(cx - cs, cy - cs, cz + cs, 1),
    // 3 - top/front/right (10, -10, 10)
    vec4.fromValues(cx + cs, cy - cs, cz + cs, 1),

    // bottom corner vertices
    // 4 - top/back/left (-10, 10, -10)
    vec4.fromValues(cx - cs, cy + cs, cz - cs, 1),
    // 5 - top/back/right (10, 10, -10)
    vec4.fromValues(cx + cs, cy + cs, cz - cs, 1),
    // 6 - top/front/left (-10, -10, -10)
    vec4.fromValues(cx - cs, cy - cs, cz - cs, 1),
    // 7 - top/front/right (10, -10, -10)
    vec4.fromValues(cx + cs, cy - cs, cz - cs, 1),
  ];

  type Vertex = glMatrix.vec4;
  type Edge = [Vertex, Vertex];

  function genEdges(vertices: Vertex[]) {
    const vertTopBackLeft = vertices[0];
    const vertTopBackRight = vertices[1];
    const vertTopFrontLeft = vertices[2];
    const vertTopFrontRight = vertices[3];

    const vertBottomBackLeft = vertices[4];
    const vertBottomBackRight = vertices[5];
    const vertBottomFrontLeft = vertices[6];
    const vertBottomFrontRight = vertices[7];

    const edges: Edge[] = [
      // top
      // back/left to back/right
      [vertTopBackLeft, vertTopBackRight],
      // back/left to front/left
      [vertTopBackLeft, vertTopFrontLeft],
      // back/right to front/right
      [vertTopBackRight, vertTopFrontRight],
      // front/left to front/right
      [vertTopFrontLeft, vertTopFrontRight],

      // middle
      [vertTopBackLeft, vertBottomBackLeft],
      [vertTopBackRight, vertBottomBackRight],
      [vertTopFrontLeft, vertBottomFrontLeft],
      [vertTopFrontRight, vertBottomFrontRight],

      // bottom
      // back/left to back/right
      [vertBottomBackLeft, vertBottomBackRight],
      // back/left to front/left
      [vertBottomBackLeft, vertBottomFrontLeft],
      // back/right to front/right
      [vertBottomBackRight, vertBottomFrontRight],
      // front/left to front/right
      [vertBottomFrontLeft, vertBottomFrontRight],
    ];

    return edges;
  }

  function transformVertices(
    renderVertices: glMatrix.vec4[],
    vertices: glMatrix.vec4[],
    frame: number
  ): glMatrix.vec4[] {
    // aspect ratio
    // {
    // let aspectRatio = height / width;
    // let aspectRatio = 1;
    // let fov = 1 / Math.tan(config.fovAngle / 2);
    // projection matrix
    // prettier-ignore
    // let projectionMatrix = mat4.fromValues(
    //     aspectRatio * fov, 0, 0, 0,
    //     // config.aspectRatio * fov, 0, 0, 0,
    //     0, fov, 0, 0,
    //     0, 0, (config.zFar / config.zFar - config.zNear), (-config.zFar / config.zFar - config.zNear) * config.zNear,
    //     0, 0, 0, 1
    //     // 0, 0, (config.zFar / config.zFar - config.zNear), 1,
    //     // 0, 0, (-config.zFar / config.zFar - config.zNear) * config.zNear, 0
    //   );
    // }

    // prettier-ignore
    const translateMatrix = mat4.fromValues(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );

    // Create our transformMatrix
    let transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, transformMatrix, translateMatrix);
    mat4.rotateZ(transformMatrix, transformMatrix, -30);
    mat4.rotateX(transformMatrix, transformMatrix, -90);
    mat4.rotateY(transformMatrix, transformMatrix, frame);

    // Apply our transformMatrix to our vertices
    for (let i = 0; i < vertices.length; i++) {
      vec4.transformMat4(renderVertices[i], vertices[i], transformMatrix);
      // vec4.transformMat4(renderVertices[i], renderVertices[i], projectionMatrix);
      vec4.scale(renderVertices[i], renderVertices[i], 150);
    }
    return vertices;
  }

  function draw(ctx: CanvasRenderingContext2D, edges: Edge[], color: string) {
    ctx.strokeStyle = color;
    // draw edges
    for (let [v1, v2] of edges) {
      ctx.beginPath();
      ctx.moveTo(v1[0], v1[1]);
      ctx.lineTo(v2[0], v2[1]);
      ctx.stroke();
      ctx.closePath();
    }

    // draw origin
    // ctx.strokeStyle = "red";
    // ctx.fillStyle = "red";

    // ctx.beginPath();
    // origin red dot
    // ctx.moveTo(0, 0);
    // ctx.fillRect(0, 0, 1, 1);

    // origin lines
    // ctx.moveTo(-1, 0);
    // ctx.lineTo(-1, 0);
    // ctx.fill();
    // ctx.stroke();
    // ctx.closePath()
  }

  let frame = 0;
  function render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // clear screen
    ctx.clearRect(0, 0, width, height);
    // center
    ctx.translate(width / 2, height / 2);

    // draw cube
    // transform our vertices with current frame
    transformVertices(renderVertices, vertices, frame);
    // make edges from vertex positions
    const edges = genEdges(renderVertices);
    // draw our edges
    draw(ctx, edges, "white");

    //

    // bump frame
    frame += 0.01;
    ctx.restore();
    window.requestAnimationFrame(() => render(ctx));
  }
  render(ctx);
}

export default function Temp() {
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasAnimation(canvas, ctx);
  });

  return <canvas id="canvas" className="canvas" />;
}

