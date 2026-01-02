"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, Info, MessageSquare, X, TrendingUp, TrendingDown, Award, Users, Target, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Interfaces ---

interface Role {
  id: string;
  role: string;
}

interface PointTransaction {
  id: string;
  source: string;
  points: number;
  createdAt: string;
}

interface User {
  id: string;
  username: string | null;
  fullName: string | null;
  email: string | null;
  collegeName: string | null;
  experience: string | null;
  totalPoints: number;
  roles: Role[];
  rank: number;
}

interface UserDetails extends User {
  pointTxns: PointTransaction[];
}

interface Statistics {
  usersAhead: number;
  usersBehind: number;
  averagePoints: number;
  topPercentile: string;
  pointsToNextRank: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasMore: boolean;
}

interface LeaderboardData {
  users: User[];
  pinnedUser: User | null;
  currentUser: {
    id: string;
    rank: number;
    totalPoints: number;
  };
  pagination: Pagination;
  statistics: Statistics;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Component ---

const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    role: '',
    experience: '',
    search: ''
  });
  const [showRankingInfo, setShowRankingInfo] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const roles = ['SDE', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'DATA_ANALYST', 'DATA_SCIENTIST', 'ML_ENGINEER'];
  const experiences = ['FRESHER', 'JUNIOR', 'MID', 'SENIOR'];

  useEffect(() => {
    fetchLeaderboard();
  }, [page, filters]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(filters.role && { role: filters.role }),
        ...(filters.experience && { experience: filters.experience }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/leaderboard?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
    setLoading(false);
  };

  const fetchUserDetails = async (userId: string) => {
    setUserDetailsLoading(true);
    setSelectedUser(null);
    try {
      const response = await fetch(`/api/leaderboard/user/${userId}`);
      const user = await response.json();
      setSelectedUser(user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
    setUserDetailsLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    setChatLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage })
      });
      const result = await response.json();
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setChatLoading(false);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Where I Stand
            </h1>
            <p className="text-gray-400">Know where you stand. Decide your next move.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowRankingInfo(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-sm">How Rankings Work</span>
            </button>
            
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {data?.statistics && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Your Rank</p>
                <p className="text-2xl font-bold text-blue-400">#{data.currentUser.rank}</p>
              </div>
              <Award className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Top {data.statistics.topPercentile}%</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Users Ahead</p>
                <p className="text-2xl font-bold text-orange-400">{data.statistics.usersAhead}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Keep pushing forward!</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Users Behind</p>
                <p className="text-2xl font-bold text-green-400">{data.statistics.usersBehind}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-400 opacity-50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Great progress!</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Points to Next Rank</p>
                <p className="text-2xl font-bold text-purple-400">
                  {data.statistics.pointsToNextRank > 0 ? data.statistics.pointsToNextRank : '—'}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {data.statistics.pointsToNextRank > 0 ? 'Almost there!' : "You're at the top!"}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or username..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filters.role}
              onChange={(e) => {
                setFilters({ ...filters, role: e.target.value });
                setPage(1);
              }}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role.replace('_', ' ')}</option>
              ))}
            </select>

            <select
              value={filters.experience}
              onChange={(e) => {
                setFilters({ ...filters, experience: e.target.value });
                setPage(1);
              }}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Experience Levels</option>
              {experiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pinned Current User */}
      {data?.pinnedUser && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-blue-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {data.pinnedUser.rank}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{data.pinnedUser.fullName || 'You'}</h3>
                    <span className="px-2 py-1 bg-blue-500 rounded text-xs">YOU</span>
                  </div>
                  <p className="text-sm text-gray-400">@{data.pinnedUser.username || 'user'}</p>
                  <div className="flex gap-2 mt-1">
                    {data.pinnedUser.roles.map(r => (
                      <span key={r.role} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-blue-400">
                        {r.role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{data.pinnedUser.totalPoints}</p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Roles</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Points</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Details</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors ${
                      user.id === data.currentUser.id ? 'bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          user.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                          user.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-slate-700 text-gray-300'
                        }`}>
                          {user.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{user.fullName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-400">@{user.username || 'user'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.slice(0, 2).map(r => (
                          <span key={r.role} className="px-2 py-1 bg-slate-700 rounded text-xs text-blue-300">
                            {r.role}
                          </span>
                        ))}
                        {user.roles.length > 2 && (
                          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-gray-400">
                            +{user.roles.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-lg font-bold text-blue-400">{user.totalPoints}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => fetchUserDetails(user.id)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Info className="w-5 h-5 text-blue-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.pagination.totalUsers)} of {data.pagination.totalUsers} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
                  Page {page} of {data.pagination.totalPages}
                </div>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.pagination.hasMore}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ranking Info Modal */}
      {showRankingInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh]" style={{ overflow: 'hidden' }}>
            <div className="p-6" style={{ overflowY: 'auto', maxHeight: '90vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-blue-400">How Rankings Work</h2>
                <button
                  onClick={() => setShowRankingInfo(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Points System</h3>
                  <p className="mb-2">Your rank is determined by your total points, which you earn from three sources:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong className="text-blue-300">Daily Tasks:</strong> Complete coding challenges, learning modules, and practice problems to earn consistent points.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span><strong className="text-purple-300">Role-Based Points:</strong> Earn points specific to your target roles (SDE, Frontend, Backend, etc.) by completing relevant tasks and projects.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-green-300">Miscellaneous:</strong> Bonus points for achievements, milestones, competitions, and special contributions.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Ranking Calculation</h3>
                  <p>Rankings are calculated in real-time based on total points. Users with higher points are ranked higher. In case of a tie, the user who reached that point total first gets the higher rank.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Filters</h3>
                  <p>Use filters to see where you stand among users with similar profiles:</p>
                  <ul className="space-y-2 ml-4 mt-2">
                    <li><strong>Role Filter:</strong> Compare with users targeting the same job roles</li>
                    <li><strong>Experience Filter:</strong> See rankings within your experience level</li>
                    <li><strong>Search:</strong> Find specific users by name or username</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Pro Tips</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• Consistency is key - complete daily tasks regularly</li>
                    <li>• Focus on your target roles to earn specialized points</li>
                    <li>• Check the leaderboard regularly to track your progress</li>
                    <li>• Use the AI assistant to get personalized improvement strategies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {(userDetailsLoading || selectedUser) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh]" style={{ overflow: 'hidden' }}>
            
            {userDetailsLoading ? (
              // Loading State
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                </div>
                <p className="mt-6 text-blue-400 text-lg font-semibold animate-pulse">Loading user details...</p>
                <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch the information</p>
              </div>
            ) : selectedUser && (
              // Content
              <div className="p-6" style={{ overflowY: 'auto', maxHeight: '90vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-blue-400">User Details</h2>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setUserDetailsLoading(false);
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold">
                      {selectedUser.rank}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedUser.fullName || 'Anonymous'}</h3>
                      <p className="text-gray-400">@{selectedUser.username || 'user'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                      <p className="text-gray-400 text-sm mb-1">Total Points</p>
                      <p className="text-2xl font-bold text-blue-400">{selectedUser.totalPoints}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                      <p className="text-gray-400 text-sm mb-1">Current Rank</p>
                      <p className="text-2xl font-bold text-purple-400">#{selectedUser.rank}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-blue-300">Profile Information</h4>
                    <div className="space-y-3">
                      {selectedUser.email && (
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-gray-400">Email</span>
                          <span className="font-mono text-sm">{selectedUser.email}</span>
                        </div>
                      )}
                      {selectedUser.collegeName && (
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-gray-400">College</span>
                          <span>{selectedUser.collegeName}</span>
                        </div>
                      )}
                      {selectedUser.experience && (
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-gray-400">Experience</span>
                          <span>{selectedUser.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-blue-300">Target Roles</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.roles.map(r => (
                        <span key={r.role} className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300">
                          {r.role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* {selectedUser.pointTxns && selectedUser.pointTxns.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-blue-300">Recent Point History</h4>
                      <div className="space-y-2">
                        {selectedUser.pointTxns.slice(0, 5).map((txn, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <div>
                              <span className="text-gray-300">{txn.source.replace('_', ' ')}</span>
                              <p className="text-xs text-gray-500">
                                {new Date(txn.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-green-400 font-semibold">+{txn.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-3xl w-full h-[80vh] flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-blue-400">AI Assistant</h2>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 space-y-4 overflow-y-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ask me anything about your ranking!</p>
                  <p className="text-sm">
                    I can help you understand your performance, suggest improvements,
                    and explain where you stand in the job market.
                  </p>
                </div>
              )}

              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-gray-100 p-4 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  placeholder="Ask about your ranking, get improvement tips..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatMessage.trim()}
                  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      )}

    </div> 
  );
};

export default Leaderboard;