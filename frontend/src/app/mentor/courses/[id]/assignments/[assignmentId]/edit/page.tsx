'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateAssignmentInput, Assignment } from '@/types/assignment';
import {
  ArrowLeft,
  FileText,
  Target,
  Plus,
  Calendar,
  Star,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface QuestionForm {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
}

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const assignmentId = params?.assignmentId;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateAssignmentInput & { questions: QuestionForm[] }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const assignmentType = watch('type');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/assignments/${assignmentId}`);

      if (response.data.success) {
        const assignment: Assignment = response.data.data;
        setValue('title', assignment.title);
        setValue('description', assignment.description || '');
        setValue('type', assignment.type);
        setValue('deadline', assignment.deadline ? new Date(assignment.deadline).toISOString().slice(0, 16) : '');
        setValue('max_score', assignment.max_score);

        if (assignment.type === 'kuis' && assignment.questions) {
          setQuestions(assignment.questions.map(q => ({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer || 'a'
          })));
        }
      }
    } catch (error: any) {
      toast.error('Gagal memuat data assignment');
      router.push(`/mentor/courses/${courseId}/assignments`);
    } finally {
      setIsFetching(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'a'
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: string | 'a' | 'b' | 'c' | 'd') => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const onSubmit = async (data: CreateAssignmentInput & { questions?: QuestionForm[] }) => {
    if (!courseId || !assignmentId) return;

    if (data.type === 'kuis' && questions.length === 0) {
      toast.error('Kuis harus memiliki minimal 1 pertanyaan');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<CreateAssignmentInput> = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        max_score: data.max_score || 100
      };

      if (data.type === 'kuis' && questions.length > 0) {
        payload.questions = questions.map(q => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer
        }));
      }

      const response = await api.put(`/assignments/${assignmentId}`, payload);
      if (response.data.success) {
        toast.success('Assignment berhasil diupdate');
        router.push(`/mentor/courses/${courseId}/assignments`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <ProtectedRoute allowedRoles={['mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat assignment...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/mentor/courses/${courseId}/assignments`}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Daftar Assignment
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
                <p className="text-gray-600">Perbarui informasi dan konten assignment Anda.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Informasi Dasar</h2>
              </div>

              <div className="space-y-6">
                {/* Type (Display Only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Assignment
                  </label>
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl font-medium text-sm border ${assignmentType === 'tugas'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                    {assignmentType === 'tugas' ? (
                      <><FileText className="w-4 h-4 mr-2" /> Tugas (File/Text)</>
                    ) : (
                      <><Target className="w-4 h-4 mr-2" /> Kuis (Pilihan Ganda)</>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Assignment <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title', { required: 'Judul wajib diisi' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="Contoh: Tugas Analisis Data"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-gray-400"
                    placeholder="Jelaskan instruksi pengerjaan..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('deadline')}
                        type="datetime-local"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Max Score */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nilai Maksimal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Star className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('max_score', { valueAsNumber: true })}
                        type="number"
                        min={1}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Questions Section */}
            {assignmentType === 'kuis' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Pertanyaan Kuis</h2>
                      <p className="text-xs text-gray-500">{questions.length} pertanyaan</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Soal
                  </button>
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="inline-block p-4 bg-white rounded-full mb-3 shadow-sm">
                      <HelpCircle className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-600 font-medium">Belum ada pertanyaan</p>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="mt-4 btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah Soal
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className="relative p-6 border border-gray-200 rounded-xl bg-gray-50/50 hover:border-primary/30 transition-all">
                      {/* Question Number Badge */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm z-10">
                        {index + 1}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus soal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="mt-2 space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pertanyaan
                          </label>
                          <textarea
                            value={question.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Tulis soal kuis..."
                            required
                          />
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['a', 'b', 'c', 'd'].map((opt) => (
                            <div key={opt}>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Opsi {opt.toUpperCase()}
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold">
                                  {opt.toUpperCase()}.
                                </span>
                                <input
                                  type="text"
                                  value={(question as any)[`option_${opt}`]}
                                  onChange={(e) => updateQuestion(index, `option_${opt}` as keyof QuestionForm, e.target.value)}
                                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                  placeholder={`Jawaban ${opt.toUpperCase()}`}
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Correct Answer */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          <label className="block text-sm font-semibold text-blue-800 mb-2">
                            Kunci Jawaban
                          </label>
                          <div className="flex gap-4">
                            {['a', 'b', 'c', 'd'].map((opt) => (
                              <label key={opt} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`correct_${index}`}
                                  value={opt}
                                  checked={question.correct_answer === opt}
                                  onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value as any)}
                                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 uppercase">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/mentor/courses/${courseId}/assignments`)}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-8 py-3 rounded-xl font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}