'use client'
import './globals.css';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import NavItem from '../components/NavItem';

export default function RootLayout({ children }: { children: ReactNode }) {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/stadium.jpg')", backgroundAttachment: 'fixed' }}
      >
        <div className="relative">
          <header className="fixed top-0 left-0 right-0 z-50 glassmorphic p-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-teal-300 neon-text">
              Cricket Blitz
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavItem href="/matches" label="Live Matches" icon="🏏" />
              <NavItem href="/series" label="Series" icon="📅" />
              <NavItem href="/points" label="Points Table" icon="🏆" />
              <NavItem href="/stats" label="Player Stats" icon="📊" />
              <NavItem href="/cricket-blitz" label="Cricket Blitz" icon="🎮" />
            </nav>
            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </header>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden glassmorphic overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="container mx-auto py-3 px-4 flex flex-col space-y-3">
              <NavItem href="/matches" label="Live Matches" icon="🏏" />
              <NavItem href="/series" label="Series" icon="📅" />
              <NavItem href="/points" label="Points Table" icon="🏆" />
              <NavItem href="/stats" label="Player Stats" icon="📊" />
              <NavItem href="/cricket-blitz" label="Cricket Blitz" icon="🎮" />
            </div>
          </div>

          <main className="pt-20 pb-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
