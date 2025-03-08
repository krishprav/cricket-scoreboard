// components/MatchCard.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface MatchInfo {
  matchId: string;
  teams: string;
  score: string;
  status: string;
  event?: string;
  venue?: string;
}

interface Match {
  matchInfo: MatchInfo;
}

interface MatchCardProps {
  match: Match;
  initialUpdateTime?: string;
}

export default function MatchCard({ match, initialUpdateTime }: MatchCardProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(initialUpdateTime || 'Just now');
  const [currentMatch, setCurrentMatch] = useState<Match>(match);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Function to fetch latest match data
  const fetchLatestMatchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://cricket-backend-efj4.onrender.com/matches/${match.matchInfo.matchId}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) throw new Error('Failed to update match data');
      
      const data = await response.json();
      setCurrentMatch({ matchInfo: data });
      setLastUpdated('Just now');
    } catch (error) {
      console.error('Error updating match data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up polling for live matches
  useEffect(() => {
    const isLive = currentMatch.matchInfo.status.toLowerCase().includes('live') || 
                   currentMatch.matchInfo.status.toLowerCase().includes('in progress');
    
    if (isLive) {
      // Poll for updates every 30 seconds for live matches
      const intervalId = setInterval(() => {
        fetchLatestMatchData();
      }, 30000);
      
      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
  }, [currentMatch.matchInfo.status, currentMatch.matchInfo.matchId]);
  
  // Update the "last updated" text
  useEffect(() => {
    if (lastUpdated === 'Just now') {
      const timerId = setTimeout(() => {
        setLastUpdated('1m ago');
      }, 60000);
      
      return () => clearTimeout(timerId);
    }
  }, [lastUpdated]);
  
  // Split team names for better display
  const teamNames = currentMatch.matchInfo.teams.split(' vs ');
  
  // Determine if the match is live
  const isLive = currentMatch.matchInfo.status.toLowerCase().includes('live') || 
                 currentMatch.matchInfo.status.toLowerCase().includes('in progress');
  
  // Format score for better display
  const formattedScore = formatScore(currentMatch.matchInfo.score);
  
  return (
    <div className="card slide-in">
      <Link 
        href={`/match/${currentMatch.matchInfo.matchId}`}
        className="block glassmorphic rounded-xl transition-transform duration-300 hover:scale-105 overflow-hidden"
      >
        {/* Match event/series badge */}
        {currentMatch.matchInfo.event && (
          <div className="bg-teal-600 text-white px-3 py-1 text-xs font-semibold">
            {currentMatch.matchInfo.event}
          </div>
        )}
        
        <div className="p-5">
          {/* Live indicator */}
          {isLive && (
            <div className="flex items-center mb-3">
              <div className="live-indicator">
                <span>LIVE</span>
              </div>
              {isLoading ? (
                <span className="text-xs text-gray-400 ml-2 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-teal-400 mr-1 pulse"></span>
                  Updating...
                </span>
              ) : (
                <span className="text-xs text-gray-400 ml-2">
                  Updated: {lastUpdated}
                </span>
              )}
            </div>
          )}
          
          {/* Team names with aesthetic styling */}
          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <span className={`mr-2 ${teamNames[0].length > 15 ? 'text-base' : 'text-xl'}`}>
              {teamNames[0]}
            </span>
          </h3>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className={`mr-2 ${teamNames[1].length > 15 ? 'text-base' : 'text-xl'}`}>
              {teamNames[1]}
            </span>
          </h3>
          
          {/* Score with improved styling */}
          <div className="mb-4 glassmorphic p-3 rounded-lg">
            {formattedScore.map((scoreItem, index) => (
              <div key={index} className={`${isLive ? 'text-teal-300' : 'text-gray-300'} font-medium`}>
                {scoreItem}
              </div>
            ))}
          </div>
          
          {/* Match status with dynamic coloring */}
          <div className={`text-sm font-medium ${
            currentMatch.matchInfo.status.toLowerCase().includes('win') ? 'text-green-400' : 
            currentMatch.matchInfo.status.toLowerCase().includes('loss') ? 'text-red-400' : 
            isLive ? 'gradient-text' : 'text-amber-300'
          }`}>
            {currentMatch.matchInfo.status}
          </div>
          
          {/* Venue information if available */}
          {currentMatch.matchInfo.venue && (
            <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
              <div><i className="fas fa-map-marker-alt mr-1"></i> {currentMatch.matchInfo.venue}</div>
            </div>
          )}
          
          {/* View details button with enhanced styling */}
          <div className="mt-4 text-center">
            <button className="w-full py-2 bg-teal-600 bg-opacity-40 hover:bg-opacity-70 text-teal-300 text-sm font-medium rounded transition-colors">
              {isLive ? 'Watch Live' : 'View Details'}
            </button>
          </div>
        </div>
      </Link>
      
      {/* Manual refresh button for non-live matches */}
      {!isLive && (
        <button 
          onClick={fetchLatestMatchData}
          className="absolute top-2 right-2 text-gray-400 hover:text-teal-300 transition-colors p-1 rounded-full"
          aria-label="Refresh match data"
        >
          <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`}></i>
        </button>
      )}
    </div>
  );
}

// Helper function to format score
function formatScore(score: string): string[] {
  if (!score || score === 'No score') return ['Score not available'];
  
  // Split by & for different innings
  const innings = score.split(' & ');
  return innings;
}