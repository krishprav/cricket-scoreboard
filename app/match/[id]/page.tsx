'use client';

import React, { useState, useEffect } from 'react';
import MatchDetailContent from '@/components/MatchDetailContent';

interface Params {
  id: string;
}

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

export default function MatchPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the full URL instead of relying on environment variables
        const response = await fetch(`https://cricket-backend-efj4.onrender.com/matches/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch match data: ${response.status}`);
        }
        
        const data = await response.json();
        setMatchData(data);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Match not found or server error. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glassmorphic p-8 rounded-xl text-center">
          <div className="text-center text-white text-xl">Loading match data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glassmorphic p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <a 
            href="/matches" 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Matches
          </a>
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