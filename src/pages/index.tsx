import Head from 'next/head';
import type { NextPage } from 'next';

import { getPosts } from '@/utils/posts';
import { Post } from '@/types';
import Header from '@/components/Header';
import Intro from '@/components/IntroAlt';
import Work from '@/components/Work';
import Articles from '@/components/Articles';
import Experiments from '@/components/Experiments';

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

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Maxim McNair</title>
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

      <main>
        <section id="about">
          <Intro />
        </section>
        <section id="articles">
          <Articles posts={posts} />
        </section>
        <section id="work">
          <Work />
        </section>
        <section id="experiments">
          <Experiments />
        </section>
      </main>
    </>
  );
};

export default Home;
