import { useRef } from 'react';
import Link from 'next/link';
// import Image from 'next/image';

import styles from './WorkCombo.module.css';

const SHOW_VIDEO = true;

interface Work {
  title?: string;
  date: string;
  slug?: string;
  video?: string;
  thumb?: string;
  category: string;
  published: boolean;
  src?: string;
}

export const experiments: Work[] = [
  {
    title: 'WebGL Photo Manipulation',
    slug: '/webgl-filters-effects',
    category: 'WebGL + React',
    date: '2023',
    video: '/experiments/webgl-photo-manipulation.mp4',
    published: true,
    src: '2023-filters-effects/index.tsx',
  },
  {
    title: 'InMySize',
    category: 'Mobile Dev',
    date: '2023',
    thumb: '/experiments/inmysize.png',
    published: true,
  },
  {
    title: 'Opentype Collective',
    category: 'svelte',
    date: '2023',
    video: '/experiments/opentype-collective-dice.mp4',
    slug: 'https://www.opentypecollective.com/',
    published: true,
  },
  {
    title: 'Opentype Collective',
    category: 'svelte',
    date: '2023',
    video: '/experiments/opentype-collective-mouse.mp4',
    slug: 'https://www.opentypecollective.com/',
    published: true,
  },
  {
    title: 'Opentype Collective',
    category: 'svelte',
    date: '2023',
    video: '/experiments/opentype-collective-preview.mp4',
    slug: 'https://www.opentypecollective.com/',
    published: true,
  },
  {
    title: 'Boiler Room',
    category: 'Mobile Dev',
    date: '2023',
    thumb: '/experiments/boiler-room.png',
    published: true,
  },
  {
    title: 'Burnie',
    category: 'Blender',
    date: '2023',
    video: '/experiments/burnie.mp4',
    published: true,
  },
  {
    category: 'Blender',
    date: '2023',
    thumb: '/experiments/feb-10.png',
    published: true,
  },
  {
    category: 'Blender',
    date: '2023',
    video: '/experiments/feb-25.mp4',
    published: true,
  },
  {
    title: 'Cube Matrix Rotation',
    slug: '/experiment/canvas-cube-rotation',
    category: 'Canvas 2d',
    date: '2023',
    thumb: '/experiments/cube-rotation.jpg',
    published: true,
    src: 'canvas-cube-rotation.tsx',
  },
  {
    title: 'Nmblr',
    category: 'React',
    date: '2023',
    video: '/experiments/nmblr.mp4',
    slug: 'https://nmblr.co/',
    published: true,
  },
  {
    title: 'Flocking Boids',
    slug: '/experiment/canvas-flocking-boids',
    category: 'Canvas 2d',
    date: '2023',
    thumb: '/experiments/boids-flocking.jpg',
    published: true,
    src: 'canvas-flocking-boids.tsx',
  },
  {
    category: 'Blender',
    date: '2023',
    video: '/experiments/feb-26.mp4',
    published: true,
  },
  {
    title: 'Particle Constellation',
    slug: '/experiment/particle-constellation',
    category: 'Canvas 2d',
    date: '2023',
    thumb: '/experiments/constellation.png',
    published: true,
    src: '2023-01-particles.tsx',
  },
  {
    category: 'Blender',
    date: '2023',
    video: '/experiments/dec-15.mp4',
    published: true,
  },
];

const WorkItem: React.FC<{ work: Work }> = ({
  work: { title, video, thumb, category, date, slug },
}) => {
  const refVideo = useRef<HTMLVideoElement>(null);

  function videoPlay() {
    if (refVideo.current) refVideo.current.play();
  }
  function videoStop() {
    if (refVideo.current) refVideo.current.pause();
  }

  return (
    <div
      className={styles.item}
      key={title}
      onMouseEnter={() => videoPlay()}
      onMouseLeave={() => videoStop()}
    >
      <Link
        href={slug ? slug : ''}
        onClick={evt => {
          if (!slug) evt.preventDefault();
        }}
        className={styles.experiment}
        style={{ cursor: slug ? 'pointer' : 'default' }}
      >
        {video && SHOW_VIDEO ? (
          <video loop muted ref={refVideo}>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <>{thumb ? <img src={thumb} alt={title || ''} /> : null}</>
        )}

        {title ? <span className={styles.title}>{title}</span> : null}
        {category ? <span className={styles.category}>{category}</span> : null}
        <span className={styles.date}>{date} </span>

        {slug ? <span className={styles.visit}>Visit</span> : null}
      </Link>
    </div>
  );
};

const WorkCombo: React.FC = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Work and Experiments</h2>
          <p className={styles.desc}>
            A collection of previous work in React, WebGL, WebGPU, Canvas and
            Blender. Hover to for preview video.
          </p>
        </div>
        <div className={styles.grid}>
          {experiments
            .filter(e => e.published)
            .map((work, idx) => (
              <WorkItem work={work} key={idx} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default WorkCombo;
