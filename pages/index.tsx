import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import { getPosts } from "utils/posts";
import { Post } from "types";

export async function getStaticProps() {
  const posts = await getPosts();
  return { props: { posts: posts } };
}

interface Props {
  posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Maxim McNair</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <p>
            Developer interested in React, Web VR, typescript.
          </p>
          <p>Learning Blender and diving into the Web3 World.</p>
          <p>Founder of burnie.app & keeptheaxesharp.com</p>
        </div>
        <article>
          {posts.map(({ slug, meta }) => (
            <a href={`/p/${slug}`} key={slug}>
              <h2>{meta.title}</h2>
              <strong>{format(parseISO(meta.publishedOn), "MMM yyyy")}</strong>
            </a>
          ))}
        </article>
      </main>
    </div>
  );
};

export default Home;
