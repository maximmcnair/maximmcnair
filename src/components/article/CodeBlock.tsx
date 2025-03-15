'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const language = className ? className.replace('language-', '') : 'text';

  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{ borderRadius: '5px' }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
