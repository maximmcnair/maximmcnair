import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Highlight from "react-highlight";

import { getPostSlugs, getPost, getPosts } from "utils/posts";
import { Layout } from "components/Layout";
import { LawOf100 } from "components/LawOf100";
import { Post, Meta } from "types";

const AHref: React.FC<{ href: string }> = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

interface Props {
  meta: Meta;
  mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  posts: Post[];
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

  // Get all posts just for LawOf100
  const posts = await getPosts();

  return {
    props: {
      meta,
      mdx,
      posts: posts.filter((p) => p.meta.published),
    },
  };
};

const Post: NextPage<Props> = ({ meta, mdx, posts }) => {
  return (
    <Layout title={meta?.title} desc={meta?.desc}>
      <article className="article">
        <header className="article__header">
          <h1 className="article__title">{meta?.title}</h1>
          <strong className="article__date">
            {meta?.tags?.length > 0 && (
              <div className="tags">
                {meta.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <span className="article-dot">{" • "}</span>
            {format(parseISO(meta?.publishedOn), "do MMM yyyy")}
          </strong>
        </header>
        <div className="article__content">
          <MDXRemote
            {...mdx}
            components={{
              pre: Highlight,
              a: AHref,
              LawOf100: () => <LawOf100 amount={posts.length} />,
            }}
          />
        </div>
      </article>
    </Layout>
  );
};

export default Post;
