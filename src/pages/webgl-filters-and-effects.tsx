import type { NextPage } from 'next';
import Head from 'next/head';

import Header from '@/components/Header';
import WebGL from '@/components/WebGLFilters/index';

const WebGLFiltersAndEffects: NextPage = () => {
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

      <WebGL />
    </>
  );
};

export default WebGLFiltersAndEffects;
