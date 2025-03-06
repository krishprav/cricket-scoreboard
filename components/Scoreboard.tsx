'use client';

import { useState } from 'react';

interface MatchData {
  teams: string;
  score: string;
  event?: string;
}

export default function Scoreboard({ matchData }: { matchData: MatchData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-xl text-teal-200 font-semibold mb-2" onClick={() => setIsOpen(!isOpen)}>
        Scoreboard {isOpen ? '▼' : '▶'}
      </h3>
      {isOpen && (
        <div>
          <p className="text-white">{matchData.teams}</p>
          <p className="text-amber-200">{matchData.score}</p>
          <p className="text-emerald-200">{matchData.event || 'No event'}</p>
        </div>
      )}
    </div>
  );
}