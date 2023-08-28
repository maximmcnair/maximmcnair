import Image from 'next/image';

import styles from './Work.module.css';
import Button from '@/components/Button';
import SectionHeader from './SectionHeader';

interface Project {
  title: string;
  desc: string;
  src?: string;
  vidSrc?: string;
  tags: string[];
  href?: string;
}

const projects: Project[] = [
  {
    title: 'WebGL Photo Filters',
    desc: `An exploration of achieving common photo filters and effects with WebGL and GLSL. This was later expanded into a series of articles where I break down the GLSL functions.`,
    src: '/img/work_filters_effects.jpg',
    href: '/webgl-filters-and-effects',
    tags: ['WebGL', 'GLSL', 'Image processing'],
  },
  {
    title: 'Nmblr',
    desc: `Nmblr is a real-time collaboration platform for research and discovery in pharma. I led the construction of this greenfield project with a focus on building an interactive and real-time
app with drag-and-drop functionality throughout.`,
    vidSrc: '/nmblr.mp4',
    tags: ['React', 'Sockets', 'Postgres', 'Node', 'GraphQL'],
    href: 'http://nmblr.co/',
  },
  {
    title: 'Cables',
    desc: `Led development of Cables, A no-code node based animation tool for creating shaders in the browser.`,
    vidSrc: '/cables.mp4',
    tags: ['WebGL', 'Svelte'],
    href: 'http://usecables.com/',
  },
  {
    title: 'Open Type Collective',
    desc: `A showcase of open source variable typefaces that you can use on any project.`,
    vidSrc: '/opentypecollective.mp4',
    tags: ['Svelte'],
    href: 'http://opentypecollective.com/',
  },
  {
    title: 'InMySize',
    desc: `InMySize is a streetwear shopping app that shows users clothing from multiple stores that are currently in stock. Sizes are continuously updated using Node-based crawlers.`,
    src: '/img/work_inmysize.jpg',
    tags: ['React Native', 'Node JS', 'Koa', 'MongoDB', 'Design'],
  },
  // {
  //   title: 'Keep The Axe Sharp',
  //   desc: `Keep The Axe Sharp uses flashcards and a repetition spaced learning algorithm to help programmers commit easy forgotten patterns, edge cases and shortcuts to memory.`,
  //   src: '/img/work_keepyouraxesharp.jpg',
  //   tags: ['React', 'Node JS', 'Design']
  //   // href: 'http://keeptheaxesharp.com/'
  // }
];

export default function Work() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <SectionHeader
          title="Work"
          desc={`A preview of various projects I've led, and tools I've built.`}
        />

        <div className={styles.work}>
          {projects.map((p, idx) => (
            <article className={styles.workitem} key={idx}>
              <div className={styles.workMedia}>
                {p.vidSrc ? (
                  <video autoPlay={true} loop muted>
                    <source src={p.vidSrc} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={p.src || ''}
                    alt={p.title}
                    width={700}
                    height={438}
                    quality={100}
                  />
                )}
              </div>
              <div className={styles.workDesc}>
                <h3 className={styles.workDescTitle}>{p.title}</h3>
                <p className={styles.workDescParagraph}>{p.desc}</p>
                <ul className="tags">
                  {p.tags.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
                {p.href ? (
                  <div className={styles.workDescBtn}>
                    <Button text="View Project" href={p.href} />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
