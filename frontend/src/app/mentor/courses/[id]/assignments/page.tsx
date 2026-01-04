'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Assignment } from '@/types/assignment';
import { Course } from '@/types/course';
import {
  ArrowLeft,
  FileText,
  Target,
  Plus,
  Calendar,
  Star,
  Users,
  Pencil,
  Trash2,
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CourseAssignmentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchAssignments();
    }
  }, [courseId]);

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

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/assignments/course/${courseId}`);
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus assignment ini?')) {
      return;
    }

    try {
      const response = await api.delete(`/assignments/${assignmentId}`);
      if (response.data.success) {
        toast.success('Assignment berhasil dihapus');
        fetchAssignments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus assignment');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat tugas...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/mentor/courses"
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Kelola Kursus
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tugas & Kuis</h1>
                  <p className="text-gray-600">{course?.title || 'Loading...'}</p>
                </div>
              </div>

              <button
                onClick={() => router.push(`/mentor/courses/${courseId}/assignments/create`)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Buat Tugas
              </button>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 mt-6 text-sm text-gray-600">
              <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                <FileText className="w-4 h-4 text-primary" />
                {assignments.filter(a => a.type === 'tugas').length} Tugas
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                <Target className="w-4 h-4 text-red-500" />
                {assignments.filter(a => a.type === 'kuis').length} Kuis
              </span>
            </div>
          </div>

          {/* Empty State */}
          {assignments.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Tugas</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Buat tugas atau kuis untuk menguji pemahaman siswa.
              </p>
              <button
                onClick={() => router.push(`/mentor/courses/${courseId}/assignments/create`)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Buat Tugas Pertama
              </button>
            </div>
          )}

          {/* Assignments Grid */}
          {assignments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => {
                const isTugas = assignment.type === 'tugas';
                const isPassed = isDeadlinePassed(assignment.deadline);

                return (
                  <div
                    key={assignment.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${isTugas
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-orange-50 text-orange-700 border-orange-100'
                          }`}>
                          {isTugas ? <FileText className="w-3 h-3 mr-1" /> : <Target className="w-3 h-3 mr-1" />}
                          {isTugas ? 'Tugas' : 'Kuis'}
                        </span>

                        {assignment.deadline && (
                          <span className={`text-xs font-medium flex items-center ${isPassed ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {isPassed ? 'Selesai' : 'Deadline'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {assignment.title}
                      </h3>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {assignment.description || 'Tidak ada deskripsi'}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>Max Score: <b>{assignment.max_score}</b></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${isPassed ? 'text-red-500' : 'text-gray-400'}`} />
                          <span className={isPassed ? 'text-red-600 font-medium' : ''}>
                            {formatDate(assignment.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => router.push(`/mentor/courses/${courseId}/assignments/${assignment.id}/submissions`)}
                        className="flex-1 btn btn-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 !text-xs"
                      >
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        Submissions
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/mentor/courses/${courseId}/assignments/${assignment.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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