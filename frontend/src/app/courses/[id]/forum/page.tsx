'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Forum, Pagination } from '@/types/forum';
import { Course } from '@/types/course';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Pin,
  Lock,
  ThumbsUp,
  MessageCircle,
  Hash,
  Loader2,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function CourseForumPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    tags: '',
    page: 1
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchForums();
    }
  }, [courseId, filters.page]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data kursus');
    }
  };

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tags) params.append('tags', filters.tags);
      params.append('page', filters.page.toString());
      params.append('limit', '20');

      const response = await api.get(`/forums/course/${courseId}?${params.toString()}`);
      if (response.data.success) {
        // Sanitize forum data to remove leading/trailing '0' characters
        const sanitizedForums = response.data.data.map((forum: Forum) => ({
          ...forum,
          title: forum.title?.replace(/^0+|0+$/g, '') || '',
          content: forum.content?.replace(/^0+|0+$/g, '') || ''
        }));
        setForums(sanitizedForums);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat forum');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    // Fetch with new filters
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (newFilters.search) params.append('search', newFilters.search);
      if (newFilters.tags) params.append('tags', newFilters.tags);
      params.append('page', newFilters.page.toString());
      params.append('limit', '20');

      const response = await api.get(`/forums/course/${courseId}?${params.toString()}`);
      if (response.data.success) {
        setForums(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat forum');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['pelajar', 'mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat forum diskusi...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar', 'mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/courses/${courseId}/learn`)}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Learning Page
            </button>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      Forum Diskusi
                    </h1>
                    <p className="text-gray-600 font-medium">{course?.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Diskusikan materi dan ajukan pertanyaan kepada mentor dan sesama siswa.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/courses/${courseId}/forum/create`)}
                  className="btn btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Buat Thread Baru
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari topik diskusi..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter berdasarkan tag (pisahkan dengan koma)..."
                    value={filters.tags}
                    onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="btn btn-primary px-8"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Empty State */}
          {forums.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada diskusi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Jadilah yang pertama memulai diskusi di kursus ini. Tanyakan sesuatu atau bagikan pengetahuanmu!
              </p>
              <button
                onClick={() => router.push(`/courses/${courseId}/forum/create`)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Mulai Diskusi Baru
              </button>
            </div>
          )}

          {/* Forums List */}
          {forums.length > 0 && (
            <div className="space-y-4">
              {forums.map((forum) => (
                <div
                  key={forum.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 hover:border-primary/30 p-6 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/courses/${courseId}/forum/${forum.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {forum.is_pinned && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                        {forum.is_locked && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {forum.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                        {forum.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{forum.author_name}</span>
                        </div>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{formatDate(forum.created_at)}</span>

                        {forum.tags && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-primary font-medium">
                                {forum.tags}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-2 text-gray-500">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">{forum.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-semibold">{forum.replies_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-2 border border-gray-100">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="btn btn-ghost btn-sm disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-4 py-1.5 bg-primary/5 rounded-lg">
                  <span className="text-sm font-bold text-primary">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.totalPages}
                  className="btn btn-ghost btn-sm disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}