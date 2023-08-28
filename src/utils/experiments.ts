import { Experiment } from '@/types';

// @ts-ignore
import fragShader2023_07_12_02 from '../shaders/2023-07-12_02.frag';
// @ts-ignore
import fragShader2023_08_18_01 from '../shaders/2023-08-18_01.frag';

export const experiments: Experiment[] = [
  {
    title: 'WebGL Grainy Textures',
    slug: 'webgl-grainy-textures',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-grainy-textures/index.tsx'
  },
  {
    title: 'WebGL Shader Grid',
    slug: 'webgl-shader-grid',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-webgl-shader-grid/index.tsx'
  },
  {
    title: 'WebGL Shader Base',
    slug: 'webgl-shader-base',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-webgl-shader-base/index.tsx'
  },
  {
    title: 'Multi Pass',
    slug: 'webgl-multi-pass',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-multi-pass/index.tsx'
  },
  {
    title: 'Filters & Effects',
    slug: 'webgl-filters-effects',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-filters-effects/index.tsx'
  },
  {
    title: 'WebGL Shader',
    category: 'WebGL',
    frag: fragShader2023_07_12_02,
    src: '/shaders/2023-08-18_02',
    published: true
  },
  {
    title: 'WebGL Shader',
    category: 'WebGL',
    frag: fragShader2023_08_18_01,
    thumb: '/experiments/shaders_2023-08-18_01.jpg',
    src: '/shaders/2023-08-18_01',
    published: true
  },
  {
    title: 'Burnie',
    category: 'Blender',
    video: '/experiments/burnie.mp4',
    published: true
  },
  {
    title: 'Blender',
    category: 'Blender',
    thumb: '/experiments/feb-10.png',
    published: true
  },
  {
    title: 'Blender',
    category: 'Blender',
    video: '/experiments/feb-25.mp4',
    published: true
  },
  {
    title: '',
    slug: 'three-vectors',
    category: 'ThreeJS',
    thumb: '/experiments/',
    published: false,
    src: 'three.tsx'
  },
  {
    title: 'Moving Gradient',
    slug: 'moving-gradient',
    category: 'Canvas 2d',
    thumb: '/experiments/moving-gradient.png',
    published: false,
    src: '2023-01-moving-gradient.tsx'
  },
  {
    title: 'Cube Matrix Rotation',
    slug: 'canvas-cube-rotation',
    category: 'Canvas 2d',
    thumb: '/experiments/cube-rotation.jpg',
    published: false,
    src: 'canvas-cube-rotation.tsx'
  },
  {
    title: 'Flocking Boids',
    slug: 'canvas-flocking-boids',
    category: 'Canvas 2d',
    thumb: '/experiments/boids-flocking.jpg',
    published: true,
    src: 'canvas-flocking-boids.tsx'
  },
  {
    title: 'Blender',
    category: 'Blender',
    video: '/experiments/feb-26.mp4',
    published: true
  },
  {
    title: 'Particle Constellation',
    slug: 'particle-constellation',
    category: 'Canvas 2d',
    thumb: '/experiments/constellation.png',
    published: true,
    src: '2023-01-particles.tsx'
  },
  {
    title: 'Blender',
    category: 'Blender',
    video: '/experiments/dec-15.mp4',
    published: true
  },
  // {
  //   title: 'WebGL',
  //   slug: 'webgl',
  //   category: 'webgl',
  //   thumb: '',
  //   published: false,
  //   src: '2023-03-webgl.tsx'
  // },
  // {
  //   title: 'Canvas Collab',
  //   slug: 'canvas-collab',
  //   category: 'Canvas 2d',
  //   thumb: '/experiments/canvas-collab.jpg',
  //   published: false,
  //   src: 'canvas-collab.tsx'
  // },
];
