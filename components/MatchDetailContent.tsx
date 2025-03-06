'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Scoreboard from './Scoreboard';
import ShareScorecard from './ShareScorecard';
import Celebration from './Celebration';
import Squads from './Squads';
import Highlights from './Highlights';
import FullCommentary from './FullCommentary';
import BatterStats from './BatterStats';
import BowlerStats from './BowlerStats';
import PlayerCard from './PlayerCard';

interface MatchData {
  teams: string;
  score: string;
  event?: string;
  batters?: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number }[];
  bowlers?: { name: string; overs: number; maidens: number; runs: number; wickets: number; noBalls: number; wides: number; economy: number }[];
  players?: { name: string; team: string }[];
}

interface MatchDetailContentProps {
  initialData: MatchData;
  matchId: string;
}

export default function MatchDetailContent({ initialData, matchId }: MatchDetailContentProps) {
  const [matchData, setMatchData] = useState<MatchData>(initialData);
  const [celebration, setCelebration] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://cricket-backend-efj4.onrender.com/matches/v1/recent');
    let isMounted = true;

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'subscribe', matchId }));
    };

    socket.onmessage = (event) => {
      if (isMounted) {
        const data = JSON.parse(event.data);
        setMatchData((prev) => ({ ...prev, ...data }));
        if (data.event) {
          setCelebration(data.event);
          setTimeout(() => setCelebration(null), 3000);
        }
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error details:', error);
      if (isMounted) {
        fetch(`https://cricket-backend-efj4.onrender.com/matches/${matchId}`)
          .then((res) => res.json())
          .then((data) => setMatchData((prev) => ({ ...prev, ...data })))
          .catch((err) => console.error('Fetch fallback error:', err));
      }
    };

    socket.onclose = () => console.log('WebSocket closed');

    return () => {
      isMounted = false;
      socket.close();
    };
  }, [matchId]);

  if (!matchData) return <div className="text-center text-white text-xl opacity-0 transition-opacity duration-800" style={{ opacity: 1 }}>Loading...</div>;

  const team1 = matchData.teams?.split(' vs ')[0] || 'Wellington';
  const team2 = matchData.teams?.split(' vs ')[1] || 'Otago';
  const score = matchData.score || '0/0';
  const batters = matchData.batters || [];
  const bowlers = matchData.bowlers || [];
  const players = matchData.players || [];

  return (
    <div className="relative min-h-screen">
      <div className="relative">
        {celebration && <Celebration type={celebration} />}
        <div className="glassmorphic p-6 rounded-xl shadow-lg mb-8 mx-auto max-w-4xl opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <div className="flex justify-center items-center mb-8">
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src="/team1.png"
                alt={`${team1} logo`}
                width={96}
                height={96}
                className="mr-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cricket-ball.png';
                }}
              />
            </Suspense>
            <div className="text-5xl font-bold text-teal-200 opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
              {score}
            </div>
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src="/team2.png"
                alt={`${team2} logo`}
                width={96}
                height={96}
                className="ml-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cricket-ball.png';
                }}
              />
            </Suspense>
          </div>
          <ShareScorecard matchData={matchData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <Scoreboard matchData={matchData} />
          <BatterStats batters={batters} />
          <BowlerStats bowlers={bowlers} />
          <div>
            <h3 className="text-teal-300 font-semibold mb-2">Player Cards</h3>
            <div className="flex flex-wrap gap-4">
              {players.map((player, index) => (
                <PlayerCard key={index} player={player} />
              ))}
            </div>
          </div>
          <Squads matchData={matchData} />
          <Highlights matchId={matchId} />
          <FullCommentary matchData={matchData} />
        </div>
      </div>
    </div>
  );
}