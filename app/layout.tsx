import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {}
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/stadium.jpg')", backgroundAttachment: 'fixed' }}>
        <div className="relative">
          <header className="fixed top-0 left-0 right-0 z-50 glassmorphic p-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-teal-300 neon-text">Cricket Blitz</Link>
          </header>
          <main className="pt-20 pb-12">{children}</main>
          <footer className="glassmorphic p-4 mt-auto text-center text-gray-200">
            <p>Views: <span id="viewCount">0</span> | Online: <span id="onlineCount">0</span></p>
          </footer>
        </div>
      </body>
    </html>
  );
}