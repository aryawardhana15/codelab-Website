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
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Award,
  Calendar,
  Loader2
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
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
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat assignments...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/courses/${courseId}/learn`}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Learning Page
            </Link>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Assignments & Kuis
                  </h1>
                  <p className="text-gray-600 font-medium">{course?.title}</p>
                </div>
              </div>
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada tugas</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Belum ada tugas atau kuis yang diberikan oleh mentor untuk kursus ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => {
                const isPassed = isDeadlinePassed(assignment.deadline);
                const hasSubmitted = assignment.submitted;
                const typeIcon = assignment.type === 'tugas' ? <FileText className="w-5 h-5" /> : <Target className="w-5 h-5" />;
                const typeLabel = assignment.type === 'tugas' ? 'Tugas' : 'Kuis';
                const typeColor = assignment.type === 'tugas' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-orange-600 bg-orange-50 border-orange-100';

                return (
                  <div
                    key={assignment.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${typeColor}`}>
                          {typeIcon}
                          {typeLabel}
                        </span>
                        {hasSubmitted && (
                          <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Selesai
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {assignment.title}
                      </h3>

                      {assignment.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {assignment.description}
                        </p>
                      )}

                      <div className="space-y-3 text-sm border-t border-gray-50 pt-4 mt-auto">
                        <div className="flex items-center justify-between text-gray-600">
                          <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            Max Score
                          </span>
                          <span className="font-bold text-gray-900">{assignment.max_score}</span>
                        </div>

                        {assignment.deadline && (
                          <div className="flex items-center justify-between text-gray-600">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Deadline
                            </span>
                            <span className={`font-medium ${isPassed && !hasSubmitted ? 'text-red-500' : 'text-gray-900'}`}>
                              {formatDate(assignment.deadline)}
                            </span>
                          </div>
                        )}

                        {assignment.submission && (
                          <div className="bg-gray-50 rounded-xl p-3 mt-3 border border-gray-100">
                            {assignment.submission.score !== null && assignment.submission.score !== undefined ? (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase">Nilai Kamu</span>
                                <span className={`font-bold ${assignment.submission.score >= 80 ? 'text-green-600' :
                                    assignment.submission.score >= 60 ? 'text-blue-600' :
                                      'text-orange-600'
                                  }`}>
                                  {assignment.submission.score} / {assignment.max_score}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                Menunggu Penilaian
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      {hasSubmitted ? (
                        <button
                          onClick={() => router.push(`/courses/${courseId}/assignments/${assignment.id}/view`)}
                          className="w-full btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30"
                        >
                          Lihat Submission
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (assignment.type === 'tugas') {
                              router.push(`/courses/${courseId}/assignments/${assignment.id}/submit`);
                            } else {
                              router.push(`/courses/${courseId}/assignments/${assignment.id}/take`);
                            }
                          }}
                          disabled={isPassed}
                          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isPassed ? (
                            <>Deadline Terlewat</>
                          ) : (
                            <>
                              {assignment.type === 'tugas' ? 'Kerjakan Tugas' : 'Mulai Kuis'}
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
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
