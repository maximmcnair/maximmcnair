import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Highlight from "react-highlight";

import { getPostSlugs, getPost } from "utils/posts";
import { Meta } from "types";

interface Props {
  meta: Meta;
  mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: string[] = await getPostSlugs();
  const paths = slugs.map((slug) => {
    return {
      params: { slug },
    };
  });
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context?.params?.slug || "";
  const { content, meta } = await getPost(String(slug) || "");
  const mdx = await serialize(content);

  return {
    props: {
      meta,
      mdx,
    },
  };
};

const Post: NextPage<Props> = ({ meta, mdx }) => {
  return (
    <>
      <Head>
        <title>{meta?.title ? `${meta.title} | ` : ""}Maxim McNair</title>
        <meta name="description" content={meta?.desc || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <article>
          <h1>{meta?.title}</h1>
          <strong>{format(parseISO(meta?.publishedOn), "MMM yyyy")}</strong>
          <MDXRemote {...mdx} components={{ pre: Highlight }} />
        </article>
      </main>
    </>
  );
};

export default Post;
