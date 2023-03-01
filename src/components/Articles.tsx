// import Link from 'next/link';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { Post } from '@/types';

interface Props {
  posts: Post[];
}

const Articles: React.FC<Props> = ({ posts }) => {
  return (
    <section className="articles">
      <div className="content">
        <h2>Articles</h2>

        {posts.map(({ slug, meta }) => (
          <a href={`/p/${slug}`} key={slug} className="article-prev">
            <h3 className="article-prev__title">{meta.title}</h3>
            <strong className="article-prev__date">
              {meta?.tags?.length > 0 && (
                <div className="tags">
                  {meta.tags.map((t: string) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className="article-dot">{' • '}</span>
              <span className="article__date">
                {format(parseISO(meta?.publishedOn), 'do MMM yyyy')}
              </span>
            </strong>
          </a>
        ))}
      </div>
    </section>
  );
};
export default Articles;
