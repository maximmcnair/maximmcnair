import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Maxim McNair",
  description: "Design Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script
        defer
        data-domain="maximmcnair.com"
        src="/stats/js/script.js"
        data-api="/stats/api/event"
      ></script>
      <body className={`${inter.variable} antialiased bg-black text-white`}>{children}</body>
    </html>
  );
}
