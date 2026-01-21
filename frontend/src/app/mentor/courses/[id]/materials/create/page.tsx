'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import MarkdownEditor from '@/components/MarkdownEditor';
import { CreateMaterialInput } from '@/types/material';
import { Course } from '@/types/course';
import {
  ArrowLeft,
  FileText,
  Video,
  File,
  BookOpen,
  AlertCircle,
  Save,
  Loader2,
  Info,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function CreateMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextOrderIndex, setNextOrderIndex] = useState(0);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<CreateMaterialInput>();

  const watchVideo = watch('video_url');
  const watchContent = watch('content');
  const watchFile = watch('file_url');

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchNextOrderIndex();
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
      router.push('/mentor/courses');
    }
  };

  const fetchNextOrderIndex = async () => {
    try {
      const response = await api.get(`/materials/course/${courseId}`);
      if (response.data.success) {
        const materials = response.data.data;
        const maxOrder = materials.length > 0
          ? Math.max(...materials.map((m: any) => m.order_index))
          : -1;
        setNextOrderIndex(maxOrder + 1);
      }
    } catch (error) {
      setNextOrderIndex(0);
    }
  };

  const onSubmit = async (data: CreateMaterialInput) => {
    setIsLoading(true);
    try {
      const materialData = {
        ...data,
        course_id: parseInt(courseId as string),
        order_index: nextOrderIndex
      };

      const response = await api.post('/materials', materialData);

      if (response.data.success) {
        toast.success('Materi berhasil dibuat');
        router.push(`/mentor/courses/${courseId}/materials`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat materi');
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypeCount = () => {
    let count = 0;
    if (watchContent) count++;
    if (watchVideo) count++;
    if (watchFile) count++;
    return count;
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Tambah Materi Baru</h1>
                <p className="text-gray-600">{course?.title || 'Loading...'}</p>
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
                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Tulis konten pembelajaran di sini..."
                        rows={12}
                      />
                    )}
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

            {/* Access Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Pengaturan Akses</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <input
                    {...register('is_locked')}
                    type="checkbox"
                    id="is_locked"
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_locked" className="flex-1 cursor-pointer">
                    <span className="block font-semibold text-gray-700">Kunci Materi Ini</span>
                    <span className="text-sm text-gray-500">Materi hanya dapat diakses dengan password</span>
                  </label>
                </div>

                {watch('is_locked') && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Akses <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('lock_password', {
                        required: watch('is_locked') ? 'Password wajib diisi jika materi dikunci' : false
                      })}
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                      placeholder="Masukkan password untuk membuka materi..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Berikan password ini kepada siswa yang diizinkan mengakses materi ini.
                    </p>
                    {errors.lock_password && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lock_password.message}
                      </p>
                    )}
                  </div>
                )}
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
                    Simpan Materi
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