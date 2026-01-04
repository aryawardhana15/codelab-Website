'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import CourseFilters from '@/components/CourseFilters';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Course, CourseFilters as Filters, Pagination } from '@/types/course';
import { Search, BookOpen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.education_level) params.append('education_level', filters.education_level);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/courses?${params.toString()}`);

      if (response.data.success) {
        setCourses(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response?.data?.message || 'Gagal memuat kursus');
      } else {
        console.error('Network error:', error);
        setCourses([]);
        setPagination(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
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
        fetchCourses(pagination?.currentPage || 1);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal bergabung dengan kursus');
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchCourses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 sm:px-0 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jelajahi Kursus</h1>
            <p className="text-gray-600">Temukan kursus terbaik untuk meningkatkan skill kamu.</p>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-0">
            <CourseFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin text-primary mb-4">
                <Loader2 className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-medium">Memuat kursus...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && courses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-4 sm:mx-0">
              <div className="inline-flex p-4 bg-orange-50 rounded-full mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada kursus ditemukan</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau filter untuk menemukan kursus yang kamu cari.
              </p>
              <button
                onClick={() => setFilters({})}
                className="btn btn-primary"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!isLoading && courses.length > 0 && (
            <>
              <div className="px-4 sm:px-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 px-4 sm:px-0">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${pagination.currentPage === page
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
