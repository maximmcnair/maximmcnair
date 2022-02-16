import type { NextPage } from "next";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import { getPosts } from "utils/posts";
import { Intro } from "components/Intro";
import { Layout } from "components/Layout";
import { Post } from "types";

export async function getStaticProps() {
  const posts = await getPosts();

  return {
    props: {
      posts: posts
        .filter((p) => p.meta.published)
        .sort((a, b) =>
          a.meta.publishedOn > b.meta.publishedOn
            ? -1
            : a.meta.publishedOn < b.meta.publishedOn
            ? 1
            : 0
        ),
    },
  };
}

interface Props {
  posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <Intro />

      <section className="articles">
        <span>Articles</span>
        {posts.map(({ slug, meta }) => (
          <a href={`/p/${slug}`} key={slug} className="article-prev">
            <h2 className="article-prev__title">{meta.title}</h2>
            <strong className="article-prev__date">
              {format(parseISO(meta.publishedOn), "MMM yyyy")}
            </strong>
          </a>
        ))}
      </section>
    </Layout>
  );
};

export default Home;
