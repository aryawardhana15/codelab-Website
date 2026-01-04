'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Submission, Assignment } from '@/types/assignment';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  Clock,
  MessageSquare,
  Award,
  Loader2,
  X,
  Save,
  User
} from 'lucide-react';
import Link from 'next/link';

interface GradeForm {
  score: number;
  feedback?: string;
}

export default function AssignmentSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const assignmentId = params?.assignmentId;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<number | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<GradeForm>();

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/assignments/${assignmentId}`);
      if (response.data.success) {
        setAssignment(response.data.data);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data assignment');
    }
  };

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      if (response.data.success) {
        setSubmissions(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const onGradeSubmit = async (data: GradeForm, submissionId: number) => {
    try {
      const response = await api.post(`/assignments/submissions/${submissionId}/grade`, {
        score: data.score,
        feedback: data.feedback
      });
      if (response.data.success) {
        toast.success('Submission berhasil dinilai');
        setGradingSubmission(null);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menilai submission');
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

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat submissions...</p>
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
              href={`/mentor/courses/${courseId}/assignments`}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Daftar Assignment
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
                  <p className="text-gray-600 line-clamp-1">{assignment?.title || 'Loading...'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-600">
                  Max Score: <span className="font-bold text-gray-900">{assignment?.max_score}</span>
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-600">
                  Total: <span className="font-bold text-gray-900">{submissions.length}</span>
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 text-green-600 font-medium">
                  Graded: <span className="font-bold">{submissions.filter(s => s.graded_at).length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {submissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Submission</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Belum ada siswa yang mengumpulkan tugas atau mengerjakan kuis ini.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Student Info Header */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {submission.student_photo ? (
                        <img
                          src={submission.student_photo}
                          alt={submission.student_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-light-100 flex items-center justify-center border-2 border-white shadow-sm">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{submission.student_name}</h3>
                        <p className="text-sm text-gray-500">{submission.student_email}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {submission.graded_at ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Sudah Dinilai
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Menunggu Penilaian
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission Content */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Submission Details */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Diserahkan pada {formatDate(submission.submitted_at)}</span>
                      </div>

                      {/* Answer Text */}
                      {submission.answer_text && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Jawaban Siswa
                          </h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {submission.answer_text}
                          </p>
                        </div>
                      )}

                      {/* File Attachment */}
                      {submission.file_url && (
                        <a
                          href={submission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <Download className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                              Download Attachment
                            </span>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Right Column - Grading */}
                    <div className="space-y-6">
                      {/* Score Display (if graded) */}
                      {submission.score !== null && submission.score !== undefined && !gradingSubmission && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nilai Akhir</p>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className={`text-5xl font-bold ${getScoreColor(submission.score, assignment?.max_score || 100)}`}>
                              {submission.score}
                            </span>
                            <span className="text-xl text-gray-400 font-medium">
                              /{assignment?.max_score}
                            </span>
                          </div>

                          {/* Feedback Display */}
                          {submission.feedback && (
                            <div className="mt-4 pt-4 border-t border-gray-200 text-left">
                              <h5 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Feedback Mentor
                              </h5>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                {submission.feedback}
                              </p>
                            </div>
                          )}

                          {/* Re-grade Button */}
                          {!submission.graded_at && assignment?.type === 'tugas' && (
                            <button
                              onClick={() => {
                                setGradingSubmission(submission.id);
                                setValue('score', submission.score || 0);
                                setValue('feedback', submission.feedback || '');
                              }}
                              className="mt-4 text-sm text-primary hover:text-primary-600 font-medium underline"
                            >
                              Ubah Penilaian
                            </button>
                          )}
                        </div>
                      )}

                      {/* Grading Form */}
                      {(!submission.graded_at || gradingSubmission === submission.id) && assignment?.type === 'tugas' && (
                        <div className="bg-white rounded-xl border-2 border-primary/10 p-6 shadow-sm">
                          {gradingSubmission !== submission.id ? (
                            <div className="text-center">
                              <button
                                onClick={() => {
                                  setGradingSubmission(submission.id);
                                  setValue('score', 0);
                                  setValue('feedback', '');
                                }}
                                className="btn btn-primary w-full"
                              >
                                <Award className="w-5 h-5 mr-2" />
                                Beri Nilai Sekarang
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={handleSubmit((data) => onGradeSubmit(data, submission.id))}>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  <Award className="w-5 h-5 text-primary" />
                                  Input Nilai
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setGradingSubmission(null)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Score (0 - {assignment?.max_score})
                                  </label>
                                  <input
                                    {...register('score', {
                                      required: 'Score wajib diisi',
                                      min: { value: 0, message: 'Minimal 0' },
                                      max: { value: assignment?.max_score || 100, message: `Maksimal ${assignment?.max_score}` },
                                      valueAsNumber: true
                                    })}
                                    type="number"
                                    min={0}
                                    max={assignment?.max_score}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                                    placeholder="0"
                                  />
                                  {errors.score && (
                                    <p className="mt-2 text-sm text-red-500">{errors.score.message}</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Feedback (Opsional)
                                  </label>
                                  <textarea
                                    {...register('feedback')}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Berikan masukan untuk siswa..."
                                  />
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setGradingSubmission(null)}
                                    className="flex-1 btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-none"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="submit"
                                    className="flex-1 btn btn-primary"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}