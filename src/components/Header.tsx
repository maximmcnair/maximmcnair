import Link from "next/link";

export function Header() {
  return (
    <header
      id="header"
      className="mb-8 flex flex-row justify-between opacity-0 animate-fadein"
    >
      <Link href="/">
        <h1 className="flex w-full text-center font-semibold text-sm lg:text-xl">
          Maxim McNair
        </h1>
      </Link>

      <nav className="flex gap-6">
        <Link
          href="/"
          className="font-semibold text-white/60 hover:text-white transition"
        >
          Work
        </Link>
        <Link
          href="/about"
          className="font-semibold text-white/60 hover:text-white transition"
        >
          About
        </Link>
        <Link
          href="/exploration"
          className="hidden font-semibold text-white/60 hover:text-white transition"
        >
          Exploration
        </Link>
        <Link
          href="/webgl-image-processing"
          className="font-semibold text-white/60 hover:text-white transition"
        >
          Articles
        </Link>
      </nav>
    </header>
  );
}
