'use client'

import { useRef, useState } from "react";

interface VideoProps {
  src: string
  className: string
}

export function Video({ src, className }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <video
      ref={videoRef}
      controls={false}
      autoPlay
      preload="auto"
      loop
      poster={`${src}/-thumbnail.jpg`}
      className={className}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      muted
    >
      <source src={`/${src}.mp4`} type="video/mp4" />
      <source src={`/${src}.webm`} type="video/webm" />
      <source src={`/${src}.ogv`} type="video/ogg" />
      <source src={`/${src}.mov`} type="video/quicktime" />
      <div>
        <img src={`/${src}-thumbnail.jpg`} className="aspect-[2.5] w-full bg-gray-200" />
      </div>
    </video>

  )
}

