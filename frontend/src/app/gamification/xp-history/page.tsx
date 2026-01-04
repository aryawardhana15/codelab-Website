'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { XPHistory } from '@/types/gamification';
import Link from 'next/link';
import { TrendingUp, Zap, BarChart3, Award, Target, Trophy, BookOpen, FileText, MessageSquare, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function XPHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [xpHistory, setXpHistory] = useState<XPHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const fetchXPHistory = async () => {
      try {
        const [historyResponse, statsResponse] = await Promise.all([
          api.get(`/gamification/xp-history?page=${currentPage}&limit=20`),
          api.get('/gamification/stats')
        ]);

        if (historyResponse.data.success) {
          setXpHistory(historyResponse.data.data);
          if (historyResponse.data.pagination) {
            setTotalPages(historyResponse.data.pagination.totalPages);
          }
        }
        if (statsResponse.data.success) {
          setTotalXP(statsResponse.data.data.total_xp);
        }
      } catch (error) {
        console.error('Failed to fetch XP history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'pelajar') {
      fetchXPHistory();
    }
  }, [user, currentPage]);

  const formatReason = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'complete_material': 'Menyelesaikan Materi',
      'complete_course': 'Menyelesaikan Kursus',
      'submit_assignment': 'Submit Tugas',
      'forum_post': 'Post di Forum',
      'forum_reply': 'Reply di Forum',
      'perfect_quiz': 'Nilai Sempurna pada Kuis',
      'perfect_score': 'Nilai Sempurna',
      'mission_completed': 'Misi Selesai',
      'graded_assignment': 'Tugas Dinilai',
      'earn_xp': 'Mendapatkan XP'
    };
    return reasonMap[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getReasonIcon = (reason: string) => {
    if (reason.includes('material') || reason.includes('course')) {
      return <BookOpen className="w-5 h-5 text-primary" />;
    }
    if (reason.includes('assignment') || reason.includes('quiz')) {
      return <FileText className="w-5 h-5 text-green-600" />;
    }
    if (reason.includes('forum')) {
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
    if (reason.includes('mission')) {
      return <CheckCircle className="w-5 h-5 text-orange-600" />;
    }
    return <Zap className="w-5 h-5 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-primary font-medium">Loading XP History...</p>
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
          <div className="px-4 py-6 sm:px-0">
            <div className="relative overflow-hidden bg-gradient-primary rounded-3xl p-8 shadow-glow-primary mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold text-white">Riwayat XP</h1>
                    </div>
                    <p className="text-xl text-white/90">
                      Lihat semua aktivitas yang memberikan XP
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      href="/gamification/stats"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Stats
                    </Link>
                    <Link
                      href="/gamification/badges"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    >
                      <Award className="w-4 h-4 mr-2" />
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
                      <Trophy className="w-4 h-4 mr-2" />
                      Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Total XP Summary */}
            <div className="card bg-gradient-primary overflow-hidden mb-6 shadow-glow-primary">
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-white/90">Total XP Anda</p>
                  <p className="text-3xl font-bold text-white mt-1">{totalXP.toLocaleString()} XP</p>
                </div>
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* XP History List */}
          <div className="px-4 sm:px-0">
            <div className="card overflow-hidden border-2 border-primary-100">
              <div className="px-6 py-4 border-b border-light-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Riwayat Aktivitas
                </h2>
              </div>
              <div className="divide-y divide-light-200">
                {xpHistory.length > 0 ? (
                  xpHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="px-6 py-4 hover:bg-primary-50/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                            {getReasonIcon(entry.reason)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {formatReason(entry.reason)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(entry.created_at).toLocaleString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold shadow-md">
                            +{entry.xp_amount} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                      <TrendingUp className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Tidak ada riwayat</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Mulai belajar untuk mendapatkan XP!
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-light-50 px-6 py-4 border-t border-light-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-light disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-light disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Halaman <span className="font-bold text-primary">{currentPage}</span> dari{' '}
                        <span className="font-bold text-primary">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="btn btn-light rounded-r-none disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
