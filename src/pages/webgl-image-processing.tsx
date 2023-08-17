import Head from 'next/head';
import type { NextPage } from 'next';

import { getPosts } from '@/utils/posts';
import { Post } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Articles from '@/components/Articles';

export async function getStaticProps() {
  const posts = await getPosts();

  return {
    props: {
      posts: posts
        .filter(p => p.meta.published)
        .sort((a, b) =>
          a.meta.publishedOn > b.meta.publishedOn
            ? -1
            : a.meta.publishedOn < b.meta.publishedOn
            ? 1
            : 0,
        ),
    },
  };
}

interface Props {
  posts: Post[];
}

const WebGLImageProcessing: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>WebGL Image Processing | Maxim McNair</title>
        <meta
          name="description"
          content="Product engineer building creative tools for the web."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/Epilogue.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="use-credentials"
        />
        <link
          rel="preload"
          href="/typefaces/Fraunces.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="use-credentials"
        />
      </Head>

      <Header />

      <main style={{ paddingBottom: 80 }}>
        <Articles posts={posts} />
      </main>

      <Footer />
    </>
  );
};

export default WebGLImageProcessing;
