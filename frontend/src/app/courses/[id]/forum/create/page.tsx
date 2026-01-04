'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateForumInput } from '@/types/forum';
import {
  ArrowLeft,
  MessageSquare,
  Type,
  AlignLeft,
  Hash,
  Loader2,
  Send
} from 'lucide-react';

export default function CreateForumPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { register, handleSubmit, formState: { errors } } = useForm<CreateForumInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CreateForumInput) => {
    if (!courseId) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/forums/course/${courseId}`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push(`/courses/${courseId}/forum`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat thread');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['pelajar', 'mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/courses/${courseId}/forum`)}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Forum
            </button>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Thread Baru</h1>
                  <p className="text-gray-600 font-medium">Bagikan pertanyaan atau diskusi dengan komunitas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="card p-8">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" />
                Judul Thread *
              </label>
              <input
                {...register('title', { required: 'Judul wajib diisi' })}
                type="text"
                className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Contoh: Bagaimana cara menggunakan loops di Python?"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-primary" />
                Konten *
              </label>
              <textarea
                {...register('content', { required: 'Konten wajib diisi' })}
                rows={12}
                className={`input resize-y min-h-[200px] ${errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Jelaskan pertanyaan atau topik diskusi Anda secara detail..."
              />
              {errors.content && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Tags (Opsional)
              </label>
              <input
                {...register('tags')}
                type="text"
                className="input"
                placeholder="Contoh: python, error, tutorial"
              />
              <p className="mt-2 text-xs text-gray-500">
                Pisahkan beberapa tag dengan koma (,)
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push(`/courses/${courseId}/forum`)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Buat Thread
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
