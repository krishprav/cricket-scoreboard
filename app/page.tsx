'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /matches on page load
    router.push('/matches');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="glassmorphic p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-teal-200 mb-2">Current Matches</h2>
          <p className="text-gray-200 mb-4">View live matches</p>
          <a href="/matches" className="text-amber-300 hover:text-teal-200 underline transition-colors duration-300">
            View Live Matches
          </a>
        </div>
        <div className="glassmorphic p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-teal-200 mb-2">Current & Future Series</h2>
          <p className="text-gray-200 mb-4">Explore ongoing and upcoming series soon...</p>
          <a href="#" className="text-amber-300 hover:text-teal-200 underline transition-colors duration-300">
            Coming Soon
          </a>
        </div>
        <div className="glassmorphic p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-teal-200 mb-2">Matches By Day</h2>
          <p className="text-gray-200 mb-4">Daily match schedule coming soon...</p>
          <a href="#" className="text-amber-300 hover:text-teal-200 underline transition-colors duration-300">
            Coming Soon
          </a>
        </div>
        <div className="glassmorphic p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-teal-200 mb-2">Points Table</h2>
          <p className="text-gray-200 mb-4">Points table data coming soon...</p>
          <a href="#" className="text-amber-300 hover:text-teal-200 underline transition-colors duration-300">
            Coming Soon
          </a>
        </div>
      </div>
    </div>
  );
}