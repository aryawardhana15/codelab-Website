'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateCourseInput } from '@/types/course';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Grid,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  Layers,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateCourseInput>();
  const watchThumbnail = watch('thumbnail_url');

  const onSubmit = async (data: CreateCourseInput) => {
    setIsLoading(true);
    try {
      const response = await api.post('/courses', data);

      if (response.data.success) {
        toast.success('Kursus berhasil dibuat');
        router.push('/mentor/courses');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat kursus');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/mentor/courses"
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Kelola Kursus
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buat Kursus Baru</h1>
                <p className="text-gray-600">Bagikan ilmumu dan buat dampak nyata bagi siswa.</p>
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
                    Judul Kursus <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title', { required: 'Judul kursus wajib diisi' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="Contoh: Belajar React dari Nol sampai Mahir"
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
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 resize-none"
                    placeholder="Jelaskan apa yang akan dipelajari siswa di kursus ini..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Grid className="w-5 h-5" />
                    </div>
                    <select
                      {...register('category')}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Programming">Programming</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Geografi">Geografi</option>
                      <option value="Ekonomi">Ekonomi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Level & Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Detail & Harga</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tingkat Kesulitan <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('difficulty', { required: 'Tingkat kesulitan wajib dipilih' })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="beginner">Pemula</option>
                    <option value="intermediate">Menengah</option>
                    <option value="advanced">Mahir</option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenjang Pendidikan
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <select
                      {...register('education_level')}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Jenjang</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="Kuliah">Kuliah</option>
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      Rp
                    </div>
                    <input
                      {...register('price', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Harga tidak boleh negatif' }
                      })}
                      type="number"
                      min="0"
                      step="1000"
                      defaultValue={0}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.price.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    * Masukkan 0 untuk membuat kursus gratis
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Thumbnail Kursus</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Gambar
                </label>
                <div className="flex gap-4">
                  <input
                    {...register('thumbnail_url')}
                    type="url"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {watchThumbnail && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={watchThumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Langsung Publikasikan?</h3>
                  <p className="text-sm text-gray-500">
                    Jika diaktifkan, kursus akan langsung terlihat oleh siswa setelah disimpan.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  {...register('is_published')}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/mentor/courses')}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary px-8 py-3 rounded-xl font-boldshadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Buat Kursus
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