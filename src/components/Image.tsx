'use client'

import React, { useState, useEffect, useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function Image({ src, alt, className }: ImageProps) {
  const refImage = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = src || '';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    }
  }, [src]);

  return (
    <img
      ref={refImage}
      src={src}
      alt={alt}
      className={`block transition-opacity duration-500 ease-in ${className || ''}`}
      style={{
        // minHeight: error ? 'auto' : '20px',
        opacity: imageLoaded ? 1 : 0,
      }}
    />
  );
};

