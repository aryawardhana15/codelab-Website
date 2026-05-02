'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Course } from '@/types/course';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  FileText,
  Users,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  BarChart2,
  Clock,
  CheckCircle,
  AlertCircle,
  MessagesSquare,
} from 'lucide-react';
import Link from 'next/link';

export default function MentorCoursesPage() {
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
      const response = await api.get('/courses/my/created');

      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized - ProtectedRoute will handle redirect');
        return;
      }
      toast.error(error.response?.data?.message || 'Gagal memuat kursus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kursus ini?')) {
      return;
    }

    try {
      const response = await api.delete(`/courses/${courseId}`);

      if (response.data.success) {
        toast.success('Kursus berhasil dihapus');
        fetchMyCourses(); // Refresh list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kursus');
    }
  };

  const handleTogglePublish = async (
    courseId: number,
    currentStatus: boolean,
  ) => {
    try {
      const response = await api.put(`/courses/${courseId}`, {
        is_published: !currentStatus,
      });

      if (response.data.success) {
        toast.success(
          currentStatus ? 'Kursus unpublished' : 'Kursus published',
        );
        fetchMyCourses(); // Refresh list
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Gagal mengupdate status kursus',
      );
    }
  };

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
          <p className="mt-4 text-gray-600 font-medium">Loading Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kelola Kursus
                </h1>
              </div>
              <p className="text-gray-600">
                Total {courses.length} kursus telah Anda buat
              </p>
            </div>

            <Link href="/mentor/courses/create" className="btn btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Buat Kursus Baru
            </Link>
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Belum Ada Kursus
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Mulai bagikan ilmumu dengan membuat kursus pertama.
              </p>
              <Link href="/mentor/courses/create" className="btn btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Buat Kursus Pertama
              </Link>
            </div>
          )}

          {/* Courses Grid */}
          {courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => {
                const isPublished = course.is_published;

                return (
                  <div
                    key={course.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-glow-primary transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Course Banner/Header */}
                    <div className="h-32 bg-gray-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                      {course.thumbnail ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${course.thumbnail})`,
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-brand flex items-center justify-center`}
                        >
                          <BookOpen className="w-12 h-12 text-white/50" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isPublished
                              ? 'bg-success/90 text-white border-success backdrop-blur-sm'
                              : 'bg-gray-100/90 text-gray-600 border-gray-200 backdrop-blur-sm'
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-light-100 text-xs font-medium text-gray-600 border border-gray-200">
                          {course.category || 'Uncategorized'}
                        </span>
                        {course.price > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-green-50 text-xs font-medium text-green-700 border border-green-100">
                            Rp {course.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-blue-700 border border-blue-100">
                            Gratis
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{course.enrollmentCount || 0} Siswa</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{course.materialsCount || 0} Materi</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                        <button
                          onClick={() =>
                            router.push(`/mentor/courses/${course.id}`)
                          }
                          className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors"
                          title="Detail"
                        >
                          <Eye className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-medium">
                            Detail
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/mentor/courses/${course.id}/materials`,
                            )
                          }
                          className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors"
                          title="Materi"
                        >
                          <FileText className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-medium">
                            Materi
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/mentor/courses/${course.id}/edit`)
                          }
                          className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-medium">Edit</span>
                        </button>

                        <div className="col-span-1 relative group/menu">
                          <button className="w-full h-full flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors">
                            <MoreVertical className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">
                              Lainnya
                            </span>
                          </button>

                          {/* Dropdown Menu */}
                          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover/menu:block z-10">
                            <button
                              onClick={() =>
                                handleTogglePublish(
                                  course.id,
                                  course.is_published,
                                )
                              }
                              className="w-full text-left px-4 py-3 text-sm hover:bg-light-50 flex items-center gap-2 text-gray-700"
                            >
                              {course.is_published ? (
                                <>
                                  <EyeOff className="w-4 h-4 text-orange-500" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  Publish
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/mentor/courses/${course.id}/students`,
                                )
                              }
                              className="w-full text-left px-4 py-3 text-sm hover:bg-light-50 flex items-center gap-2 text-gray-700"
                            >
                              <Users className="w-4 h-4 text-blue-500" />
                              Data Siswa
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/mentor/courses/${course.id}/assignments`,
                                )
                              }
                              className="w-full text-left px-4 py-3 text-sm hover:bg-light-50 flex items-center gap-2 text-gray-700"
                            >
                              <FileText className="w-4 h-4 text-purple-500" />
                              Tugas
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/courses/${course.id}/forum`)
                              }
                              className="w-full text-left px-4 py-3 text-sm hover:bg-light-50 flex items-center gap-2 text-gray-700"
                            >
                              <MessagesSquare className="w-4 h-4 text-green-500" />
                              Forum
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus Kursus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
