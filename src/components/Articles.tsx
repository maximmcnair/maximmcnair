import { Article } from './Article';
import styles from './Articles.module.css';
import { Post } from '@/types';

interface Props {
  posts: Post[];
}

const Articles: React.FC<Props> = ({ posts }) => {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2 className={styles.header}>Articles</h2>
        <p className={styles.desc}>
          An exploration of image processing with GPU shaders on the web.
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
              <Article article={article} key={article.slug} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
