'use client';
import { useState } from 'react';
interface MatchData {
  teams: string;
  score: string;
  event?: string;
  players?: { name: string; team: string }[];
}

export default function Squads({ matchData }: { matchData: MatchData }) {
  const [showSquads, setShowSquads] = useState(false);
  const teams = matchData.teams?.split(' vs ') || ['Wellington', 'Otago'];
  const team1 = teams[0];
  const team2 = teams[1];
  const players = matchData.players || [];

  const team1Players = players.filter(player => player.team === team1);
  const team2Players = players.filter(player => player.team === team2);

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold" onClick={() => setShowSquads(!showSquads)}>
        Squads {showSquads ? '▼' : '▶'}
      </h3>
      {showSquads && (
        <div>
          <div>
            <h4 className="text-amber-200">{team1}</h4>
            {team1Players.map((player, i) => <p key={i} className="text-white">{player.name}</p>)}
          </div>
          <div>
            <h4 className="text-amber-200">{team2}</h4>
            {team2Players.map((player, i) => <p key={i} className="text-white">{player.name}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
