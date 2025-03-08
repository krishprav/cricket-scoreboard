import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, TrendingUp, Award, Calendar, Users } from 'lucide-react';

// API configuration
const API_BASE_URL = 'https://cricket-backend-efj4.onrender.com'; // Your actual backend URL

// Helper function to handle API requests with error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
};

const CricketBlitz = () => {
  const [activeTab, setActiveTab] = useState('predictions');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  
  // State for data
  const [predictions, setPredictions] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [teamRankings, setTeamRankings] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [metrics, setMetrics] = useState({ views: 0, online: 0 });
  
  // Function to fetch real-time AI predictions
  const fetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/predictions`);
      setPredictions(data);
    } catch (err) {
      setError('Failed to load AI predictions. Please try again.');
      console.error('Error fetching predictions:', err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch live matches
  const fetchMatches = async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/matches`);
      setLiveMatches(data);
      
      // Setup WebSocket connections for each match
      data.forEach(match => {
        setupMatchWebSocket(match.id);
      });
    } catch (err) {
      console.error('Error fetching matches:', err.message);
    }
  };
  
  // Function to fetch player stats
  const fetchPlayerStats = async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/players`);
      setPlayerStats(data);
    } catch (err) {
      console.error('Error fetching player stats:', err.message);
    }
  };
  
  // Function to fetch team rankings
  const fetchTeamRankings = async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/rankings`);
      setTeamRankings(data);
    } catch (err) {
      console.error('Error fetching team rankings:', err.message);
    }
  };
  
  // Function to fetch metrics
  const fetchMetrics = async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/metrics`);
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err.message);
    }
  };
  
  // Setup WebSocket for real-time match updates
  const setupMatchWebSocket = (matchId) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProtocol}//${API_BASE_URL.replace(/^https?:\/\//, '')}/matches/${matchId}/live`);
    
    ws.onopen = () => {
      console.log(`WebSocket connection established for match ${matchId}`);
    };
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      // Update match data
      setLiveMatches(prev => 
        prev.map(match => match.id === matchId ? { ...match, ...update.matchData } : match)
      );
      
      // Show notification
      addNotification(update.notification || `Match ${matchId} updated`);
    };
    
    ws.onerror = (error) => {
      console.error(`WebSocket error for match ${matchId}:`, error);
    };
    
    ws.onclose = () => {
      console.log(`WebSocket connection closed for match ${matchId}`);
      // Attempt to reconnect after a delay
      setTimeout(() => setupMatchWebSocket(matchId), 5000);
    };
    
    return ws;
  };
  
  // Add a notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    setShowNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Initial data loading
  useEffect(() => {
    fetchPredictions();
    fetchMatches();
    fetchMetrics();
    
    // Set up intervals for periodic refresh
    const predictionsInterval = setInterval(fetchPredictions, 60000); // Every minute
    const matchesInterval = setInterval(fetchMatches, 30000); // Every 30 seconds
    const metricsInterval = setInterval(fetchMetrics, 120000); // Every 2 minutes
    
    return () => {
      clearInterval(predictionsInterval);
      clearInterval(matchesInterval);
      clearInterval(metricsInterval);
    };
  }, []);
  
  // Load tab-specific data when tab changes
  useEffect(() => {
    if (activeTab === 'stats') {
      fetchPlayerStats();
    } else if (activeTab === 'rankings') {
      fetchTeamRankings();
    }
  }, [activeTab]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-4xl font-bold text-teal-300 mb-4 sm:mb-0">Cricket Blitz 🏏</h1>
          <nav className="flex gap-4 text-sm">
            <button 
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-800"
              onClick={() => setActiveTab('liveMatches')}
            >
              <TrendingUp size={16} /> Live Matches
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-800"
              onClick={() => setActiveTab('predictions')}
            >
              <Award size={16} /> AI Predictions
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-800"
              onClick={() => setActiveTab('stats')}
            >
              <Users size={16} /> Player Stats
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-800"
              onClick={() => setActiveTab('rankings')}
            >
              <Calendar size={16} /> Rankings
            </button>
          </nav>
        </header>
        
        {/* Live notification */}
        {showNotification && notifications.length > 0 && (
          <div className="fixed top-20 right-4 bg-black bg-opacity-70 backdrop-blur-lg p-4 rounded-lg max-w-sm border border-gray-700 shadow-xl transition-all duration-300 z-50">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full absolute top-0 animate-ping"></div>
              </div>
              <div>
                <p className="text-white font-medium">Match Alert</p>
                <p className="text-gray-300 text-sm">{notifications[0].message}</p>
              </div>
              <button 
                className="ml-4 text-gray-400 hover:text-white"
                onClick={() => setShowNotification(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-xl border border-gray-800 shadow-2xl">
          {/* Active tab indicator */}
          <div className="border-b border-gray-800">
            <div className="flex overflow-x-auto">
              {[
                { id: 'predictions', label: 'AI Match Predictions' },
                { id: 'liveMatches', label: 'Live Matches' },
                { id: 'stats', label: 'Player Stats' },
                { id: 'rankings', label: 'Team Rankings' },
                { id: 'fantasy', label: 'Fantasy League' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-b-2 border-teal-400 text-teal-300' 
                      : 'text-gray-400 hover:text-teal-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {/* AI Predictions Tab */}
            {activeTab === 'predictions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-teal-300">AI Match Predictions</h2>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-300 mr-3">Powered by CricketML™</div>
                    <button 
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                      onClick={fetchPredictions}
                      disabled={isLoading}
                    >
                      <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 mb-6 flex items-center">
                    <AlertCircle size={20} className="text-red-400 mr-2" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                {isLoading && !error ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                  </div>
                ) : (
                  <>
                    {predictions.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {predictions.map(prediction => (
                          <div key={prediction.id} className="bg-gray-800 bg-opacity-50 border border-gray-700 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-xl font-medium text-white">{prediction.match}</h3>
                              <span className="text-xs text-gray-400">
                                {new Date(prediction.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300 mb-3 font-semibold">{prediction.prediction}</p>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-400 mr-2">Confidence:</span>
                              <div className="flex-1 bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="bg-teal-500 h-2.5 rounded-full" 
                                  style={{ width: `${prediction.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-teal-300 ml-2">{prediction.confidence}%</span>
                            </div>
                            
                            {prediction.factors && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <p className="text-sm text-gray-400 mb-1">Key Factors:</p>
                                <ul className="text-sm text-gray-300 list-disc list-inside">
                                  {prediction.factors.map((factor, idx) => (
                                    <li key={idx}>{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        <p className="mb-4">No predictions available at the moment.</p>
                        <button 
                          className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                          onClick={fetchPredictions}
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    View All Predictions
                  </button>
                </div>
              </div>
            )}
            
            {/* Live Matches Tab */}
            {activeTab === 'liveMatches' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-teal-300">Live Cricket Matches</h2>
                  <button 
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    onClick={fetchMatches}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                
                {liveMatches.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {liveMatches.map(match => (
                      <div key={match.id} className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs bg-teal-800 text-teal-200 px-2 py-1 rounded">{match.format}</span>
                            <span className="text-xs text-gray-400">{match.venue}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3">{match.teams}</h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-900 rounded p-3 text-center">
                              <div className="text-2xl font-bold text-white">{match.score}</div>
                              <div className="text-xs text-gray-400">Current Score</div>
                            </div>
                            
                            {match.target && (
                              <div className="bg-gray-900 rounded p-3 text-center">
                                <div className="text-2xl font-bold text-teal-300">{match.target}</div>
                                <div className="text-xs text-gray-400">Target</div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-white font-medium">{match.status}</p>
                          </div>
                          
                          {match.recentBalls && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-400 mb-1">Recent Balls:</p>
                              <div className="flex gap-2">
                                {match.recentBalls.map((ball, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      ball === 'W' ? 'bg-red-600 text-white' : 
                                      ball === '4' ? 'bg-blue-600 text-white' :
                                      ball === '6' ? 'bg-purple-600 text-white' :
                                      'bg-gray-700 text-white'
                                    }`}
                                  >
                                    {ball}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {match.lastUpdate && (
                            <div className="bg-black bg-opacity-30 rounded p-2 text-sm text-gray-300">
                              {match.lastUpdate}
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-900 p-3 flex justify-between items-center">
                          <button className="text-xs text-teal-400 hover:text-teal-300">Full Scorecard</button>
                          <button className="text-xs bg-teal-700 hover:bg-teal-600 text-white px-3 py-1 rounded">Live Commentary</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <p className="mb-4">No live matches available at the moment.</p>
                    <button 
                      className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                      onClick={fetchMatches}
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Player Stats Tab */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl font-bold text-teal-300 mb-6">Player Statistics</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">Player</th>
                        <th className="px-4 py-2 text-left text-gray-300">Team</th>
                        <th className="px-4 py-2 text-right text-gray-300">Runs</th>
                        <th className="px-4 py-2 text-right text-gray-300">SR</th>
                        <th className="px-4 py-2 text-right text-gray-300">100s</th>
                        <th className="px-4 py-2 text-right text-gray-300">50s</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerStats.length > 0 ? (
                        playerStats.map(player => (
                          <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-800">
                            <td className="px-4 py-3 text-white font-medium">{player.name}</td>
                            <td className="px-4 py-3 text-gray-300">{player.team}</td>
                            <td className="px-4 py-3 text-right text-gray-300">{player.runs.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right text-gray-300">{player.avgStrikeRate}</td>
                            <td className="px-4 py-3 text-right text-gray-300">{player.centuries}</td>
                            <td className="px-4 py-3 text-right text-gray-300">{player.halfCenturies}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                            Loading player statistics...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Explore All Players
                  </button>
                </div>
              </div>
            )}
            
            {/* Team Rankings Tab */}
            {activeTab === 'rankings' && (
              <div>
                <h2 className="text-2xl font-bold text-teal-300 mb-6">ICC Team Rankings</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">Team</th>
                        <th className="px-4 py-2 text-center text-gray-300">ODI Rank</th>
                        <th className="px-4 py-2 text-center text-gray-300">Test Rank</th>
                        <th className="px-4 py-2 text-center text-gray-300">T20I Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamRankings.length > 0 ? (
                        teamRankings.map(team => (
                          <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-800">
                            <td className="px-4 py-3 text-white font-medium">{team.team}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                team.odis === 1 ? 'bg-yellow-500' : 'bg-gray-700'
                              }`}>
                                {team.odis}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                team.tests === 1 ? 'bg-yellow-500' : 'bg-gray-700'
                              }`}>
                                {team.tests}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                                team.t20s === 1 ? 'bg-yellow-500' : 'bg-gray-700'
                              }`}>
                                {team.t20s}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-12 text-center text-gray-400">
                            Loading team rankings...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Full Rankings
                  </button>
                </div>
              </div>
            )}
            
            {/* Fantasy League Tab */}
            {activeTab === 'fantasy' && (
              <div>
                <h2 className="text-2xl font-bold text-teal-300 mb-6">Fantasy Cricket League</h2>
                
                <div className="bg-black bg-opacity-40 rounded-lg p-6 text-center">
                  <div className="text-5xl text-yellow-400 mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Create Your Dream Team</h3>
                  <p className="text-gray-300 mb-6">
                    Pick real players, score points based on their actual performance, and compete with friends!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-4 rounded-lg border border-gray-700">
                      <h4 className="text-teal-300 font-bold mb-2">Daily Contests</h4>
                      <p className="text-sm text-gray-300">New contests every match day</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-4 rounded-lg border border-gray-700">
                      <h4 className="text-teal-300 font-bold mb-2">Win Prizes</h4>
                      <p className="text-sm text-gray-300">Exciting rewards for winners</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-4 rounded-lg border border-gray-700">
                      <h4 className="text-teal-300 font-bold mb-2">Leaderboards</h4>
                      <p className="text-sm text-gray-300">Compete globally or with friends</p>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-colors">
                    Start Playing Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 border-t border-gray-800 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            © 2025 Cricket Blitz. All rights reserved.
          </div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Views: {metrics.views || 0}</span>
            <span>Online: {metrics.online || 0}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CricketBlitz;