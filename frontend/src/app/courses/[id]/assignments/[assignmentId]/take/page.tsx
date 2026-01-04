'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Assignment, QuizQuestion, SubmitQuizInput } from '@/types/assignment';
import {
  Clock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Target,
  Loader2,
  Calendar,
  Send
} from 'lucide-react';

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const assignmentId = params?.assignmentId;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: number]: 'a' | 'b' | 'c' | 'd' }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

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
        if (data.type !== 'kuis') {
          toast.error('Ini bukan halaman untuk kuis');
          router.push(`/courses/${courseId}/assignments`);
          return;
        }
        if (data.submission) {
          // Already submitted, show result
          setShowResult(true);
          setResult({
            score: data.submission.score,
            totalQuestions: data.questions?.length || 0,
            percentage: data.submission.score ? Math.round((data.submission.score / (data.questions?.length || 1) / 10) * 100) : 0
          });
        }
        setAssignment(data);
        setQuestions(data.questions || []);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data kuis');
      router.push(`/courses/${courseId}/assignments`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: 'a' | 'b' | 'c' | 'd') => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!assignmentId) return;

    // Check if all questions answered
    if (Object.keys(answers).length !== questions.length) {
      toast.error('Silakan jawab semua pertanyaan');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: SubmitQuizInput = {
        answers: questions.map(q => ({
          question_id: q.id,
          selected_answer: answers[q.id] || 'a'
        }))
      };

      const response = await api.post(`/assignments/${assignmentId}/submit-quiz`, payload);
      if (response.data.success) {
        toast.success(response.data.message);
        setResult(response.data.data);
        setShowResult(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal submit kuis');
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
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat kuis...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (showResult && result) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />

          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="card p-8 text-center max-w-lg mx-auto">
              <div className="mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border border-green-100 shadow-sm animate-bounce-short">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Kuis Selesai!</h2>
                <p className="text-gray-500 mb-8">
                  Kamu telah menyelesaikan kuis ini. Berikut adalah hasilmu:
                </p>

                <div className="bg-gradient-to-br from-light-50 to-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-inner">
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Nilai Akhir</p>
                  <p className="text-5xl font-extrabold text-primary mb-2">
                    {result.score}
                    <span className="text-lg text-gray-400 font-medium">/{result.totalQuestions * 10}</span>
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${result.percentage >= 80 ? 'bg-green-500' :
                          result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    Akurasi Jawaban: {result.percentage}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/courses/${courseId}/assignments`)}
                className="btn btn-primary w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Tugas
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push(`/courses/${courseId}/assignments`)}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Batal & Kembali
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {assignment?.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {assignment?.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Deadline: {formatDate(assignment.deadline)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    Max Score: {assignment?.max_score}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {assignment?.description && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 text-blue-900">
              <h2 className="text-sm font-bold uppercase tracking-wide text-blue-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Petunjuk Pengerjaan
              </h2>
              <p className="text-blue-800/80 whitespace-pre-wrap text-sm leading-relaxed">
                {assignment.description}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="card p-6 border-l-4 border-l-primary hover:border-l-primary-600 transition-all">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 leading-relaxed">
                      {question.question_text}
                    </h3>
                    <div className="space-y-3">
                      {(['a', 'b', 'c', 'd'] as const).map((option) => (
                        <label
                          key={option}
                          className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group ${answers[question.id] === option
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleAnswerChange(question.id, option)}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <div className="ml-3 flex-1 flex items-start gap-3">
                            <span className={`text-sm font-bold uppercase w-6 ${answers[question.id] === option ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                              }`}>
                              {option}.
                            </span>
                            <span className={`text-sm ${answers[question.id] === option ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}>
                              {question[`option_${option}` as keyof QuizQuestion] as string}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-light-50/90 backdrop-blur-sm pb-8 z-10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">
                <span className="text-primary font-bold">{Object.keys(answers).length}</span> dari <span className="text-gray-900 font-bold">{questions.length}</span> soal terjawab
              </div>

              <div className="w-1/3 mx-4 hidden sm:block">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                className="btn btn-primary min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Kuis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
