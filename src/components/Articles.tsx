import { Article } from './Article';
import styles from './Articles.module.css';
import { Post } from '@/types';

interface Props {
  posts: Post[];
}

const Articles: React.FC<Props> = ({ posts }) => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.header}>WebGL Image Manipulation</h2>
        <p className={styles.desc}>
          An exploration of image processing with GPU shaders in the browser.
        </p>
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
            .map(article => (
              <Article style={{}} article={article} key={article.slug} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
