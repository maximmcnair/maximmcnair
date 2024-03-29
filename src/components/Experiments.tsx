import Link from 'next/link';
// import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import ShaderView from '@/components/ShaderView';
import styles from './Experiments.module.css';
import { experiments } from '@/utils/experiments';

const SHOW_VIDEO = true;

const Experiments: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2 className={styles.mainTitle}>Experiments</h2>
        <p className={styles.desc}>
          A collection of experiments in WebGL, Canvas 2d and
          Blender. Click through to view interactive experiments.
        </p>

        <div className={styles.list}>
          {experiments
            .filter(e => e.published)
            .map((p, idx) => (
              <Link
                href={p.slug ? `/experiment/${p.slug}` : ''}
                key={idx}
                onClick={evt => {
                  if (!p.slug) evt.preventDefault();
                }}
                className={styles.experiment}
                style={{ cursor: p.slug ? 'pointer' : 'default' }}
              >
                <div>
                  {p.frag ? <ShaderView frag={p.frag || ''} title="" /> : null}
                  {p.video && SHOW_VIDEO ? (
                    <video autoPlay={true} loop muted>
                      <source src={p.video} type="video/mp4" />
                    </video>
                  ) : null}
                  {p.thumb ? <img src={p.thumb} alt={p.title || ''} /> : null}
                  {p.title ? (
                    <span className={styles.title}>{p.title}</span>
                  ) : null}
                  <span className={styles.category}>{p.category} </span>
                  {p.slug && (
                    <span className={styles.visit}>
                      <ArrowUpRight size={20} />
                      Visit
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};
export default Experiments;
