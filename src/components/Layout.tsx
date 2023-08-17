import React from 'react';
import Head from 'next/head';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Props {
  title?: string;
  desc?: string;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ title, desc, children }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Maxim McNair` : 'Maxim McNair'}</title>
        <meta name="description" content={desc || ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        <Header />
        {children}
      </main>

      <Footer />
    </>
  );
};
