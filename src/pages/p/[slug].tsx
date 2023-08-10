import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Highlight from 'react-highlight';
import Head from 'next/head';
import Link from 'next/link';

import { getPostSlugs, getPost } from '@/utils/posts';
import { Layout } from '@/components/Layout';
import { MathGrid } from '@/components/MathGrid';
import { WebGLFilters } from '@/components/WebGLFilters/Article';
import { Duotone } from '@/components/WebGLFilters/Duotone';
import { Dither } from '@/components/WebGLFilters/Dither';
import { ColorVec4 } from '@/components/ColorVec4';
import { Post, Meta } from '@/types';

// @ts-ignore
const AHref: React.FC<{ href: string }> = ({ href, children }) => {
  if (href.includes('/p/')) {
    return(
      <a href={href}>
        {children}
      </a>
    );
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
    <p>
      This is part of the WebGL image processing series, it relies on information in previous articles. Start at the{' '}
      <Link href="/p/2023-06-webgl-01-setup">
        beginning here.
      </Link>
    </p>
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

  return {
    props: {
      meta,
      mdx,
    },
  };
};

const Post: NextPage<Props> = ({ meta, mdx, posts }) => {
  return (
    <Layout title={meta?.title} desc={meta?.desc}>
      <article className="article content">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.css"
            integrity="sha384-WsHMgfkABRyG494OmuiNmkAOk8nhO1qE+Y6wns6v+EoNoTNxrWxYpl5ZYWFOLPCM"
            crossOrigin="anonymous"
          />
        </Head>

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
              WebGLImageProcessingIntro,
              // @ts-ignore
              a: AHref,
              MathGrid,
              WebGLFilters,
              ColorVec4,
              Duotone,
              Dither,
            }}
          />
        </div>
      </article>
    </Layout>
  );
};

export default Post;
