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

interface MatchDetailContentProps {
  initialData: MatchData;
  matchId: string;
}

export default function MatchDetailContent({ initialData, matchId }: MatchDetailContentProps) {
  const [matchData, setMatchData] = useState<MatchData>(initialData);
  const [celebration, setCelebration] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cricket-backend-efj4.onrender.com'; // Fallback

  useEffect(() => {
    const socket = new WebSocket(
      `${apiUrl.replace('http', 'ws')}/matches`
    );
    let isMounted = true;

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'subscribe', matchId }));
    };

    socket.onmessage = (event) => {
      if (isMounted) {
        const data = JSON.parse(event.data) as MatchData;
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
        fetch(`${apiUrl}/matches/${matchId}`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then((data: MatchData) => setMatchData((prev) => ({ ...prev, ...data })))
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

  const [team1, team2] = matchData.teams.split(' vs ') || ['Unknown', 'Unknown'];
  const defaultLogo = '/cricket-ball.png';

  return (
    <div className="relative min-h-screen">
      <div className="relative">
        {celebration && <Celebration type={celebration} />}
        <div className="glassmorphic p-6 rounded-xl shadow-lg mb-8 mx-auto max-w-4xl opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <div className="flex justify-center items-center mb-8">
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src={matchData.logos.team1 || defaultLogo}
                alt={`${team1} logo`}
                width={96}
                height={96}
                className="mr-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultLogo;
                }}
              />
            </Suspense>
            <div className="text-5xl font-bold text-teal-200 opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
              {matchData.score} (CRR: {matchData.crr})
            </div>
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src={matchData.logos.team2 || defaultLogo}
                alt={`${team2} logo`}
                width={96}
                height={96}
                className="ml-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultLogo;
                }}
              />
            </Suspense>
          </div>
          <ShareScorecard matchData={matchData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <Scoreboard matchData={matchData} />
          <BatterStats batters={matchData.scorecard.batting} />
          <BowlerStats bowlers={matchData.scorecard.bowling} />
          <div>
            <h3 className="text-teal-300 font-semibold mb-2">Player Cards</h3>
            <div className="flex flex-wrap gap-4">
              {matchData.scorecard.batting.map((player, index) => (
                <PlayerCard key={index} player={{ name: player.name, team: team1 }} />
              ))}
              {matchData.scorecard.bowling.map((player, index) => (
                <PlayerCard key={index + matchData.scorecard.batting.length} player={{ name: player.name, team: team2 }} />
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