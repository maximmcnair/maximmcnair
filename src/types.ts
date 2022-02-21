export interface Post {
  slug: string;
  content: string;
  meta: { [key: string]: any };
}

export interface Meta {
  title: string;
  author: string;
  desc: string;
  publishedOn: string;
  published: string;
  tags: string[];
}
