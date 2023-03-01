import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types";

const contentDirectory = path.join(process.cwd(), "content");

export async function getPostSlugs(): Promise<string[]> {
  const slugs = fs.readdirSync(contentDirectory);
  return slugs.map((s) => s.replace(".mdx", ""));
}

export async function getPost(slug: string): Promise<Post> {
  const postPath = path.join(contentDirectory, `${slug}.mdx`);
  const postSource = fs.readFileSync(postPath);
  const { content, data: meta } = matter(postSource);
  return {
    slug,
    content,
    meta,
  };
}

export async function getPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs();
  return await Promise.all(
    slugs.map(async (slug) => {
      return await getPost(slug);
    })
  );
}
