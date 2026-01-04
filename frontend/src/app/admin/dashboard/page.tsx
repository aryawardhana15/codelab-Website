'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, GraduationCap, BookOpen, UserCheck, AlertTriangle, Clock, TrendingUp, MessageSquare, Shield, Activity } from 'lucide-react';

interface AdminStats {
  totalPelajar: number;
  totalMentor: number;
  totalMentorVerified: number;
  totalMentorPending: number;
  totalUsers: number;
  totalCourses: number;
  totalCoursesPublished: number;
  totalEnrollments: number;
  totalForumPosts: number;
  pendingReports: number;
  newUsersLast30Days: number;
  newCoursesLast30Days: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const userGrowthPercentage = stats?.totalUsers ? ((stats.newUsersLast30Days / stats.totalUsers) * 100).toFixed(1) : '0';
  const mentorVerificationRate = stats?.totalMentor ? ((stats.totalMentorVerified / stats.totalMentor) * 100).toFixed(1) : '0';
  const coursePublishRate = stats?.totalCourses ? ((stats.totalCoursesPublished / stats.totalCourses) * 100).toFixed(1) : '0';

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header with Gradient */}
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-primary p-8 shadow-glow-primary">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/30 blur-2xl"></div>

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Activity className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-white/80 text-sm mt-1">Welcome back, {user?.name || 'Admin'}</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-white/80 text-sm">Current Date</p>
                  <p className="text-white font-semibold text-lg">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Left Column - Key Metrics */}
            <div className="lg:col-span-2 space-y-6">

              {/* Top Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Users</p>
                </div>

                <div className="card card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-success" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalPelajar || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Students</p>
                </div>

                <div className="card card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-primary-700" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalMentor || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Mentors</p>
                </div>

                <div className="card card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-info" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Courses</p>
                </div>
              </div>

              {/* Platform Overview */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Platform Overview</h2>
                  <span className="badge badge-primary">Live Data</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-light-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Published Courses</p>
                        <p className="text-xs text-gray-500">Active learning materials</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalCoursesPublished || 0}</p>
                      <p className="text-xs text-success font-medium">{coursePublishRate}% of total</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-light-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Total Enrollments</p>
                        <p className="text-xs text-gray-500">Student registrations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalEnrollments || 0}</p>
                      <p className="text-xs text-gray-500">Course registrations</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-orange flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Verified Mentors</p>
                        <p className="text-xs text-gray-500">Approved instructors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalMentorVerified || 0}</p>
                      <p className="text-xs text-primary font-medium">{mentorVerificationRate}% verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Growth Metrics</h2>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">New Users (30 days)</span>
                      <span className="text-sm font-bold text-primary">{stats?.newUsersLast30Days || 0}</span>
                    </div>
                    <div className="w-full bg-light-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(Number(userGrowthPercentage) * 5, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{userGrowthPercentage}% of total users</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">New Courses (30 days)</span>
                      <span className="text-sm font-bold text-success">{stats?.newCoursesLast30Days || 0}</span>
                    </div>
                    <div className="w-full bg-light-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-success to-success-light h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stats?.totalCourses ? Math.min((stats.newCoursesLast30Days / stats.totalCourses) * 500, 100) : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recent additions</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Course Publish Rate</span>
                      <span className="text-sm font-bold text-secondary-700">{coursePublishRate}%</span>
                    </div>
                    <div className="w-full bg-light-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-gold h-3 rounded-full transition-all duration-500"
                        style={{ width: `${coursePublishRate}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Published vs Total courses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions & Alerts */}
            <div className="space-y-6">

              {/* Alert Cards */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-card border border-primary-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-900 mb-1">Pending Mentor Verification</h3>
                    <p className="text-sm text-primary-700 mb-3">{stats?.totalMentorPending || 0} mentors waiting for approval</p>
                    <button
                      onClick={() => router.push('/admin/mentors')}
                      className="btn btn-primary w-full btn-sm"
                    >
                      Review Mentors
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-2xl p-6 shadow-card border border-error/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-error flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-error-dark mb-1">Pending Reports</h3>
                    <p className="text-sm text-error mb-3">{stats?.pendingReports || 0} reports need moderation</p>
                    <button
                      onClick={() => router.push('/admin/reports')}
                      className="w-full bg-error hover:bg-error-dark text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                    >
                      Review Reports
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/admin/users')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors text-left group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Manage Users</p>
                      <p className="text-xs text-gray-500">{stats?.totalUsers || 0} users</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push('/admin/courses')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors text-left group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <BookOpen className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Manage Courses</p>
                      <p className="text-xs text-gray-500">{stats?.totalCourses || 0} courses</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push('/admin/logs')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors text-left group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Activity className="h-5 w-5 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Admin Logs</p>
                      <p className="text-xs text-gray-500">View activity</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 shadow-card border border-success/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                  <h3 className="font-semibold text-success-dark">System Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Platform</span>
                    <span className="badge badge-success">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Database</span>
                    <span className="badge badge-success">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">API Services</span>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card card-hover">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-light-200 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats?.totalForumPosts || 0}</p>
                  <p className="text-xs text-gray-500">Forum Posts</p>
                </div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-light-200 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats?.totalMentorPending || 0}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-light-200 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats?.totalMentorVerified || 0}</p>
                  <p className="text-xs text-gray-500">Verified</p>
                </div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-light-200 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{userGrowthPercentage}%</p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}