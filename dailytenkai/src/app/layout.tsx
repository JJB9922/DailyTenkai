import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import "../../styles/globals.css";

const fragmentMono = Fragment_Mono({ weight: ['400'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Daily Tenkai",
  description: "Get your 10k in!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fragmentMono.className}>{children}</body>
    </html>
  );
}
