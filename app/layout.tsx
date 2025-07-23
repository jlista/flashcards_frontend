import type { Metadata } from 'next';

import './globals.css';

import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Flashcards App',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="p-2 bg-gray-800 text-white flex gap-4">
          <div className="flex w-1 h-10 flex-row space-x-4">
            <span className="float-left text-xl">
              <Link href="/">Flashcards</Link>
            </span>
            <span className="space-x-4 opacity-75">
              <Link href="/deck">Deck</Link>
              <Link href="/about">Help</Link>
            </span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
