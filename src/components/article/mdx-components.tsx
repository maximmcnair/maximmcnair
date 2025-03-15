import { Post } from '$/types';

import {
  Pre,
  AHref,
  WebGLImageProcessingIntro,
  MathGrid,
  WebGLFilters,
  ColorVec4,
  Duotone,
  Dither,
  MatrixColor,
  ArticlePreview,
  Article as ArticleComponent
} from './client-mdx-components';

// Server-side function to get components
export const getComponents = (posts: Post[]) => {
  return {
    pre: Pre,
    small: ({ children }: { children: React.ReactNode }) => <small>{children}</small>,
    ArticlePreview: (props: { slug: string }) => <ArticlePreview {...props} posts={posts} />,
    WebGLImageProcessingIntro,
    a: AHref,
    MathGrid,
    WebGLFilters,
    ColorVec4,
    Duotone,
    Dither,
    MatrixColor,
  };
};

// Re-export Article for convenience
export const Article = ArticleComponent;
