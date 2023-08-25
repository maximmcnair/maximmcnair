import Head from 'next/head';
import { useRef, useEffect } from 'react';
import type { NextPage } from 'next';

import { getPosts } from '@/utils/posts';
import { Post } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import Intro from '@/components/Intro';
import Intro from '@/components/IntroAlt';
import Work from '@/components/Work';
// import Articles from '@/components/Articles__old';
import Articles from '@/components/Articles';
import Experiments from '@/components/Experiments';
// shaders
import ShaderView from '@/components/ShaderView';
// @ts-ignore
import frag from '@/shaders/2023-07-18_01.frag';
import styles from '@/components/IntroAlt.module.css';
import { mapLinear } from '@/utils/webgl';

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
  const refBackground = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!refBackground.current) return;

    function handleScroll() {
      if (!refBackground.current) return;
      const st = document.documentElement.scrollTop;
      if (st < window.innerHeight) {
        refBackground.current.style.opacity = String(
          mapLinear(st, 0, window.innerHeight, 1, 0),
        );
      } else {
        refBackground.current.style.opacity = '0';
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [refBackground]);

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

        <div ref={refBackground}>
          <ShaderView frag={frag} title={''} className={styles.shader} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
