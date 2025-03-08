'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [wsError, setWsError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Function to fetch data via HTTP as fallback
    const fetchDataFallback = async () => {
      try {
        setIsPolling(true);
        const response = await fetch(`https://cricket-backend-efj4.onrender.com/matches/${matchId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMatchData((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Fetch fallback error:', err);
      }
    };

    // Try WebSocket first
    try {
      const socket = new WebSocket(`wss://cricket-backend-efj4.onrender.com/matches`);
      let isMounted = true;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setWsError(null);
        socket.send(JSON.stringify({ type: 'subscribe', matchId }));
      };

      socket.onmessage = (event) => {
        if (isMounted) {
          try {
            const data = JSON.parse(event.data) as MatchData;
            setMatchData((prev) => ({ ...prev, ...data }));
            
            if (data.event) {
              setCelebration(data.event);
              setTimeout(() => setCelebration(null), 3000);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsError('WebSocket connection failed, falling back to HTTP polling');
        
        // Fall back to HTTP polling
        fetchDataFallback();
        
        // Set up polling interval
        const pollInterval = setInterval(fetchDataFallback, 10000); // Poll every 10 seconds
        
        return () => clearInterval(pollInterval);
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
        if (isMounted && !wsError) {
          setWsError('WebSocket connection closed, falling back to HTTP polling');
          
          // Fall back to HTTP polling
          fetchDataFallback();
          
          // Set up polling interval
          const pollInterval = setInterval(fetchDataFallback, 10000);
          
          return () => clearInterval(pollInterval);
        }
      };

      return () => {
        isMounted = false;
        socket.close();
      };
    } catch (err) {
      console.error('Error setting up WebSocket:', err);
      setWsError('Failed to establish WebSocket connection, falling back to HTTP polling');
      
      // Fall back to HTTP polling immediately
      fetchDataFallback();
      
      // Set up polling interval
      const pollInterval = setInterval(fetchDataFallback, 10000);
      
      return () => clearInterval(pollInterval);
    }
  }, [matchId]);

  const [team1, team2] = matchData.teams.split(' vs ') || ['Unknown', 'Unknown'];
  const defaultLogo = '/cricket-ball.png';

  return (
    <div className="relative min-h-screen p-4">
      <div className="mb-4">
        <Link href="/matches" className="text-teal-300 hover:text-teal-100 transition-colors">
          &larr; Back to All Matches
        </Link>
      </div>
      
      {wsError && (
        <div className="glassmorphic p-2 mb-4 rounded-xl bg-yellow-800 bg-opacity-30">
          <p className="text-yellow-200 text-sm">{wsError}</p>
        </div>
      )}
      
      <div className="relative">
        {celebration && <Celebration type={celebration} />}
        <div className="glassmorphic p-6 rounded-xl shadow-lg mb-8 mx-auto max-w-4xl opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <div className="flex justify-center items-center mb-8">
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src={matchData.logos?.team1 || defaultLogo}
                alt={`${team1} logo`}
                width={96}
                height={96}
                className="mr-8"
                onError={(e) => { (e.target as HTMLImageElement).src = defaultLogo; }}
              />
            </Suspense>
            <div className="text-3xl md:text-5xl font-bold text-teal-200 text-center opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
              {matchData.score || 'Score not available'} 
              <div className="text-base md:text-xl">(CRR: {matchData.crr || '0.0'})</div>
            </div>
            <Suspense fallback={<div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>}>
              <Image
                src={matchData.logos?.team2 || defaultLogo}
                alt={`${team2} logo`}
                width={96}
                height={96}
                className="ml-8"
                onError={(e) => { (e.target as HTMLImageElement).src = defaultLogo; }}
              />
            </Suspense>
          </div>
          <ShareScorecard matchData={matchData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto opacity-0 translate-y-20 transition-all duration-800" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <Scoreboard matchData={matchData} />
          <BatterStats batters={matchData.scorecard?.batting || []} />
          <BowlerStats bowlers={matchData.scorecard?.bowling || []} />
          <div className="glassmorphic p-4 rounded-xl">
            <h3 className="text-teal-300 font-semibold mb-2">Player Cards</h3>
            <div className="flex flex-wrap gap-4">
              {matchData.scorecard?.batting && matchData.scorecard.batting.map((player, index) => (
                <PlayerCard key={index} player={{ name: player.name, team: team1 }} />
              ))}
              {matchData.scorecard?.bowling && matchData.scorecard.bowling.map((player, index) => (
                <PlayerCard key={index + (matchData.scorecard?.batting?.length || 0)} player={{ name: player.name, team: team2 }} />
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