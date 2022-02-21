import type { NextPage } from "next";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import { getPosts } from "utils/posts";
import { Intro } from "components/Intro";
import { Layout } from "components/Layout";
import { Projects } from "components/Projects";
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
            <h3 className="article-prev__title">{meta.title}</h3>
            <strong className="article-prev__date">
              {meta?.tags?.length > 0 && (
                <div className="tags">
                  {meta.tags.map((t: string) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className="article-dot">{" • "}</span>
              {format(parseISO(meta?.publishedOn), "do MMM yyyy")}
            </strong>
          </a>
        ))}
      </section>

      <Projects />
    </Layout>
  );
};

export default Home;
