import React from "react";
import Head from "next/head";

interface Meta {
  title: string;
  author: string;
  desc: string;
}

interface Props {
  meta: Meta;
}

export const Layout: React.FC<Props> = ({ meta, children }) => {
  return (
    <>
      <Head>
        <title>{meta.title ? `${meta.title} | ` : ""}Maxim McNair</title>
        <meta name="description" content={meta.desc || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <article>{children}</article>
      </main>
    </>
  );
};
