import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Highlight from 'react-highlight';
import Link from 'next/link';

import { getPostSlugs, getPost, getPosts } from '@/utils/posts';
import Button from '@/components/Button';
import { Layout } from '@/components/Layout';
import { MathGrid } from '@/components/MathGrid';
import { WebGLFilters } from '@/components/WebGLFilters/Article';
import { Duotone } from '@/components/WebGLFilters/Duotone';
import { Dither } from '@/components/WebGLFilters/Dither';
import { MatrixColor } from '@/components/WebGLFilters/Matrix';
import { ColorVec4 } from '@/components/ColorVec4';
import { Article } from '@/components/Article';
import { Post, Meta } from '@/types';

// @ts-ignore
const AHref: React.FC<{ href: string }> = ({ href, children }) => {
  if (href.includes('/p/')) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

// @ts-ignore
const WebGLImageProcessingIntro: React.FC = ({ children }) => {
  return (
    <>
      <p style={{ fontStyle: 'italic' }}>
        This is part of the WebGL image processing series and it relies on
        information in previous articles. See all articles{' '}
        <Link href="/webgl-image-processing">here.</Link>
      </p>
      <p style={{ fontStyle: 'italic' }}>
        It is designed to be used on desktop.
      </p>
    </>
  );
};

interface Props {
  meta: Meta;
  mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  posts: Post[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: string[] = await getPostSlugs();
  const paths = slugs.map(slug => {
    return {
      params: { slug },
    };
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context?.params?.slug || '';
  const { content, meta } = await getPost(String(slug) || '');
  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });
  const posts = await getPosts();
  return {
    props: {
      meta,
      mdx,
      posts,
    },
  };
};

const Post: NextPage<Props> = ({ meta, mdx, posts }) => {
  return (
    <Layout title={meta?.title} desc={meta?.desc}>
      <div className="article__wrapper">
        <article className="article">
          <header className="article__header">
            <h1 className="article__title">{meta?.title}</h1>
            <strong className="article__date">
              {meta?.tags?.length > 0 && (
                <div className="tags">
                  {meta.tags.map(t => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className="article-dot">{' • '}</span>
              {format(parseISO(meta?.publishedOn), 'do MMM yyyy')}
            </strong>
          </header>
          <div className="article__content">
            <MDXRemote
              {...mdx}
              components={{
                pre: Highlight,
                small: ({ children }) => <small>{children}</small>,
                ArticlePreview: ({ slug }) => {
                  const post = posts.find(p => p.slug === slug);
                  if (!post) return null;
                  return (
                    <div className="next-article">
                      <div className="next-article__preview">
                        {/* @ts-ignore */}
                        <Article article={post} />
                      </div>
                    </div>
                  );
                },
                WebGLImageProcessingIntro,
                // @ts-ignore
                a: AHref,
                MathGrid,
                WebGLFilters,
                ColorVec4,
                Duotone,
                Dither,
                MatrixColor,
              }}
            />
          </div>

          <section className="article-contact">
            <h2 className="article-contact__title">Feedback and suggestions</h2>
            <p>
              Have a suggestion or want to show me your work?
              <br />
              Get in touch at{' '}
              <a
                href="mailto:maximmcnair@proton.me"
                target="_blank"
                rel="noreferrer"
              >
                via email
              </a>
              {' or Twitter '}
              <a
                href="http://twitter.com/maximmcnair"
                target="_blank"
                rel="noreferrer"
              >
                @maximmcnair
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
};

export default Post;
