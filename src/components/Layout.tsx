import React from "react";
import Head from "next/head";

import { Nav } from "components/Nav";

interface Props {
  title?: string;
  desc?: string;
}

export const Layout: React.FC<Props> = ({ title, desc, children }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ""}Maxim McNair</title>
        <meta name="description" content={desc || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        <Nav />
        {children}
      </main>
    </>
  );
};
