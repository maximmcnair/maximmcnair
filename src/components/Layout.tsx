import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto px-6 mt-6 max-w-[1200px]">
      {children}
    </div>
  )
}
