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
            <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 px-4">
              <Link
                href="/gamification/stats"
                className="btn btn-light text-sm py-2 px-3"
              >
                <BarChart3 className="w-4 h-4 mr-1.5" />
                Stats
              </Link>
              <Link
                href="/gamification/badges"
                className="btn btn-light text-sm py-2 px-3"
              >
                <Award className="w-4 h-4 mr-1.5" />
                Badges
              </Link>
              <Link
                href="/gamification/missions"
                className="btn btn-light text-sm py-2 px-3"
              >
                <Target className="w-4 h-4 mr-1.5" />
                Missions
              </Link>
            </div>
          )}

          {/* Podium - Top 3 */}
          {topThree.length > 0 && (
            <div className="mb-6 md:mb-12 px-4">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                {/* First Place - First on mobile */}
                {topThree[0] && (
                  <div className="w-full max-w-[280px] md:max-w-xs md:flex-1 order-1 md:order-2">
                    <div className="bg-gradient-to-br from-secondary-100 to-primary-100 rounded-2xl md:rounded-t-2xl md:rounded-b-none p-4 md:p-6 text-center shadow-2xl border-4 border-secondary-400 relative">
                      <div className="text-4xl md:text-6xl mb-2 md:mb-3">🥇</div>
                      <div className="relative inline-block mb-4">
                        {topThree[0].photo_url ? (
                          <img
                            className="h-16 w-16 md:h-24 md:w-24 rounded-full border-4 border-white shadow-xl ring-4 ring-secondary-300"
                            src={topThree[0].photo_url}
                            alt={topThree[0].name}
                          />
                        ) : (
                          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-white shadow-xl ring-4 ring-secondary-300">
                            <span className="text-white font-bold text-xl md:text-3xl">
                              {topThree[0].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-gradient-primary rounded-full px-2 py-0.5 md:px-3 md:py-1 shadow-lg">
                          <span className="text-[10px] md:text-sm font-bold text-white">#{topThree[0].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-base md:text-xl text-gray-900 mb-0.5 md:mb-1 truncate px-2">
                        {topThree[0].name}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3 font-medium">Level {topThree[0].current_level}</div>
                      <div className="bg-white rounded-lg p-2 md:p-4 shadow-inner inline-block">
                        <div className="text-xl md:text-3xl font-bold text-gradient">
                          {topThree[0].total_xp.toLocaleString()}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 font-medium">XP</div>
                      </div>
                      <div className="flex justify-center gap-4 md:gap-6 mt-2 md:mt-4 text-[10px] md:text-xs text-gray-700">
                        <div>
                          <div className="font-bold text-sm md:text-lg text-gray-900">{topThree[0].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-bold text-sm md:text-lg text-gray-900">{topThree[0].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block bg-gradient-primary h-48 rounded-b-2xl shadow-xl"></div>
                  </div>
                )}

                {/* Second Place */}
                {topThree[1] && (
                  <div className="w-full max-w-[240px] md:max-w-xs md:flex-1 order-2 md:order-1">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl md:rounded-t-2xl md:rounded-b-none p-3 md:p-6 text-center shadow-xl border-4 border-gray-300">
                      <div className="text-3xl md:text-5xl mb-2 md:mb-3">🥈</div>
                      <div className="relative inline-block mb-3 md:mb-4">
                        {topThree[1].photo_url ? (
                          <img
                            className="h-12 w-12 md:h-20 md:w-20 rounded-full border-4 border-white shadow-lg"
                            src={topThree[1].photo_url}
                            alt={topThree[1].name}
                          />
                        ) : (
                          <div className="h-12 w-12 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border-4 border-white shadow-lg">
                            <span className="text-white font-bold text-lg md:text-2xl">
                              {topThree[1].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 md:px-2.5 md:py-1 shadow-md border-2 border-gray-300">
                          <span className="text-[10px] md:text-xs font-bold text-gray-700">#{topThree[1].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1 truncate px-2">
                        {topThree[1].name}
                      </h3>
                      <div className="text-xs text-gray-600 mb-2 md:mb-3">Level {topThree[1].current_level}</div>
                      <div className="bg-white rounded-lg p-2 md:p-3 shadow-inner inline-block">
                        <div className="text-lg md:text-2xl font-bold text-gray-800">
                          {topThree[1].total_xp.toLocaleString()}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">XP</div>
                      </div>
                      <div className="flex justify-center gap-3 md:gap-4 mt-2 md:mt-4 text-[10px] md:text-xs text-gray-600">
                        <div>
                          <div className="font-semibold text-xs md:text-base text-gray-800">{topThree[1].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-semibold text-xs md:text-base text-gray-800">{topThree[1].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block bg-gradient-to-b from-gray-300 to-gray-400 h-32 rounded-b-2xl shadow-lg"></div>
                  </div>
                )}

                {/* Third Place */}
                {topThree[2] && (
                  <div className="w-full max-w-[240px] md:max-w-xs md:flex-1 order-3">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl md:rounded-t-2xl md:rounded-b-none p-3 md:p-6 text-center shadow-xl border-4 border-primary-300">
                      <div className="text-3xl md:text-5xl mb-2 md:mb-3">🥉</div>
                      <div className="relative inline-block mb-3 md:mb-4">
                        {topThree[2].photo_url ? (
                          <img
                            className="h-12 w-12 md:h-20 md:w-20 rounded-full border-4 border-white shadow-lg"
                            src={topThree[2].photo_url}
                            alt={topThree[2].name}
                          />
                        ) : (
                          <div className="h-12 w-12 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center border-4 border-white shadow-lg">
                            <span className="text-white font-bold text-lg md:text-2xl">
                              {topThree[2].name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 md:px-2.5 md:py-1 shadow-md border-2 border-primary-300">
                          <span className="text-[10px] md:text-xs font-bold text-primary-700">#{topThree[2].rank}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-0.5 md:mb-1 truncate px-2">
                        {topThree[2].name}
                      </h3>
                      <div className="text-xs text-gray-600 mb-2 md:mb-3">Level {topThree[2].current_level}</div>
                      <div className="bg-white rounded-lg p-2 md:p-3 shadow-inner inline-block">
                        <div className="text-lg md:text-2xl font-bold text-gray-800">
                          {topThree[2].total_xp.toLocaleString()}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">XP</div>
                      </div>
                      <div className="flex justify-center gap-3 md:gap-4 mt-2 md:mt-4 text-[10px] md:text-xs text-gray-600">
                        <div>
                          <div className="font-semibold text-xs md:text-base text-gray-800">{topThree[2].total_badges}</div>
                          <div>Badges</div>
                        </div>
                        <div>
                          <div className="font-semibold text-xs md:text-base text-gray-800">{topThree[2].courses_completed}</div>
                          <div>Kursus</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block bg-gradient-to-b from-primary-300 to-primary-400 h-24 rounded-b-2xl shadow-lg"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Players List */}
          {leaderboard.length > 0 && (
            <div className="max-w-6xl mx-auto mt-6 md:mt-12 px-2 md:px-0">
              <div className="card overflow-hidden border-2 border-primary-100">
                {/* Header */}
                <div className="bg-gradient-primary px-4 py-3">
                  <h2 className="text-base md:text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-6 md:h-6" />
                    Daftar Peringkat
                  </h2>
                </div>

                {/* Table Header - Desktop Only */}
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
                      className={`hover:bg-primary-50/50 transition-colors ${entry.id === user?.id
                        ? 'bg-primary-50 border-l-4 border-primary'
                        : ''
                        }`}
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden px-3 py-3">
                        <div className="flex items-center gap-2">
                          {/* Rank Badge */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow flex-shrink-0 ${entry.rank === 1
                            ? 'bg-gradient-primary text-white'
                            : entry.rank === 2
                              ? 'bg-gray-400 text-white'
                              : entry.rank === 3
                                ? 'bg-primary-400 text-white'
                                : 'bg-light-200 text-gray-700'
                            }`}>
                            {entry.rank}
                          </div>

                          {/* Avatar */}
                          {entry.photo_url ? (
                            <img
                              className="h-9 w-9 rounded-full border-2 border-white shadow flex-shrink-0"
                              src={entry.photo_url}
                              alt={entry.name}
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {entry.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Name & Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-900 text-sm truncate">
                                {entry.name}
                              </span>
                              {entry.id === user?.id && (
                                <span className="bg-primary text-white text-[10px] px-1 rounded flex-shrink-0">
                                  Anda
                                </span>
                              )}
                              {entry.rank <= 3 && (
                                <span className="flex-shrink-0">
                                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Lv.{entry.current_level} • <span className="text-primary font-semibold">{entry.total_xp.toLocaleString()} XP</span> • ⭐{entry.total_badges}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 md:mt-10 flex justify-center px-4">
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-light rounded-r-none disabled:opacity-50 px-3 md:px-4"
                >
                  <ChevronLeft className="w-4 h-4 md:mr-1" />
                  <span className="hidden md:inline">Previous</span>
                </button>

                <div className="relative inline-flex items-center px-3 md:px-6 py-3 border-t border-b border-light-300 bg-white text-xs md:text-sm font-medium text-gray-700">
                  <span className="font-bold text-primary">{currentPage}</span>
                  <span className="mx-1">/</span>
                  <span className="font-bold">{totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-light rounded-l-none border-l-0 disabled:opacity-50 px-3 md:px-4"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4 md:ml-1" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}