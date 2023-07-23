import Head from 'next/head';
import type { NextPage } from 'next';

import Header from '@/components/Header';
import { getShaders } from '@/utils/shaders';
import ShaderView from '@/components/ShaderView';
import styles from '@/styles/webgl-shader-grid.module.css';
import { Shader } from '@/types';

export async function getStaticProps() {
  const shaders = await getShaders();

  return {
    props: {
      shaders: shaders,
      // .filter((p) => p.meta.published)
      // .sort((a, b) =>
      //   a.meta.publishedOn > b.meta.publishedOn
      //     ? -1
      //     : a.meta.publishedOn < b.meta.publishedOn
      //     ? 1
      //     : 0
      // )
    },
  };
}

interface Props {
  shaders: Shader[];
}

const Shaders: NextPage<Props> = ({ shaders }) => {
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
      </Head>

      <Header />

      <section className={styles.container}>
        {shaders.map(({ title, frag }) => (
          <a href={`/shaders/${title}`} key={title}>
            <ShaderView
              frag={frag}
              className={styles.shader}
              key={title}
              title={title}
            />
          </a>
        ))}
      </section>
    </>
  );
};

export default Shaders;
