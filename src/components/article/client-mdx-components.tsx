'use client';

import React from 'react';
import { Post } from '$/types';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { ColorVec4 } from './ColorVec4';
import { WebGLFilters } from '$/components/article/WebGLFilters/Article';
import { Article } from '$/components/article/Article';
import { Duotone } from '$/components/article/WebGLFilters/Duotone';
import { Dither } from '$/components/article/WebGLFilters/Dither';
import { MatrixColor } from '$/components/article/WebGLFilters/Matrix';
import { MathGrid } from '$/components/article/MathGrid';

// Import the CodeBlock component with dynamic import
const CodeBlock = dynamic(() => import('./CodeBlock'), {
  loading: () => <div className="code-loading">Loading code...</div>
});

// Pre-defined AHref component
export const AHref = ({ href, children }: { href: string; children: React.ReactNode }) => {
  if (href.includes('/p/')) {
    return <a href={href}>{children}</a>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

// WebGL Image Processing Intro component
export const WebGLImageProcessingIntro = () => {
  return (
    <>
      <p>
        This is part of the WebGL image processing series and it relies on
        information in previous articles. See all articles{' '}
        <Link href="/webgl-image-processing">here.</Link>
      </p>
      <p>
        It is designed to be used on desktop.
      </p>
    </>
  );
};

interface ClientMDXComponentsProps {
  posts: Post[];
}

// Client component wrapper for MDX components
const ClientMDXComponents = ({ posts }: ClientMDXComponentsProps) => {
  // This component doesn't render anything itself
  // It's just used to access client-side functionality
  return null;
};

// Pre component that handles code blocks
export const Pre = ({ children }: { children: React.ReactNode }) => {
  // Handle code blocks
  const childrenArray = React.Children.toArray(children);
  const codeElement = childrenArray[0] as React.ReactElement;

  if (codeElement && codeElement.type === 'code') {
    return (
      <CodeBlock className={codeElement.props.className}>
        {codeElement.props.children}
      </CodeBlock>
    );
  }

  return <pre>{children}</pre>;
};

export {
  ColorVec4,
  WebGLFilters,
  Article,
  Duotone,
  Dither,
  MatrixColor,
  MathGrid,
}

// Article preview component
export const ArticlePreview = ({ slug, posts }: { slug: string; posts: Post[] }) => {
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;

  return (
    <div className="mb-20">
      <div className="w-[90%] max-w-[400px] mx-auto">
        <Article article={post} />
      </div>
    </div>
  );
};


export default ClientMDXComponents;
