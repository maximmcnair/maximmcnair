"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Work",
    isActive: (pathname: string) => pathname === "/",
  },
  {
    href: "/about",
    label: "About",
    isActive: (pathname: string) => pathname === "/about",
  },
  {
    href: "/exploration",
    label: "Exploration",
    isActive: (pathname: string) => pathname === "/exploration",
    hidden: true,
  },
  {
    href: "/webgl-image-processing",
    label: "Articles",
    isActive: (pathname: string) =>
      pathname === "/webgl-image-processing" || pathname.startsWith("/p/"),
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      id="header"
      className="mt-8 mb-6 flex flex-row justify-between opacity-0 animate-fadein"
    >
      <Link href="/">
        <h1 className="flex w-full text-center font-semibold text-sm lg:text-lg">
          Maxim McNair
        </h1>
      </Link>

      <nav className="flex gap-6">
        {navItems.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                item.hidden ? "hidden" : "",
                "font-semibold transition",
                active ? "text-white" : "text-white/60 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
