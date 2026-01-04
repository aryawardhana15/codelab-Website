'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateMaterialInput } from '@/types/material';
import {
  ArrowLeft,
  FileText,
  Video,
  File,
  BookOpen,
  AlertCircle,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function EditMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const materialId = params?.materialId;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateMaterialInput>();

  const watchVideo = watch('video_url');
  const watchContent = watch('content');
  const watchFile = watch('file_url');

  useEffect(() => {
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  const fetchMaterial = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/materials/${materialId}`);

      if (response.data.success) {
        const material = response.data.data;
        setValue('title', material.title);
        setValue('description', material.description || '');
        setValue('content', material.content || '');
        setValue('video_url', material.video_url || '');
        setValue('file_url', material.file_url || '');
      }
    } catch (error: any) {
      toast.error('Gagal memuat data materi');
      router.push(`/mentor/courses/${courseId}/materials`);
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: CreateMaterialInput) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/materials/${materialId}`, data);

      if (response.data.success) {
        toast.success('Materi berhasil diupdate');
        router.push(`/mentor/courses/${courseId}/materials`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate materi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <ProtectedRoute allowedRoles={['mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat materi...</p>
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
              href={`/mentor/courses/${courseId}/materials`}
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Daftar Materi
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Materi</h1>
                <p className="text-gray-600">Perbarui konten materi pembelajaran.</p>
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Materi <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title', { required: 'Judul materi wajib diisi' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="Contoh: Pengenalan Aljabar Linear"
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
                    Deskripsi Singkat
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-gray-400"
                    placeholder="Ringkasan tentang materi ini..."
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Konten Materi</h2>
              </div>

              <div className="space-y-6">

                {/* Tips Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Anda dapat menambahkan kombinasi teks, video, atau file untuk membuat materi yang lengkap.
                  </p>
                </div>

                {/* Text Content */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-bold text-gray-700">
                      Konten Teks (Markdown)
                    </label>
                  </div>
                  <textarea
                    {...register('content')}
                    rows={8}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Tulis konten pembelajaran di sini..."
                  />
                </div>

                {/* Video URL */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-red-500" />
                    <label className="text-sm font-bold text-gray-700">
                      Video URL (YouTube/Vimeo)
                    </label>
                  </div>
                  <input
                    {...register('video_url')}
                    type="url"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                {/* File URL */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <File className="w-5 h-5 text-blue-500" />
                    <label className="text-sm font-bold text-gray-700">
                      File Attachment URL
                    </label>
                  </div>
                  <input
                    {...register('file_url')}
                    type="url"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/mentor/courses/${courseId}/materials`)}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary px-8 py-3 rounded-xl font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
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