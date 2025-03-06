'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MatchInfo {
  matchId: string;
  teams: string;
  score: string;
  status: string;
}

interface MatchCardProps {
  match: {
    matchInfo: MatchInfo;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  console.log('MatchCard match prop:', match);

  const matchInfo = match?.matchInfo || { matchId: '', teams: 'Unknown vs Unknown', score: 'N/A', status: 'Unknown' };

  return (
    <div
      className="glassmorphic p-6 rounded-xl shadow-glass cursor-pointer hover:shadow-neon transition-all duration-300 hover:scale-105 relative"
      onClick={() => router.push(`/match/${matchInfo.matchId}`)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <h2 className="text-3xl font-semibold text-teal-300 mb-2 text-center">{matchInfo.teams}</h2>
      <p className="text-gray-100 text-xl text-center">{matchInfo.score || 'Score not available'}</p>
      <p className="text-emerald-300 text-lg text-center">{matchInfo.status || 'Status unknown'}</p>
      {showTooltip && (
        <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs p-2 rounded shadow-lg">
          Click for details
        </div>
      )}
    </div>
  );
}