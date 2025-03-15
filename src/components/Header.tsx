import Link from "next/link";

export function Header() {
  return (
    <header id="header" className="mb-8 flex flex-row justify-between opacity-0 animate-fadein">
      <Link href="/">
        <h1 className="flex w-full text-center font-bold text-sm lg:text-xl">Maxim McNair</h1>
      </Link>

      <nav className="flex gap-3">
        <Link href="/" className="font-medium">Work</Link>
        <Link href="/#exploration" className="font-medium">Exploration</Link>
        <Link href="/webgl-image-processing" className="font-medium">Articles</Link>
      </nav>
    </header>
  )
}
