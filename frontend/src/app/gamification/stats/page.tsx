'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserStats, XPHistory } from '@/types/gamification';
import Link from 'next/link';
import { BarChart3, Zap, Trophy, Target, Award, Clock, TrendingUp } from 'lucide-react';

export default function GamificationStatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [xpHistory, setXpHistory] = useState<XPHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          api.get('/gamification/stats'),
          api.get('/gamification/xp-history?limit=10')
        ]);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
        if (historyResponse.data.success) {
          setXpHistory(historyResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'pelajar') {
      fetchData();
    }
  }, [user]);

  const formatReason = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'complete_material': 'Menyelesaikan Materi',
      'complete_course': 'Menyelesaikan Kursus',
      'submit_assignment': 'Submit Tugas',
      'forum_post': 'Post di Forum',
      'forum_reply': 'Reply di Forum',
      'perfect_quiz': 'Nilai Sempurna',
      'mission_completed': 'Misi Selesai',
      'graded_assignment': 'Tugas Dinilai'
    };
    return reasonMap[reason] || reason;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-primary font-medium">Loading Stats...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0 mb-6">
            <div className="relative overflow-hidden bg-gradient-primary rounded-3xl p-8 shadow-glow-primary">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Statistik Pencapaian
                      </h1>
                    </div>
                    <p className="text-xl text-white/90 font-medium">
                      Lihat progress dan pencapaianmu! 🏆
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/gamification/badges"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Badges
                    </Link>
                    <Link
                      href="/gamification/missions"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Missions
                    </Link>
                    <Link
                      href="/gamification/leaderboard"
                      className="btn bg-white text-primary hover:bg-white/90 shadow-lg font-bold"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {stats && (
            <>
              {/* XP and Level Card */}
              <div className="px-4 sm:px-0 mb-6">
                <div className="card bg-gradient-primary overflow-hidden shadow-glow-primary">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>

                  <div className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-8 h-8 text-white" />
                      <h2 className="text-3xl font-bold text-white">Level & XP</h2>
                    </div>
                    <XPBar
                      currentXP={stats.total_xp}
                      currentLevel={stats.current_level}
                      levelName={stats.level_name}
                      levelProgress={stats.level_progress}
                      nextLevelXP={stats.next_level_xp}
                      size="lg"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-6 h-6 text-white" />
                          <p className="text-sm text-white/90 font-medium">Total XP</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.total_xp.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-6 h-6 text-white" />
                          <p className="text-sm text-white/90 font-medium">Total Badges</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.total_badges}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-6 h-6 text-white" />
                          <p className="text-sm text-white/90 font-medium">Misi Selesai</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.completed_missions}</p>
                      </div>
                    </div>

                    {stats.rank > 0 && (
                      <div className="mt-6 pt-6 border-t-2 border-white/30">
                        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30">
                          <div className="flex items-center gap-2">
                            <Award className="w-6 h-6 text-white" />
                            <span className="text-lg text-white/90 font-bold">Peringkat Global</span>
                          </div>
                          <span className="text-3xl font-bold text-white">#{stats.rank}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent XP History */}
              <div className="px-4 sm:px-0">
                <div className="card overflow-hidden border-2 border-primary-100">
                  <div className="bg-gradient-to-r from-success to-success-light px-8 py-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-white" />
                      <h2 className="text-2xl font-bold text-white">Riwayat XP Terbaru</h2>
                    </div>
                  </div>
                  <div className="divide-y divide-light-200">
                    {xpHistory.length > 0 ? (
                      xpHistory.map((entry) => (
                        <div key={entry.id} className="px-8 py-5 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-success to-success-light rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                <Zap className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-base font-bold text-gray-900">
                                  {formatReason(entry.reason)}
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(entry.created_at).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="px-5 py-2 bg-gradient-to-r from-success to-success-light rounded-2xl shadow-lg">
                              <span className="text-xl font-bold text-white">
                                +{entry.xp_amount} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-8 py-12 text-center">
                        <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                          <TrendingUp className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-lg text-gray-600 font-medium">Belum ada riwayat XP</p>
                        <p className="text-sm text-gray-500 mt-2">Mulai belajar untuk dapatkan XP!</p>
                      </div>
                    )}
                  </div>
                  {xpHistory.length > 0 && (
                    <div className="px-8 py-6 bg-light-50 border-t-2 border-light-200 text-center">
                      <Link
                        href="/gamification/xp-history"
                        className="btn btn-primary"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Lihat Semua Riwayat XP
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
