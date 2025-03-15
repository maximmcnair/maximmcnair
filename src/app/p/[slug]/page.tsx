import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { getPost, getPosts } from '$/utils/posts';
import { Header } from '$/components/Header';
import { getComponents } from '$/components/article/mdx-components';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { content, meta } = await getPost(params.slug);
  const posts = await getPosts();

  const components = getComponents(posts);

  return (
    <div className="mx-auto px-6 mt-6 max-w-[1200px]">
      <Header />

      <section className="flex items-center justify-center">
        <article className="mx-auto w-full max-w-2xl text-left">
          <header className="mt-14 mb-4">
            <h1 className="bg-black-800 text-2xl">
              {meta.title}
            </h1>
            <time dateTime="01 01 1860" className="hidden text-gray-400">
              <span className="">1 Jan 1860</span>
            </time>
          </header>

          <div className="flex flex-col gap-6 text-zinc-400 prose prose-invert lg:prose-lg prose-p:m-0">
            <MDXRemote
              source={content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMath],
                  rehypePlugins: [rehypeKatex],
                }
              }}
            />
          </div>
        </article>
      </section>
    </div>
  );
}
