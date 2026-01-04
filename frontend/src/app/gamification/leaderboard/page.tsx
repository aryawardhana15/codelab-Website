'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LeaderboardEntry } from '@/types/gamification';
import Link from 'next/link';
import { Trophy, BarChart3, Award, Target, Star, ChevronLeft, ChevronRight, BookOpen, Users } from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/gamification/leaderboard?page=${currentPage}&limit=20`);
        if (response.data.success) {
          setLeaderboard(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user, currentPage]);

  const topThree = leaderboard.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-primary font-medium">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar', 'mentor', 'admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-glow-primary">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600">Kompetisi pelajar terbaik berdasarkan total XP</p>
          </div>

          {/* Navigation Buttons */}
          {user?.role === 'pelajar' && (
            <div className="flex justify-center space-x-3 mb-8">
              <Link
                href="/gamification/stats"
                className="btn btn-light"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </Link>
              <Link
                href="/gamification/badges"
                className="btn btn-light"
              >
                <Award className="w-4 h-4 mr-2" />
                Badges
              </Link>
              <Link
                href="/gamification/missions"
                className="btn btn-light"
              >
                <Target className="w-4 h-4 mr-2" />
                Missions
              </Link>
            </div>
          )}

          {/* Podium - Top 3 */}
          {topThree.length > 0 && (
            <div className="mb-12">
              <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
                {/* Second Place */}
                {topThree[1] && (
                  <div className="flex-1 max-w-xs">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-xl border-4 border-gray-300">
                      <div className="text-5xl mb-3">🥈</div>
                      <div className="relative inline-block mb-4">
                        {topThree[1].photo_url ? (
                          <img
                            className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                            src={topThree[1].photo_url}
                            alt={topThree[1].name}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border-4 border-white shadow-lg">
                            <span className="text-white font-bold text-2xl">
                              {topThree[1].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2.5 py-1 shadow-md border-2 border-gray-300">
                          <span className="text-xs font-bold text-gray-700">#{topThree[1].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {topThree[1].name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-3">Level {topThree[1].current_level}</div>
                      <div className="bg-white rounded-lg p-3 shadow-inner">
                        <div className="text-2xl font-bold text-gray-800">
                          {topThree[1].total_xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">XP</div>
                      </div>
                      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
                        <div>
                          <div className="font-semibold text-gray-800">{topThree[1].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{topThree[1].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-300 to-gray-400 h-32 rounded-b-2xl shadow-lg"></div>
                  </div>
                )}

                {/* First Place */}
                {topThree[0] && (
                  <div className="flex-1 max-w-xs">
                    <div className="bg-gradient-to-br from-secondary-100 to-primary-100 rounded-t-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-2xl border-4 border-secondary-400 relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-primary rounded-full p-3 shadow-lg animate-pulse">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="text-6xl mb-3 mt-2">🥇</div>
                      <div className="relative inline-block mb-4">
                        {topThree[0].photo_url ? (
                          <img
                            className="h-24 w-24 rounded-full border-4 border-white shadow-xl ring-4 ring-secondary-300"
                            src={topThree[0].photo_url}
                            alt={topThree[0].name}
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-white shadow-xl ring-4 ring-secondary-300">
                            <span className="text-white font-bold text-3xl">
                              {topThree[0].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-primary rounded-full px-3 py-1 shadow-lg">
                          <span className="text-sm font-bold text-white">#{topThree[0].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">
                        {topThree[0].name}
                      </h3>
                      <div className="text-sm text-gray-700 mb-3 font-medium">Level {topThree[0].current_level}</div>
                      <div className="bg-white rounded-lg p-4 shadow-inner">
                        <div className="text-3xl font-bold text-gradient">
                          {topThree[0].total_xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">XP</div>
                      </div>
                      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-700">
                        <div>
                          <div className="font-bold text-lg text-gray-900">{topThree[0].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">{topThree[0].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-primary h-48 rounded-b-2xl shadow-xl"></div>
                  </div>
                )}

                {/* Third Place */}
                {topThree[2] && (
                  <div className="flex-1 max-w-xs">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-xl border-4 border-primary-300">
                      <div className="text-5xl mb-3">🥉</div>
                      <div className="relative inline-block mb-4">
                        {topThree[2].photo_url ? (
                          <img
                            className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                            src={topThree[2].photo_url}
                            alt={topThree[2].name}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center border-4 border-white shadow-lg">
                            <span className="text-white font-bold text-2xl">
                              {topThree[2].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2.5 py-1 shadow-md border-2 border-primary-300">
                          <span className="text-xs font-bold text-primary-700">#{topThree[2].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {topThree[2].name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-3">Level {topThree[2].current_level}</div>
                      <div className="bg-white rounded-lg p-3 shadow-inner">
                        <div className="text-2xl font-bold text-gray-800">
                          {topThree[2].total_xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">XP</div>
                      </div>
                      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
                        <div>
                          <div className="font-semibold text-gray-800">{topThree[2].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{topThree[2].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-primary-300 to-primary-400 h-24 rounded-b-2xl shadow-lg"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Players List */}
          {leaderboard.length > 0 && (
            <div className="max-w-6xl mx-auto mt-12">
              <div className="card overflow-hidden border-2 border-primary-100">
                {/* Header */}
                <div className="bg-gradient-primary px-6 py-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    Daftar Peringkat Lengkap
                  </h2>
                </div>

                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-light-50 border-b border-light-200 font-semibold text-gray-700 text-sm">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-4">Nama Player</div>
                  <div className="col-span-2 text-center">Level</div>
                  <div className="col-span-2 text-right">Total XP</div>
                  <div className="col-span-1 text-center">Badges</div>
                  <div className="col-span-1 text-center">Kursus</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>

                {/* Player List */}
                <div className="divide-y divide-light-200">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-50/50 transition-colors ${entry.id === user?.id
                          ? 'bg-primary-50 border-l-4 border-primary'
                          : ''
                        }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex items-center justify-center md:justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${entry.rank === 1
                            ? 'bg-gradient-primary text-white'
                            : entry.rank === 2
                              ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                              : entry.rank === 3
                                ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-white'
                                : 'bg-gradient-to-br from-light-100 to-light-200 text-gray-700'
                          }`}>
                          {entry.rank}
                        </div>
                      </div>

                      {/* Name & Avatar */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {entry.photo_url ? (
                            <img
                              className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                              src={entry.photo_url}
                              alt={entry.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-lg">
                                {entry.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 truncate text-base">
                              {entry.name}
                            </h3>
                            {entry.id === user?.id && (
                              <span className="badge badge-primary">
                                Anda
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{entry.level_name}</p>
                        </div>
                      </div>

                      {/* Level */}
                      <div className="col-span-2 flex items-center justify-center md:justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">Level {entry.current_level}</div>
                          <div className="text-xs text-gray-500 hidden md:block">{entry.level_name}</div>
                        </div>
                      </div>

                      {/* Total XP */}
                      <div className="col-span-2 flex items-center justify-end md:justify-end">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {entry.total_xp.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">XP</div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="col-span-1 flex items-center justify-center md:justify-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-gray-900">{entry.total_badges}</span>
                          </div>
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="col-span-1 flex items-center justify-center md:justify-center">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{entry.courses_completed}</div>
                          <div className="text-xs text-gray-500 hidden md:block">Selesai</div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="col-span-1 flex items-center justify-center md:justify-center">
                        {entry.rank === 1 && (
                          <span className="badge bg-gradient-primary text-white">
                            🥇 Juara
                          </span>
                        )}
                        {entry.rank === 2 && (
                          <span className="badge bg-gray-400 text-white">
                            🥈 2nd
                          </span>
                        )}
                        {entry.rank === 3 && (
                          <span className="badge bg-primary-400 text-white">
                            🥉 3rd
                          </span>
                        )}
                        {entry.rank > 3 && (
                          <span className="badge badge-light">
                            Aktif
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-light rounded-r-none disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="relative inline-flex items-center px-6 py-3 border-t border-b border-light-300 bg-white text-sm font-medium text-gray-700">
                  Halaman <span className="mx-2 font-bold text-primary">{currentPage}</span> dari <span className="ml-2 font-bold">{totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-light rounded-l-none border-l-0 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}