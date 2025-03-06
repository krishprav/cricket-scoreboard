'use client';

import { useState } from 'react';

interface MatchData {
  teams: string;
  score: string;
  event?: string;
  squads: { team1: string[]; team2: string[] };
}

export default function Squads({ matchData }: { matchData: MatchData }) {
  const [showSquads, setShowSquads] = useState(false);
  const [team1, team2] = matchData.teams.split(' vs ') || ['Unknown', 'Unknown'];

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold" onClick={() => setShowSquads(!showSquads)}>
        Squads {showSquads ? '▼' : '▶'}
      </h3>
      {showSquads && (
        <div>
          <div>
            <h4 className="text-amber-200">{team1}</h4>
            {matchData.squads.team1.length > 0 ? (
              matchData.squads.team1.map((player, i) => <p key={i} className="text-white">{player}</p>)
            ) : (
              <p className="text-gray-400">No players available</p>
            )}
          </div>
          <div>
            <h4 className="text-amber-200">{team2}</h4>
            {matchData.squads.team2.length > 0 ? (
              matchData.squads.team2.map((player, i) => <p key={i} className="text-white">{player}</p>)
            ) : (
              <p className="text-gray-400">No players available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}