// utils/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Post } from "$/types";
import { cache } from "react";

const contentDirectory = path.join(process.cwd(), "content");

// Using cache() to memoize data fetching functions
export const getPostSlugs = cache(async (): Promise<string[]> => {
  const slugs = fs.readdirSync(contentDirectory);
  return slugs.map((s) => s.replace(".mdx", ""));
});

export const getPost = cache(async (slug: string): Promise<Post> => {
  const postPath = path.join(contentDirectory, `${slug}.mdx`);
  const postSource = fs.readFileSync(postPath);
  const { content, data: meta } = matter(postSource);
  return {
    slug,
    content,
    meta,
  };
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const slugs = await getPostSlugs();
  return await Promise.all(
    slugs.map(async (slug) => {
      return await getPost(slug);
    })
  );
});
