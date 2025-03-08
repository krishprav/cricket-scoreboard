'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MatchDetailContent from '@/components/MatchDetailContent';
import Link from 'next/link';

interface MatchData {
  matchId: string;
  teams: string;
  score: string;
  crr: string;
  status: string;
  logos: { team1: string; team2: string };
  event?: string;
  commentary: string[];
  scorecard: {
    batting: { name: string; runs: string; balls: string; fours: string; sixes: string; sr: string }[];
    bowling: { name: string; overs: string; maidens: string; runs: string; wickets: string; noballs: string; wides: string; economy: string }[];
  };
  squads: { team1: string[]; team2: string[] };
}

// Create default empty match data to prevent errors
const defaultMatchData: MatchData = {
  matchId: '',
  teams: 'Team 1 vs Team 2',
  score: 'No score',
  crr: '0.0',
  status: 'No status',
  logos: { team1: '', team2: '' },
  commentary: [],
  scorecard: {
    batting: [],
    bowling: []
  },
  squads: { team1: [], team2: [] }
};

export default function MatchPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a small delay before retrying to avoid overwhelming the server
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`Fetching match data for ID: ${id}, attempt: ${retryCount + 1}`);
        
        // Use the full URL instead of relying on environment variables
        const response = await fetch(`https://cricket-backend-efj4.onrender.com/matches/${id}`, {
          // Add cache control headers to prevent stale data
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch match data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received match data:', data);
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Received empty data');
        }
        
        setMatchData(data);
      } catch (err) {
        console.error('Error fetching match data:', err);
        // Only set error after all retries
        if (retryCount >= 2) {
          setError('Unable to load match data. The match may have ended or there might be a temporary server issue.');
        } else {
          setRetryCount(prev => prev + 1);
        }
      } finally {
        if (retryCount >= 2 || !error) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchMatchData();
    }
  }, [id, retryCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glassmorphic p-8 rounded-xl text-center max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-teal-300 rounded-full animate-spin mb-4"></div>
            <div className="text-center text-white text-xl">Loading match data...</div>
            <p className="text-gray-300 mt-2 text-sm">
              {retryCount > 0 ? `Retry attempt ${retryCount} of 3...` : 'Connecting to server...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glassmorphic p-8 rounded-xl text-center max-w-md mx-auto">
          <div className="text-red-400 text-6xl mb-4">
            <span role="img" aria-label="error">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Match Unavailable</h2>
          <p className="text-white mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/matches" 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              <span className="mr-2">←</span> Back to Matches
            </Link>
            <button 
              onClick={() => {setRetryCount(0); setIsLoading(true);}}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use default data if matchData is null
  return (
    <div>
      <MatchDetailContent initialData={matchData || defaultMatchData} matchId={id} />
    </div>
  );
}