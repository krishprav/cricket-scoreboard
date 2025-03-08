import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState('scorecard');
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState(refreshInterval);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Fetch new data when timer reaches 0
          fetchMatchData();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(refreshTimer);
  }, [refreshInterval]);

  const fetchMatchData = async () => {
    try {
      const response = await fetch(`https://cricket-backend-efj4.onrender.com/matches/${matchId}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('Failed to refresh match data');
      
      const data = await response.json();
      setMatchData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing match data:', error);
    }
  };

  // Extract team names from the "teams" string
  const teamNames = matchData.teams.split(' vs ');
  const team1 = teamNames[0] || 'Team 1';
  const team2 = teamNames[1] || 'Team 2';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/matches" className="text-teal-300 hover:text-teal-100 flex items-center">
          <span className="mr-2">←</span> Back to Matches
        </Link>
      </div>
      
      {/* Match Header */}
      <div className="glassmorphic p-6 mb-6 relative">
        {matchData.event && (
          <div className="text-amber-300 text-sm mb-2">{matchData.event}</div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full p-2">
              {matchData.logos.team1 ? (
                <img src={matchData.logos.team1} alt={team1} className="max-w-full max-h-full" />
              ) : (
                <div className="text-2xl font-bold text-teal-300">{team1.substring(0, 2)}</div>
              )}
            </div>
            
            <div className="text-2xl font-bold text-white">VS</div>
            
            <div className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full p-2">
              {matchData.logos.team2 ? (
                <img src={matchData.logos.team2} alt={team2} className="max-w-full max-h-full" />
              ) : (
                <div className="text-2xl font-bold text-teal-300">{team2.substring(0, 2)}</div>
              )}
            </div>
          </div>
          
          <div className="md:text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-300 mb-2">{matchData.teams}</h1>
            <div className="text-xl text-white font-medium">{matchData.score}</div>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-200">
                CRR: {matchData.crr}
              </div>
              <div className="bg-red-900 px-3 py-1 rounded-full text-sm text-gray-200">
                {matchData.status}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center">
          <span>Auto-refresh: {timeLeft}s</span>
          <button 
            onClick={() => fetchMatchData()} 
            className="ml-2 text-teal-400 hover:text-teal-300"
            title="Refresh now"
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'scorecard' ? 'bg-teal-700 text-white' : 'glassmorphic text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('scorecard')}
        >
          Scorecard
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'commentary' ? 'bg-teal-700 text-white' : 'glassmorphic text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('commentary')}
        >
          Commentary
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'squads' ? 'bg-teal-700 text-white' : 'glassmorphic text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('squads')}
        >
          Squads
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="glassmorphic p-6">
        {activeTab === 'scorecard' && (
          <div>
            <h2 className="text-xl font-bold text-teal-300 mb-4">Batting</h2>
            <div className="overflow-x-auto">
              <table className="w-full mb-6">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="px-4 py-2 text-gray-300">Batter</th>
                    <th className="px-4 py-2 text-gray-300 text-right">R</th>
                    <th className="px-4 py-2 text-gray-300 text-right">B</th>
                    <th className="px-4 py-2 text-gray-300 text-right">4s</th>
                    <th className="px-4 py-2 text-gray-300 text-right">6s</th>
                    <th className="px-4 py-2 text-gray-300 text-right">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.scorecard.batting.length > 0 ? (
                    matchData.scorecard.batting.map((batter, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-black bg-opacity-20' : ''}>
                        <td className="px-4 py-2 text-white">{batter.name}</td>
                        <td className="px-4 py-2 text-white text-right font-medium">{batter.runs}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{batter.balls}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{batter.fours}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{batter.sixes}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{batter.sr}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 text-gray-400 text-center">No batting data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <h2 className="text-xl font-bold text-teal-300 mb-4">Bowling</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="px-4 py-2 text-gray-300">Bowler</th>
                    <th className="px-4 py-2 text-gray-300 text-right">O</th>
                    <th className="px-4 py-2 text-gray-300 text-right">M</th>
                    <th className="px-4 py-2 text-gray-300 text-right">R</th>
                    <th className="px-4 py-2 text-gray-300 text-right">W</th>
                    <th className="px-4 py-2 text-gray-300 text-right">NB</th>
                    <th className="px-4 py-2 text-gray-300 text-right">WD</th>
                    <th className="px-4 py-2 text-gray-300 text-right">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.scorecard.bowling.length > 0 ? (
                    matchData.scorecard.bowling.map((bowler, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-black bg-opacity-20' : ''}>
                        <td className="px-4 py-2 text-white">{bowler.name}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.overs}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.maidens}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.runs}</td>
                        <td className="px-4 py-2 text-white text-right font-medium">{bowler.wickets}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.noballs}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.wides}</td>
                        <td className="px-4 py-2 text-gray-300 text-right">{bowler.economy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-2 text-gray-400 text-center">No bowling data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'commentary' && (
          <div>
            <h2 className="text-xl font-bold text-teal-300 mb-4">Live Commentary</h2>
            {matchData.commentary.length > 0 ? (
              <div className="space-y-4">
                {matchData.commentary.map((comment, index) => (
                  <div key={index} className={`p-3 rounded ${index === 0 ? 'bg-gray-800' : 'border-b border-gray-700'}`}>
                    <p className="text-white">{comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6">
                No commentary available for this match yet
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'squads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-teal-300 mb-4">{team1}</h2>
              {matchData.squads.team1.length > 0 ? (
                <ul className="space-y-2">
                  {matchData.squads.team1.map((player, index) => (
                    <li key={index} className="text-white">
                      {player}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Squad information not available</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-300 mb-4">{team2}</h2>
              {matchData.squads.team2.length > 0 ? (
                <ul className="space-y-2">
                  {matchData.squads.team2.map((player, index) => (
                    <li key={index} className="text-white">
                      {player}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Squad information not available</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400 mt-2 text-right">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}