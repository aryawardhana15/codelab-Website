'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentCharts from '@/components/StudentCharts';
import {
  BookOpen,
  Users,
  FileText,
  CheckCircle,
  Plus,
  MessageSquare,
  BarChart2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface MentorStats {
  totalCourses: number;
  totalPublished: number;
  totalStudents: number;
  totalMaterials: number;
}

interface ChartData {
  monthlyEnrollments: Array<{ month: string; count: number }>;
  studentsPerCourse: Array<{
    id: number;
    title: string;
    student_count: number;
  }>;
  activeStudents: number;
  totalStudents: number;
}

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/mentor');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await api.get('/dashboard/mentor/students/chart');
        if (response.data.success) {
          setChartData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    if (user?.role === 'mentor') {
      fetchStats();
      fetchChartData();
    }
  }, [user]);

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
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="relative bg-gradient-primary rounded-3xl p-8 md:p-10 shadow-glow-primary overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Mentor Dashboard
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Halo, {user?.name}! 👋
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                      Siap berbagi ilmu hari ini? Pantau perkembangan kursus dan
                      siswamu di sini.
                    </p>
                  </div>

                  <Link
                    href="/mentor/courses/create"
                    className="btn bg-white text-primary hover:bg-white/90 border-0 shadow-lg group self-start md:self-center"
                  >
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Buat Kursus Baru
                  </Link>
                </div>

                {/* Quick Stats in Hero */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.totalCourses || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Kursus
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.totalPublished || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Published
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.totalStudents || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Siswa
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.totalMaterials || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Materi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Student Progress Chart */}
              {!isLoadingChart && chartData && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Aktivitas Siswa
                      </h2>
                      <p className="text-sm text-gray-500">
                        Statistik pendaftaran dan keaktifan siswa
                      </p>
                    </div>
                  </div>
                  <StudentCharts
                    monthlyEnrollments={chartData.monthlyEnrollments}
                    studentsPerCourse={chartData.studentsPerCourse}
                    activeStudents={chartData.activeStudents}
                    totalStudents={chartData.totalStudents}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Quick Maps */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Aksi Cepat
                </h3>

                <div className="space-y-3">
                  <Link
                    href="/mentor/courses/create"
                    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        Buat Kursus
                      </p>
                      <p className="text-xs text-gray-500">Mulai materi baru</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>

                  <Link
                    href="/mentor/courses"
                    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        Kelola Kursus
                      </p>
                      <p className="text-xs text-gray-500">Update konten</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>

                  <Link
                    href="/mentor/chat"
                    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        Pesan Masuk
                      </p>
                      <p className="text-xs text-gray-500">Chat dengan siswa</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>

                  {/* <Link
                    href="/mentor/students"
                    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-bold text-gray-900">Data Siswa</p>
                      <p className="text-xs text-gray-500">Pantau progress</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link> */}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Tips Mentor 💡
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  "Sapa siswa barumu dan berikan semangat! Interaksi yang baik
                  meningkatkan motivasi belajar."
                </p>
                <Link
                  href="/mentor/chat"
                  className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1"
                >
                  Mulai Chat <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
