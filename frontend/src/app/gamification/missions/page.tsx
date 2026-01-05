'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import MissionCard from '@/components/MissionCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Mission } from '@/types/gamification';
import Link from 'next/link';
import { Target, BarChart3, Award, Trophy, Calendar, Clock, Star } from 'lucide-react';

export default function MissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'achievement'>('all');

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.get('/gamification/missions');
        if (response.data.success) {
          setMissions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch missions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'pelajar') {
      fetchMissions();
    }
  }, [user]);

  const filteredMissions = missions.filter(m => filter === 'all' || m.type === filter);
  const dailyMissions = missions.filter(m => m.type === 'daily');
  const weeklyMissions = missions.filter(m => m.type === 'weekly');
  const achievementMissions = missions.filter(m => m.type === 'achievement');

  const completedDaily = dailyMissions.filter(m => m.is_completed).length;
  const completedWeekly = weeklyMissions.filter(m => m.is_completed).length;
  const completedAchievement = achievementMissions.filter(m => m.is_completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-primary font-medium">Loading Missions...</p>
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
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-2xl md:text-4xl font-bold text-white">Missions</h1>
                    </div>
                    <p className="text-sm md:text-xl text-white/90">
                      Selesaikan missions untuk mendapatkan XP dan badges
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/gamification/stats"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 text-sm py-2 px-3"
                    >
                      <BarChart3 className="w-4 h-4 mr-1.5" />
                      Stats
                    </Link>
                    <Link
                      href="/gamification/badges"
                      className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 text-sm py-2 px-3"
                    >
                      <Award className="w-4 h-4 mr-1.5" />
                      Badges
                    </Link>
                    <Link
                      href="/gamification/leaderboard"
                      className="btn bg-white text-primary hover:bg-white/90 shadow-lg font-bold text-sm py-2 px-3"
                    >
                      <Trophy className="w-4 h-4 mr-1.5" />
                      Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-1 border-b border-light-200 mb-6 pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 md:px-4 py-2.5 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${filter === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Semua ({missions.length})
              </button>
              <button
                onClick={() => setFilter('daily')}
                className={`px-3 md:px-4 py-2.5 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${filter === 'daily'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Harian ({completedDaily}/{dailyMissions.length})
              </button>
              <button
                onClick={() => setFilter('weekly')}
                className={`px-3 md:px-4 py-2.5 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${filter === 'weekly'
                  ? 'border-secondary-600 text-secondary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Mingguan ({completedWeekly}/{weeklyMissions.length})
              </button>
              <button
                onClick={() => setFilter('achievement')}
                className={`px-3 md:px-4 py-2.5 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${filter === 'achievement'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Pencapaian ({completedAchievement}/{achievementMissions.length})
              </button>
            </div>
          </div>

          {/* Missions Grid */}
          <div className="px-4 sm:px-0">
            {filteredMissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMissions.map((mission) => (
                  <MissionCard key={mission.mission_id} mission={mission} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                  <Target className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Tidak ada missions untuk ditampilkan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
