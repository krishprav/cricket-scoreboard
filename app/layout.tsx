'use client'
import './globals.css';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';

// Define a NavItem component for cleaner code
const NavItem = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
  <Link 
    href={href} 
    className="flex items-center px-4 py-2 text-gray-200 hover:text-teal-300 transition-colors duration-300"
  >
    <span className="mr-2">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default function RootLayout({ children }: { children: ReactNode }) {
  const [viewCount, setViewCount] = useState<number>(0);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // Fetch actual view and online counts from your backend
  useEffect(() => {
    // Initial fetch of metrics
    fetchMetrics();
    
    // Set up regular polling for updates
    const intervalId = setInterval(fetchMetrics, 60000); // Update every minute
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchMetrics = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://cricket-backend-efj4.onrender.com/metrics');
      
      if (response.ok) {
        const data = await response.json();
        setViewCount(data.views || 0);
        setOnlineCount(data.online || 0);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Fallback to locally stored counts if API fails
      const storedViews = localStorage.getItem('viewCount');
      if (storedViews) {
        setViewCount(parseInt(storedViews, 10));
      }
      
      // Increment view count on page load when API fails
      if (!sessionStorage.getItem('viewCounted')) {
        const newCount = (parseInt(storedViews || '0', 10) + 1);
        setViewCount(newCount);
        localStorage.setItem('viewCount', newCount.toString());
        sessionStorage.setItem('viewCounted', 'true');
      }
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
        {/* Font Awesome for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-screen bg-cover bg-center bg-black" style={{ backgroundImage: "url('/stadium.jpg')", backgroundAttachment: 'fixed' }}>
        <div className="flex flex-col min-h-screen">
          <header className="fixed top-0 left-0 right-0 z-50 glassmorphic">
            <div className="container mx-auto flex justify-between items-center p-4">
              {/* Logo and brand */}
              <Link href="/" className="text-3xl font-bold text-teal-300 neon-text flex items-center">
                <i className="fas fa-cricket bounce mr-2"></i>
                Cricket Blitz
              </Link>
              
              {/* Navigation for desktop */}
              <nav className="hidden md:flex items-center space-x-1">
                <NavItem href="/matches" label="Live Matches" icon="🏏" />
                <NavItem href="/series" label="Series" icon="📅" />
                <NavItem href="/points" label="Points Table" icon="🏆" />
                <NavItem href="/stats" label="Player Stats" icon="📊" />
              </nav>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-white text-2xl transition-transform duration-300 ease-in-out"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
            
            {/* Mobile navigation */}
            <div className={`md:hidden glassmorphic overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="container mx-auto py-3 px-4 flex flex-col space-y-3">
                <NavItem href="/matches" label="Live Matches" icon="🏏" />
                <NavItem href="/series" label="Series" icon="📅" />
                <NavItem href="/points" label="Points Table" icon="🏆" />
                <NavItem href="/stats" label="Player Stats" icon="📊" />
              </div>
            </div>
          </header>
          
          <main className="flex-grow pt-24 pb-16">{children}</main>
          
          <footer className="glassmorphic p-3 text-center text-gray-200">
            <div className="container mx-auto">
              <div className="flex justify-center space-x-4 mb-2">
                <div className="glassmorphic px-4 py-2 rounded-full">
                  <i className="fas fa-eye mr-2"></i>
                  Views: <span className="font-bold text-teal-300">{viewCount.toLocaleString()}</span>
                </div>
                <div className="glassmorphic px-4 py-2 rounded-full">
                  <i className="fas fa-users mr-2"></i>
                  Online: <span className="font-bold text-teal-300">{onlineCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-center space-x-6 my-2">
                <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-300 transform hover:scale-125">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-300 transform hover:scale-125">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-300 transform hover:scale-125">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-300 transform hover:scale-125">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
              <p className="mt-4 text-sm">© {new Date().getFullYear()} Cricket Blitz. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}