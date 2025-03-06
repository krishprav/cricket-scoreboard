'use client';

import { useState } from 'react';

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
          <p className="text-amber-200">{matchData.score} (CRR: {matchData.crr})</p>
          <p className="text-emerald-200">{matchData.status || 'No status'}</p>
          <p className="text-yellow-300">{matchData.event || 'No event'}</p>
        </div>
      )}
    </div>
  );
}