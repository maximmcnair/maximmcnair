import Link from "next/link";
import React from "react";

interface Props {}

export const Nav: React.FC<Props> = ({}) => {
  return (
    <nav className="nav">
      <Link href="/" passHref>
        <span className="nav-link">Maxim McNair</span>
      </Link>
    </nav>
  );
};
