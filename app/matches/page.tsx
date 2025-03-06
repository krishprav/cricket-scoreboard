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

export default async function Matches() {
  let matches: Match[] = [];
  let errorMessage: string | null = null;
  let isLoading = true;

  try {
    const response = await fetch('https://cricket-backend-efj4.onrender.com/matches', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch matches');
    const data = await response.json();
    matches = Array.isArray(data) ? data.map(item => ({ matchInfo: item })) : [];
    console.log('Fetched matches:', matches);
    if (!matches.length) {
      errorMessage = 'No live matches available at this time.';
    }
  } catch (error: any) {
    console.error('Error fetching matches:', error.message);
    errorMessage = 'Failed to load matches. Please try again.';
  } finally {
    isLoading = false;
  }

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