'use client';

import MatchCard from '@/components/MatchCard';
import { useEffect, useState } from 'react';

interface MatchInfo {
  matchId: string;
  teams: string;
  score: string;
  status: string;
}

interface Match {
  matchInfo: MatchInfo;
}

interface MatchesClientProps {
  initialMatches: Match[];
  initialError: string | null;
}

export default function MatchesClient({ initialMatches, initialError }: MatchesClientProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://cricket-backend-efj4.onrender.com/matches', {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        const fetchedMatches = Array.isArray(data) ? data.map((item: MatchInfo) => ({ matchInfo: item })) : [];
        setMatches(fetchedMatches);
        setErrorMessage(fetchedMatches.length ? null : 'No live matches available at this time.');
      } catch (error: any) {
        setErrorMessage('Failed to load matches. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialMatches.length && !initialError) fetchMatches();

    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [initialMatches, initialError]);

  return (
    <div className="relative min-h-screen p-6">
      <h1
        className="text-5xl font-bold text-red-500 text-center mb-12 opacity-5 translate-y-[-20px] transition-all duration-800"
        style={{ opacity: 1, transform: 'translateY(0)' }}
      >
        LIVE CRICKET MATCHES
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-200 text-2xl">Loading...</div>
      ) : errorMessage ? (
        <div className="text-red-300 text-center text-2xl">{errorMessage}</div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 translate-y-20 transition-all duration-800"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          {matches.map((match) => (
            <MatchCard key={match.matchInfo.matchId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}