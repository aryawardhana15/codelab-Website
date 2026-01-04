'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Course } from '@/types/course';
import {
  ArrowLeft, BookOpen, Clock, Users, Star, Award,
  CheckCircle, Play, Lock, ChevronRight, User as UserIcon,
  Sparkles
} from 'lucide-react';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const courseId = parseInt(params.id as string);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat detail kursus');
      router.push('/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (user.role !== 'pelajar') {
      toast.error('Hanya pelajar yang dapat bergabung dengan kursus');
      return;
    }

    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCourse(); // Refresh to update enrollment status
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal bergabung dengan kursus');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin text-primary mb-4">
              <Sparkles className="w-12 h-12" />
            </div>
            <p className="text-gray-500 font-medium">Memuat detail kursus...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return null;
  }

  const difficultyConfig = {
    beginner: {
      bg: 'bg-success/10',
      text: 'text-success',
      label: 'Pemula',
      border: 'border-success/20'
    },
    intermediate: {
      bg: 'bg-secondary/10',
      text: 'text-secondary-700',
      label: 'Menengah',
      border: 'border-secondary/20'
    },
    advanced: {
      bg: 'bg-error/10',
      text: 'text-error',
      label: 'Mahir',
      border: 'border-error/20'
    }
  };

  const config = difficultyConfig[course.difficulty];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        {/* Hero Section */}
        <div className="relative bg-white pb-12 pt-6 lg:pt-10 overflow-hidden border-b border-gray-100">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial-primary opacity-5 blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial-primary opacity-5 blur-[100px] rounded-full pointer-events-none -ml-32 -mb-32"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <button onClick={() => router.push('/courses')} className="hover:text-primary transition-colors">Courses</button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium truncate">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left Content */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-3 mb-6">
                  {course.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-100">
                      {course.category}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
                    {config.label}
                  </span>
                  {course.education_level && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                      {course.education_level}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {course.title}
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                  {course.description || 'Tidak ada deskripsi tersedia.'}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Pelajar</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{course.enrollment_count || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span>Materi</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{course.materials_count || 0}</p>
                  </div>
                  {/* Add more stats if available */}
                </div>

                {/* Mentor Section - Horizontal */}
                <div className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-primary shrink-0 mr-4">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5">
                      {course.mentor?.photo_url ? (
                        <img src={course.mentor.photo_url} alt={course.mentor.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full bg-primary-50 flex items-center justify-center text-xl font-bold text-primary rounded-full">
                          {(course.mentor?.name || course.mentor_name || 'M').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Mentor Instruktur</p>
                    <h3 className="text-lg font-bold text-gray-900">{course.mentor?.name || course.mentor_name || 'Unknown'}</h3>
                    {course.mentor?.expertise && (
                      <p className="text-sm text-gray-500">{course.mentor.expertise}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Content - Sticky Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-100 relative">
                    {/* Thumbnail */}
                    <div className="aspect-video relative bg-gray-100 overflow-hidden group">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary-200" />
                        </div>
                      )}
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>

                      {/* Price Tag Floating */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <span className="text-xs text-white/80 uppercase font-bold tracking-wider block mb-1">Total Biaya</span>
                        <span className="text-2xl font-black text-white">
                          {course.price > 0 ? `Rp ${Number(course.price).toLocaleString('id-ID')}` : 'GRATIS'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {course.isEnrolled ? (
                        <>
                          <button
                            onClick={() => router.push(`/courses/${course.id}/learn`)}
                            className="w-full btn btn-primary py-4 text-lg justify-center shadow-glow-primary hover:shadow-glow-primary-lg"
                          >
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Lanjut Belajar
                          </button>
                          <button
                            onClick={() => router.push('/my-courses')}
                            className="w-full btn btn-light py-3 justify-center text-gray-600"
                          >
                            Lihat Kursus Saya
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEnroll}
                            disabled={user?.role !== 'pelajar'}
                            className="w-full btn btn-primary py-4 text-lg justify-center shadow-glow-primary hover:shadow-glow-primary-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserIcon className="w-5 h-5 mr-2" />
                            {user?.role === 'pelajar' ? 'Gabung Sekarang' : 'Login sebagai Pelajar'}
                          </button>
                          {user?.role !== 'pelajar' && (
                            <p className="text-xs text-center text-orange-500 font-medium">
                              Anda harus login sebagai pelajar untuk mendaftar.
                            </p>
                          )}
                        </>
                      )}

                      <div className="pt-4 border-t border-gray-100">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Akses selamanya</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Sertifikat penyelesaian</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{course.materials_count || 0} Materi video & teks</span>
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
      </div>
    </ProtectedRoute>
  );
}