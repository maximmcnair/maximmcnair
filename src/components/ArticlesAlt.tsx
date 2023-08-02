import styles from './ArticlesAlt.module.css';
import { Post } from '@/types';

interface Props {
  posts: Post[];
}

const Articles: React.FC<Props> = ({ posts }) => {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2 className={styles.header}>Articles</h2>
        <p className={styles.desc}>An exploration of image processing with GPU shaders on the web.</p>
        <div className={styles.articles}>
          {posts
            .filter(p => p.meta.series === 'WebGL Image Processing')
            .sort((a, b) =>
              a.meta.issue < b.meta.issue
                ? -1
                : a.meta.issue > b.meta.issue
                ? 1
                : 0,
            )
            .map(({ slug, meta }) => (
              <a href={`/p/${slug}`} key={slug} className={styles.article}>
                <h3 className={styles.title}>{meta.title}</h3>
                {meta?.thumb ? (
                  <img className={styles.image} src={meta.thumb} />
                ) : null}
              </a>
            ))}
        </div>
      </div>
    </section>
  );
};
export default Articles;
