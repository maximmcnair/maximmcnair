export interface Post {
  slug: string;
  content: string;
  meta: { [key: string]: any };
}

export interface Meta {
  title: string;
  author: string;
  series: string;
  issue: string;
  thumb: string;
  desc: string;
  publishedOn: string;
  published: string;
  tags: string[];
}

export interface Experiment {
  title?: string;
  slug?: string;
  video?: string;
  thumb?: string;
  category: string;
  published: boolean;
  src?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Shader {
  title: string;
  frag: string;
}


