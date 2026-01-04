'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Assignment, SubmitAssignmentInput } from '@/types/assignment';

export default function SubmitAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const assignmentId = params?.assignmentId;
  const { register, handleSubmit, formState: { errors } } = useForm<SubmitAssignmentInput>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/assignments/${assignmentId}`);
      if (response.data.success) {
        const data = response.data.data;
        if (data.type !== 'tugas') {
          toast.error('Ini bukan halaman untuk tugas');
          router.push(`/courses/${courseId}/assignments`);
          return;
        }
        if (data.submission) {
          toast.error('Anda sudah submit tugas ini');
          router.push(`/courses/${courseId}/assignments`);
          return;
        }
        setAssignment(data);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data assignment');
      router.push(`/courses/${courseId}/assignments`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SubmitAssignmentInput) => {
    if (!assignmentId) return;

    if (!data.answer_text && !data.file_url) {
      toast.error('Jawaban atau file wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/assignments/${assignmentId}/submit`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push(`/courses/${courseId}/assignments`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal submit tugas');
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-gray">
          <Navbar />
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-gray">
        <Navbar />

        <div className="container-app py-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <button
                onClick={() => router.push(`/courses/${courseId}/assignments`)}
                className="text-light-500 hover:text-primary mb-4 transition-colors font-medium flex items-center gap-2"
              >
                ← Kembali
              </button>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                Submit Tugas: {assignment?.title}
              </h1>
              {assignment?.deadline && (
                <div className="flex items-center gap-2 text-sm text-light-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Deadline: {formatDate(assignment.deadline)}</span>
                </div>
              )}
            </div>

            <div className="card mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-light-200 pb-2">Deskripsi Tugas</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{assignment?.description || 'Tidak ada deskripsi'}</p>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <span className="badge badge-secondary text-sm">
                  Max Score: {assignment?.max_score}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jawaban (Text) *
                </label>
                <textarea
                  {...register('answer_text', { required: 'Jawaban atau file wajib diisi' })}
                  rows={10}
                  className="input resize-none bg-gray-50 focus:bg-white"
                  placeholder="Tulis jawaban Anda di sini..."
                />
                {errors.answer_text && <p className="mt-2 text-sm text-error">{errors.answer_text.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File URL (Opsional)
                </label>
                <div className="relative">
                  <input
                    {...register('file_url', {
                      validate: (value) => {
                        const answerText = (document.querySelector('textarea[name="answer_text"]') as HTMLTextAreaElement)?.value;
                        if (!value && !answerText) {
                          return 'Jawaban atau file wajib diisi';
                        }
                        if (value && !value.match(/^https?:\/\/.+/)) {
                          return 'File URL harus valid (http:// atau https://)';
                        }
                        return true;
                      }
                    })}
                    type="url"
                    placeholder="https://example.com/file.pdf"
                    className="input pl-10 bg-gray-50 focus:bg-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                {errors.file_url && <p className="mt-2 text-sm text-error">{errors.file_url.message}</p>}
                <p className="mt-2 text-sm text-light-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upload file Anda ke Google Drive, Dropbox, atau layanan cloud lainnya, lalu paste URL di sini
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-light-200">
                <button
                  type="button"
                  onClick={() => router.push(`/courses/${courseId}/assignments`)}
                  className="btn btn-light"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary shadow-lg hover:shadow-glow-primary min-w-[150px]"
                >
                  {isSubmitting ? 'Mengirim...' : 'Submit Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
