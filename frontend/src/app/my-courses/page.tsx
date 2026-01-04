'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatButton from '@/components/ChatButton';
import { Course } from '@/types/course';
import { BookOpen, Search, Play, TrendingUp, User } from 'lucide-react';

export default function MyCoursesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses/my/enrolled');

      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized - ProtectedRoute will handle redirect');
        return;
      }
      toast.error(error.response?.data?.message || 'Gagal memuat kursus');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium">Memuat kursus...</p>
          </div>
        </div>
      </ProtectedRoute>
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
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                      Kursus Saya
                    </h1>
                    <p className="text-xl text-white/90 font-medium">
                      Lanjutkan pembelajaranmu dan raih prestasi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum ada kursus</h3>
              <p className="text-lg text-gray-600 mb-8">Yuk, mulai petualangan belajarmu dengan bergabung kursus baru!</p>
              <button
                onClick={() => router.push('/courses')}
                className="btn btn-primary text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Jelajahi Kursus
              </button>
            </div>
          )}

          {/* Courses List */}
          {courses.length > 0 && (
            <div className="px-4 sm:px-0">
              <div className="grid grid-cols-1 gap-6">
                {courses.map((course: any) => {
                  const progress = course.materials_count > 0
                    ? Math.round((course.completed_materials / course.materials_count) * 100)
                    : 0;

                  return (
                    <div
                      key={course.id}
                      className="group card card-hover overflow-hidden border-2 border-primary-100"
                    >
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 opacity-30 rounded-full -mr-32 -mt-32"></div>

                      <div className="relative z-10 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Course Title */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                  {course.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <User className="w-4 h-4 text-primary" />
                                  <span className="font-medium">Mentor:</span>
                                  <span className="font-bold text-primary">{course.mentor_name}</span>
                                </div>
                              </div>
                            </div>

                            {/* Progress Section */}
                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                  Progress
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
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col md:flex-row gap-3 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!course.id) {
                                  toast.error('Course ID tidak valid');
                                  return;
                                }
                                router.push(`/courses/${course.id}/learn`);
                              }}
                              className="btn btn-primary"
                              type="button"
                              disabled={!course.id}
                            >
                              <Play className="w-5 h-5 mr-2" />
                              {progress > 0 ? 'Lanjutkan' : 'Mulai'}
                            </button>
                            <ChatButton
                              courseId={course.id}
                              courseName={course.title}
                              size="md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
