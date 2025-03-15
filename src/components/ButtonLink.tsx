'use client'

import Link from 'next/link';

interface ButtonLinkProps {
  href: string;
  text: string;
}

export function ButtonLink({
  href,
  text,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className='text-black font-semibold bg-white hover:bg-white-800 transition-colors duration-400 cursor-pointer pt-[9px] pb-[8px] pl-6 pr-4 rounded-3xl inline-flex whitespace-nowrap relative'
    >
      {text}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 lucide lucide-arrow-up-right">
        <path d="M7 7h10v10" /><path d="M7 17 17 7" />
      </svg>
    </Link>
  );
}

