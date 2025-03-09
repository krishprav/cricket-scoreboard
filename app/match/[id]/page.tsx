'use client';

// app/match/[id]/page.jsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Define types for your match data
interface MatchData {
  series: string;
  title: string;
  venue: string;
  status: string;
  score?: string;
  currentPartnership?: string;
  recentOvers?: string;
  teams: {
    team1: string;
    team2: string;
  } | string;
  battingStats?: BattingStats[];
  bowlingStats?: BowlingStats[];
  format?: string;
  squads?: Record<string, string[]>;
}

interface BattingStats {
  name: string;
  team: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  status: string;
}

// Add this interface for bowling stats
interface BowlingStats {
  name: string;
  team: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

// Define interface for commentary items
interface CommentaryItem {
  type?: 'wicket' | 'four' | 'six' | 'regular';
  over?: string;
  text: string;
}

export default function MatchDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [commentary, setCommentary] = useState<CommentaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const wsRef = useRef<WebSocket | null>(null);
  const commentaryEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;

    // Setup WebSocket connection
    wsRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'}`);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to match updates
      wsRef.current.send(JSON.stringify({
        action: 'subscribe',
        matchId: id
      }));
      
      // Subscribe to commentary
      wsRef.current.send(JSON.stringify({
        action: 'subscribe_commentary',
        matchId: id
      }));
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'match_update') {
        setMatchData(data.data);
        setLoading(false);
      } else if (data.type === 'commentary_update') {
        setCommentary(data.data.commentary || []);
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to server. Falling back to API...');
      fetchMatchDataFromAPI();
    };
    
    // Fallback to REST API if WebSocket fails
    const fetchMatchDataFromAPI = async () => {
      try {
        const matchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/matches/${id}`);
        if (!matchResponse.ok) throw new Error('Failed to fetch match data');
        const matchData = await matchResponse.json();
        setMatchData(matchData);
        
        const commentaryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/matches/${id}/commentary`);
        if (commentaryResponse.ok) {
          const commentaryData = await commentaryResponse.json();
          setCommentary(commentaryData.commentary || []);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error loading match: ' + err.message);
        setLoading(false);
      }
    };
    
    // Clean up WebSocket on unmount
  return () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'unsubscribe',
        matchId: id
      }));
      wsRef.current.close();
    }
  };
}, [id]);

  // Scroll to bottom of commentary when new comments arrive
  useEffect(() => {
    if (activeTab === 'commentary' && commentaryEndRef.current) {
      commentaryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentary, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
          <div className="mt-4">
            <Link href="/" className="text-blue-700 hover:underline">← Back to matches</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!matchData) return null;

  // Helper for team colors
  const getTeamColor = (teamName) => {
    const colorMap = {
      'India': 'bg-blue-600',
      'Australia': 'bg-yellow-500',
      'England': 'bg-blue-500',
      'Pakistan': 'bg-green-600',
      'New Zealand': 'bg-black',
      'South Africa': 'bg-green-700',
      'West Indies': 'bg-red-700',
      'Sri Lanka': 'bg-blue-800',
      'Bangladesh': 'bg-green-500'
    };
    
    // Find the key that is contained in teamName
    for (const [key, value] of Object.entries(colorMap)) {
      if (teamName && teamName.includes(key)) {
        return value;
      }
    }
    
    return 'bg-gray-600'; // Default color
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Cricket Live</Link>
            <Link href="/predictor" className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium">
              Predict This Match
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-700 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
            Back to matches
          </Link>
        </div>

        {/* Match Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="text-xs font-semibold text-gray-500 mb-2">{matchData.series}</div>
          <h1 className="text-2xl font-bold text-gray-800">{matchData.title}</h1>
          <div className="mt-2 text-sm text-gray-600">{matchData.venue}</div>
          <div className={`mt-2 px-3 py-1 inline-block rounded-full text-sm font-medium ${matchData.status && matchData.status.toLowerCase().includes('live') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {matchData.status}
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Score</h2>
          
          {matchData.score ? (
            <div className="text-lg font-medium">{matchData.score}</div>
          ) : (
            <div className="text-gray-500">Match not started yet</div>
          )}
          
          {matchData.currentPartnership && (
            <div className="mt-3 text-sm text-gray-700">
              <span className="font-medium">Current Partnership:</span> {matchData.currentPartnership}
            </div>
          )}
          
          {matchData.recentOvers && (
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-700">Recent Overs:</div>
              <div className="mt-1 p-2 bg-gray-100 rounded text-sm">{matchData.recentOvers}</div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'overview' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('scorecard')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'scorecard' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
            >
              Scorecard
            </button>
            <button 
              onClick={() => setActiveTab('commentary')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'commentary' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
            >
              Commentary
            </button>
            <button 
              onClick={() => setActiveTab('squads')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'squads' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
            >
              Teams
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-bold text-lg mb-3">Match Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium mb-2">{matchData.teams && typeof matchData.teams === 'object' ? matchData.teams.team1 : (matchData.teams || '').split(' vs ')[0]}</div>
                    {matchData.battingStats && matchData.battingStats
                      .filter(b => b.team.includes(matchData.teams && typeof matchData.teams === 'object' ? matchData.teams.team1 : (matchData.teams || '').split(' vs ')[0]))
                      .slice(0, 2)
                      .map((batsman, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span>{batsman.name}</span>
                          <span className="font-medium">{batsman.runs} ({batsman.balls})</span>
                        </div>
                      ))}
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium mb-2">{matchData.teams && typeof matchData.teams === 'object' ? matchData.teams.team2 : (matchData.teams || '').split(' vs ')[1]}</div>
                    {matchData.battingStats && matchData.battingStats
                      .filter(b => b.team.includes(matchData.teams && typeof matchData.teams === 'object' ? matchData.teams.team2 : (matchData.teams || '').split(' vs ')[1]))
                      .slice(0, 2)
                      .map((batsman, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span>{batsman.name}</span>
                          <span className="font-medium">{batsman.runs} ({batsman.balls})</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                {matchData.format && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Format:</span> {matchData.format}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'scorecard' && (
              <div>
                <h3 className="font-bold text-lg mb-3">Scorecard</h3>
                {matchData.battingStats && matchData.battingStats.length > 0 ? (
                  <div>
                    {/* Group batting stats by team */}
                    {Array.from(new Set(matchData.battingStats.map(b => b.team))).map((team, teamIndex) => (
                      <div key={teamIndex} className="mb-6">
                        <h4 className="font-medium text-md mb-2">{team}</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batsman</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">4s</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">6s</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matchData.battingStats
                                .filter(batsman => batsman.team === team)
                                .map((batsman, index) => (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 text-sm">{batsman.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{batsman.status}</td>
                                    <td className="px-4 py-2 text-sm text-center font-medium">{batsman.runs}</td>
                                    <td className="px-4 py-2 text-sm text-center">{batsman.balls}</td>
                                    <td className="px-4 py-2 text-sm text-center">{batsman.fours}</td>
                                    <td className="px-4 py-2 text-sm text-center">{batsman.sixes}</td>
                                    <td className="px-4 py-2 text-sm text-center">{batsman.strikeRate}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                    
                    {/* Bowling Stats */}
                    {matchData.bowlingStats && matchData.bowlingStats.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-bold text-lg mb-3">Bowling Stats</h3>
                        {Array.from(new Set(matchData.bowlingStats.map(b => b.team))).map((team, teamIndex) => (
                          <div key={teamIndex} className="mb-6">
                            <h4 className="font-medium text-md mb-2">{team}</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bowler</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">O</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ECON</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {matchData.bowlingStats
                                    .filter(bowler => bowler.team === team)
                                    .map((bowler, index) => (
                                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-2 text-sm">{bowler.name}</td>
                                        <td className="px-4 py-2 text-sm text-center">{bowler.overs}</td>
                                        <td className="px-4 py-2 text-sm text-center">{bowler.maidens}</td>
                                        <td className="px-4 py-2 text-sm text-center">{bowler.runs}</td>
                                        <td className="px-4 py-2 text-sm text-center font-medium">{bowler.wickets}</td>
                                        <td className="px-4 py-2 text-sm text-center">{bowler.economy}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">Scorecard not available yet</div>
                )}
              </div>
            )}

            {activeTab === 'commentary' && (
              <div>
                <h3 className="font-bold text-lg mb-3">Live Commentary</h3>
                <div className="bg-gray-50 rounded p-2 max-h-96 overflow-y-auto">
                  {commentary && commentary.length > 0 ? (
                    <div>
                      {commentary.map((comm, index) => (
                        <div key={index} className={`p-2 mb-2 rounded ${
                          comm.type === 'wicket' ? 'bg-red-50 border-l-4 border-red-500' :
                          comm.type === 'four' ? 'bg-blue-50 border-l-4 border-blue-500' :
                          comm.type === 'six' ? 'bg-purple-50 border-l-4 border-purple-500' :
                          'bg-white'
                        }`}>
                          {comm.over && <div className="text-xs font-bold text-gray-500">{comm.over}</div>}
                          <div className="text-sm">{comm.text}</div>
                        </div>
                      ))}
                      <div ref={commentaryEndRef} />
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">No commentary available yet</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'squads' && (
              <div>
                <h3 className="font-bold text-lg mb-3">Team Squads</h3>
                {matchData.squads ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(matchData.squads).map(([team, players], i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">{team}</h4>
                        <ul className="space-y-1">
                          {players.map((player, j) => (
                            <li key={j} className="text-sm">{player}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Squad information not available yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© {new Date().getFullYear()} Cricket Live. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">
              Data provided by CricBuzz. Not affiliated with any official cricket organization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
