import { Metadata } from 'next';

import { getPosts } from '$/utils/posts';
import { Header } from '$/components/Header';
import { Layout } from "$/components/Layout";
import Articles from '$/components/Articles';

export const metadata: Metadata = {
  title: 'WebGL Image Manipulation | Maxim McNair',
  description: 'Product engineer building creative tools for the web.',
};

export default async function WebGLImageProcessingPage() {
  const allPosts = await getPosts();

  // Filter and sort posts
  const posts = allPosts
    .filter(p => p.meta.published)
    .sort((a, b) =>
      a.meta.publishedOn > b.meta.publishedOn
        ? -1
        : a.meta.publishedOn < b.meta.publishedOn
          ? 1
          : 0,
    );

  return (
    <Layout>
      <Header />
      <main style={{ paddingBottom: 80 }}>
        <Articles posts={posts} />
      </main>
    </Layout>
  );
}
