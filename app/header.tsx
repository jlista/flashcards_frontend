'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-1 h-20">
      <span className="float-left text-xl">Flashcards</span>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </div>
  );
}
