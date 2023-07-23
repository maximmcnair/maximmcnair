import Head from 'next/head';
import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';

import Header from '@/components/Header';
import { getShaderSlugs, getShader } from '@/utils/shaders';
import ShaderView from '@/components/ShaderView';
import styles from '@/styles/webgl-shader-grid.module.css';
import { Shader } from '@/types';

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: string[] = await getShaderSlugs();
  const paths = slugs.map(slug => {
    return {
      params: { slug },
    };
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context?.params?.slug || '';
  const shader = await getShader(String(slug) || '');

  return {
    props: {
      shader,
    },
  };
};

interface Props {
  shader: Shader;
}

const ShaderScreen: NextPage<Props> = ({ shader }) => {
  const { title, frag } = shader;

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

      <ShaderView frag={frag} className={styles.fullscreen} title={title} />
    </>
  );
};

export default ShaderScreen;
