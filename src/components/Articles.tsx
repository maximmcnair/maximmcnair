'use client';

import { Post } from '$/types';
import { Article } from './article/Article';

interface ArticlesProps {
  posts: Post[];
}

const Articles = ({ posts }: ArticlesProps) => {
  return (
    <div className="mt-12 pt-8 pb-16">
      <div className="relative z-10 w-[90%] max-w-[var(--layout-width-max)] mx-auto">
        <h1 className="mb-3 text-xl">WebGL Image Processing</h1>
        <span className='block mb-6 text-md text-zinc-600'>An exploration of image processing with GPU shaders in the browser.</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {posts
            .filter(p => p.meta.series === 'WebGL Image Processing')
            .sort((a, b) =>
              a.meta.issue < b.meta.issue
                ? -1
                : a.meta.issue > b.meta.issue
                  ? 1
                  : 0,
            )
            .map((post, i) => (
              <Article
                key={post.slug}
                article={post}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
