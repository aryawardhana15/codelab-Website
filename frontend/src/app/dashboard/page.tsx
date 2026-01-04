'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserStats } from '@/types/gamification';
import Link from 'next/link';
import ChatButton from '@/components/ChatButton';
import { BookOpen, CheckCircle, BarChart3, Trophy, Star, Target, Zap, Award, TrendingUp, MessageSquare, Play, ArrowRight } from 'lucide-react';

interface PelajarStats {
  totalEnrolled: number;
  totalCompleted: number;
  totalXP: number;
  currentLevel: number;
  totalBadges: number;
  progressPercentage: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PelajarStats | null>(null);
  const [gamificationStats, setGamificationStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect based on role
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      } else if (user.role === 'mentor') {
        router.push('/mentor/dashboard');
        return;
      }
    }

    // Fetch pelajar stats and gamification stats
    const fetchStats = async () => {
      try {
        const [dashboardResponse, gamificationResponse, coursesResponse] = await Promise.all([
          api.get('/dashboard/pelajar'),
          api.get('/gamification/stats').catch(() => ({ data: { success: false } })),
          api.get('/courses/my/enrolled').catch(() => ({ data: { success: false } }))
        ]);

        if (dashboardResponse.data.success) {
          setStats(dashboardResponse.data.data);
        }
        if (gamificationResponse.data.success) {
          setGamificationStats(gamificationResponse.data.data);
        }
        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'pelajar') {
      fetchStats();
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-6xl mx-auto py-8 px-8 sm:px-6 lg:px-8">
          {/* Main Content - Varied Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Column - Wide (8 out of 12 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Header */}
              <div className="mb-8">
                <div className="relative bg-gradient-primary rounded-3xl p-12 shadow-glow-primary overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-24 -mb-24"></div>
                  <div className="absolute top-4 right-4 text-6xl opacity-20">✨</div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                          Halo, {user?.name}! 👋
                        </h1>
                        <p className="text-white/90">
                          Siap belajar hari ini? Mari tingkatkan skill kamu!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kursus Saya section */}
              {courses && courses.length > 0 && (
                <div className="card mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Kursus Saya</h2>
                    {courses.length > 3 && (
                      <Link href="/my-courses" className="text-primary font-semibold hover:underline text-sm">Lihat Semua →</Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.slice(0, 2).map((course: any, index: number) => {
                      const progress = course.materials_count > 0
                        ? Math.round((course.completed_materials / course.materials_count) * 100)
                        : 0;

                      return (
                        <div
                          key={course.id}
                          className="group relative bg-white rounded-2xl border-2 border-primary-100 hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                        >
                          {/* Decorative Background */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 opacity-30 rounded-full -mr-32 -mt-32"></div>
                          <div className="relative z-10 p-6">
                            {/* Course Title */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{course.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <span className="font-medium">Mentor:</span>
                                  <span className="font-bold text-primary">{course.mentor_name}</span>
                                </div>
                              </div>
                            </div>
                            {/* Progress Section */}
                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                  Progress:
                                </span>
                                <span className="text-lg font-bold text-primary">{progress}%</span>
                              </div>
                              <div className="w-full bg-light-200 rounded-full h-4 mb-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-primary rounded-full transition-all duration-500 relative"
                                  style={{ width: `${progress}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 font-medium">
                                {course.completed_materials || 0} / {course.materials_count || 0} materi selesai ✨
                              </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-3 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!course.id) return;
                                  router.push(`/courses/${course.id}/learn`);
                                }}
                                className="btn btn-primary flex-1"
                                type="button"
                                disabled={!course.id}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                {progress > 0 ? 'Lanjutkan' : 'Mulai'}
                              </button>
                              <ChatButton courseId={course.id} courseName={course.title} size="md" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Empty state if no courses */}
                  {courses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada kursus diikuti. <Link href="/courses" className="text-primary font-semibold hover:underline">Jelajahi Kursus</Link>
                    </div>
                  )}
                </div>
              )}

              {/* XP Progress Card */}
              {gamificationStats && (
                <div className="card overflow-hidden !p-0 border-0 shadow-lg">
                  <div className="bg-gradient-primary p-6 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-lg text-white font-bold">Progress Belajar</h2>
                        </div>
                        <Link
                          href="/gamification/stats"
                          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-all border border-white/20 flex items-center gap-1"
                        >
                          Detail <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <XPBar
                          currentXP={gamificationStats.total_xp}
                          currentLevel={gamificationStats.current_level}
                          levelName={gamificationStats.level_name}
                          levelProgress={gamificationStats.level_progress}
                          nextLevelXP={gamificationStats.next_level_xp}
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalEnrolled || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Kursus Diikuti</p>
                </div>

                <div className="card card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-success to-success-light rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalCompleted || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Kursus Selesai</p>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="card">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Progress Keseluruhan</h3>
                  <div className="ml-auto">
                    <span className="text-2xl font-bold text-primary">
                      {stats?.progressPercentage || 0}%
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full bg-light-200 rounded-full h-4 mb-2 shadow-inner overflow-hidden">
                    <div
                      className="bg-gradient-primary h-4 rounded-full transition-all duration-700 relative"
                      style={{ width: `${stats?.progressPercentage || 0}%` }}
                    >
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-medium">Target: 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Achievements and Stats */}
            <div className="lg:col-span-4 space-y-6">
              {/* Achievement Summary */}
              {gamificationStats && (
                <div className="bg-gradient-to-br from-white via-primary-50/40 to-secondary-50/30 rounded-2xl p-5 border border-primary-200 shadow-card">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-primary-100/50">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-bold text-gray-900">Pencapaian</h3>
                  </div>

                  {/* Badges - Circular Progress Design */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100 rounded-xl p-5 border-2 border-secondary-200/50 shadow-inner">
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          {/* Outer ring background */}
                          <svg className="transform -rotate-90 w-32 h-32 absolute inset-0">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="7"
                              fill="none"
                              className="text-secondary-200/80"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="7"
                              fill="none"
                              strokeDasharray={`${Math.min((gamificationStats.total_badges / 20) * 351.86, 351.86)} 351.86`}
                              className="text-primary transition-all duration-1000"
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Center content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg border-2 border-secondary-300/50">
                              <Star className="h-8 w-8 text-white" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                              {gamificationStats.total_badges}
                            </p>
                            <p className="text-[11px] text-gray-600 font-semibold uppercase tracking-widest">Badges</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Missions - Gradient Card */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-success to-success-light rounded-xl p-4 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-white/80 mb-1.5 uppercase tracking-wider">Missions</p>
                          <p className="text-3xl font-bold text-white leading-none mb-1">{gamificationStats.completed_missions}</p>
                          <p className="text-xs text-white/80 font-medium">Completed</p>
                        </div>
                        <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
                          <Target className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ranking - Trophy Design */}
                  {gamificationStats.rank > 0 && (
                    <div className="mb-4">
                      <div className="bg-gradient-primary rounded-xl p-4 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -ml-14 -mb-14"></div>

                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-white/80 mb-1.5 uppercase tracking-wider">Ranking</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-white leading-none">#{gamificationStats.rank}</span>
                              <span className="text-xs text-white/80 font-medium">Global</span>
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
                            <Trophy className="h-7 w-7 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Link */}
                  <div className="mt-5 pt-4 border-t border-primary-100/60">
                    <Link
                      href="/gamification/stats"
                      className="btn btn-primary w-full"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              )}

              {/* Additional Stats */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary-100/50">
                  <div className="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Statistik</h3>
                </div>
                <div className="space-y-4">
                  <div className="group relative bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100 rounded-xl p-4 border-2 border-secondary-200/50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-200/30 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total XP</p>
                          <p className="text-xl font-bold text-primary">{stats?.totalXP?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 rounded-xl p-4 border-2 border-primary-200/50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-200/30 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-md">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Level Saat Ini</p>
                          <p className="text-xl font-bold text-primary-700">{stats?.currentLevel || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-gradient-to-br from-success/10 via-success/5 to-success/15 rounded-xl p-4 border-2 border-success/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-success/20 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-success to-success-light rounded-lg flex items-center justify-center shadow-md">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Badges</p>
                          <p className="text-xl font-bold text-success">{stats?.totalBadges || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
