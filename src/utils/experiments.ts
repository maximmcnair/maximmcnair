import { Experiment } from '@/types';

export const experiments: Experiment[] = [
  {
    category: 'Blender',
    thumb: '/experiments/feb-10.png',
    published: true
  },
  {
    category: 'Blender',
    video: '/experiments/feb-25.mp4',
    published: true
  },
  {
    title: 'Moving Gradient',
    slug: 'moving-gradient',
    category: 'Canvas 2d',
    thumb: '/experiments/moving-gradient.png',
    published: true,
    src: '2023-01-moving-gradient.tsx'
  },
  {
    title: 'Cube Matrix Rotation',
    slug: 'canvas-cube-rotation',
    category: 'Canvas 2d',
    thumb: '/experiments/cube-rotation.jpg',
    published: true,
    src: 'canvas-cube-rotation.tsx'
  },
  {
    title: 'Flocking Boids',
    slug: 'canvas-flocking-boids',
    category: 'Canvas 2d',
    thumb: '/experiments/cube-rotation.jpg',
    published: true,
    src: 'canvas-flocking-boids.tsx'
  },
  {
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
    category: 'Blender',
    video: '/experiments/dec-15.mp4',
    published: true
  },
  {
    title: 'WebGL',
    slug: 'webgl',
    category: 'webgl',
    thumb: '',
    published: false,
    src: '2023-03-webgl.tsx'
  },
  {
    title: 'Canvas Collab',
    slug: 'canvas-collab',
    category: 'Canvas 2d',
    thumb: '/experiments/canvas-collab.jpg',
    published: true,
    src: 'canvas-collab.tsx'
  },
];
