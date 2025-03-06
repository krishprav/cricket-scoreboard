'use client';

import { useState, useEffect } from 'react';
import React from 'react'; 
import MatchDetailContent from '@/components/MatchDetailContent';

interface MatchData {
  teams: string;
  score: string;
  event?: string;
}

export default function MatchDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://cricket-backend-efj4.onrender.com/matches/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Match not found');
        return res.json();
      })
      .then((data) => setMatchData(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="text-red-300 text-center text-2xl">{error}</div>;
  if (!matchData) return <div className="text-gray-200 text-center text-xl">Loading...</div>;

  return (
    <div>
      <MatchDetailContent initialData={matchData} matchId={id} />
    </div>
  );
}