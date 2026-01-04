'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BookOpen, Search, Users, FileText, CheckCircle, PauseCircle, Trash2, X, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  mentor_id: number;
  mentor_name: string;
  category?: string;
  is_published: boolean;
  enrollment_count: number;
  materials_count: number;
  created_at: string;
}

export default function CoursesManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [publishedFilter, setPublishedFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [unpublishReason, setUnpublishReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, publishedFilter, searchQuery]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      if (publishedFilter !== '') {
        params.append('is_published', publishedFilter);
      }
      if (searchQuery) params.append('search', searchQuery);

      const response = await api.get(`/admin/courses?${params.toString()}`);

      if (response.data.success) {
        setCourses(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!selectedCourse) return;

    setIsProcessing(true);
    try {
      const response = await api.put(`/admin/courses/${selectedCourse.id}/unpublish`, {
        reason: unpublishReason
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowUnpublishModal(false);
        setUnpublishReason('');
        setSelectedCourse(null);
        fetchCourses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status course');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (courseId: number, courseTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus course "${courseTitle}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.delete(`/admin/courses/${courseId}`);

      if (response.data.success) {
        toast.success('Course berhasil dihapus');
        fetchCourses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus course');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat courses...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

            <div className="relative flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium mb-3 shadow-lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Management
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Kelola Courses 🎓
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Monitor dan kelola semua courses
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="group p-3 bg-white hover:bg-light-50 rounded-xl shadow-card transition-all border border-light-200"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Filters */}
            <div className="relative flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari course..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  value={publishedFilter}
                  onChange={(e) => {
                    setPublishedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select w-full sm:w-48"
                >
                  <option value="">📚 Semua Status</option>
                  <option value="true">✅ Published</option>
                  <option value="false">⏸️ Unpublished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Cards */}
          <div className="px-4 sm:px-0 mt-6">
            {courses.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada course ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="group card card-hover overflow-hidden border-2 border-primary-100">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Course Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                {course.category && (
                                  <span className="badge badge-info">
                                    📚 {course.category}
                                  </span>
                                )}
                                {course.is_published ? (
                                  <span className="badge badge-success">✅ Published</span>
                                ) : (
                                  <span className="badge bg-gray-200 text-gray-600">⏸️ Unpublished</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Mentor Info */}
                          <div className="mb-4 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mr-3">
                                {course.mentor_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-medium">Mentor</p>
                                <p className="text-sm font-bold text-gray-900">{course.mentor_name}</p>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-info/5 to-info/10 rounded-xl border-2 border-info/20">
                              <div className="flex items-center">
                                <div className="p-2 bg-info/20 rounded-lg mr-3">
                                  <Users className="h-5 w-5 text-info" />
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">{course.enrollment_count}</p>
                                  <p className="text-xs text-gray-600 font-medium">Enrollments</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-xl border-2 border-success/20">
                              <div className="flex items-center">
                                <div className="p-2 bg-success/20 rounded-lg mr-3">
                                  <FileText className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">{course.materials_count}</p>
                                  <p className="text-xs text-gray-600 font-medium">Materials</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-6 flex flex-col space-y-3">
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowUnpublishModal(true);
                            }}
                            disabled={isProcessing}
                            className={`btn disabled:opacity-50 ${course.is_published
                                ? 'bg-gradient-primary text-white hover:shadow-glow-primary'
                                : 'bg-success hover:bg-success-dark text-white'
                              }`}
                          >
                            {course.is_published ? (
                              <>
                                <PauseCircle className="h-5 w-5 mr-2" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Publish
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            disabled={isProcessing}
                            className="btn btn-outline border-error text-error hover:bg-error hover:text-white disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 px-4 sm:px-0">
              <div className="card px-6 py-4 flex items-center justify-between">
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
                    <p className="text-sm text-gray-700 font-medium">
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
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn btn-light rounded-l-none border-l-0 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Unpublish/Publish Modal */}
        {showUnpublishModal && selectedCourse && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowUnpublishModal(false)}></div>

              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 pt-6 pb-4 bg-white">
                  <div className="sm:flex sm:items-start">
                    <div className={`flex items-center justify-center flex-shrink-0 w-14 h-14 mx-auto rounded-full sm:mx-0 ${selectedCourse.is_published ? 'bg-primary/20' : 'bg-success/20'
                      }`}>
                      {selectedCourse.is_published ? (
                        <PauseCircle className="w-7 h-7 text-primary" />
                      ) : (
                        <CheckCircle className="w-7 h-7 text-success" />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
                        {selectedCourse.is_published ? '⏸️ Unpublish Course' : '✅ Publish Course'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedCourse.is_published
                            ? `Apakah Anda yakin ingin meng-unpublish course "${selectedCourse.title}"?`
                            : `Apakah Anda yakin ingin mempublish course "${selectedCourse.title}"?`
                          }
                        </p>
                        {selectedCourse.is_published && (
                          <>
                            <label className="input-label">
                              Alasan (opsional):
                            </label>
                            <textarea
                              value={unpublishReason}
                              onChange={(e) => setUnpublishReason(e.target.value)}
                              rows={4}
                              className="input resize-none"
                              placeholder="Masukkan alasan..."
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-light-50 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={isProcessing}
                    className={`btn w-full sm:w-auto disabled:opacity-50 ${selectedCourse.is_published
                        ? 'btn-primary'
                        : 'bg-success hover:bg-success-dark text-white'
                      }`}
                  >
                    {isProcessing ? 'Memproses...' : selectedCourse.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUnpublishModal(false);
                      setUnpublishReason('');
                      setSelectedCourse(null);
                    }}
                    disabled={isProcessing}
                    className="btn btn-light w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}