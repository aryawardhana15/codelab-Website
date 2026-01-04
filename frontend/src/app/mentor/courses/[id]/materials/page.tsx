'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Material } from '@/types/material';
import { Course } from '@/types/course';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Video,
  FileText,
  AlignLeft,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  File
} from 'lucide-react';
import Link from 'next/link';

export default function CourseMaterialsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchMaterials();
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

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/materials/course/${courseId}`);
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat materi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (materialId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      return;
    }

    try {
      const response = await api.delete(`/materials/${materialId}`);
      if (response.data.success) {
        toast.success('Materi berhasil dihapus');
        fetchMaterials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus materi');
    }
  };

  const getMaterialIcon = (material: Material) => {
    if (material.video_url) return <Video className="w-5 h-5 text-red-500" />;
    if (material.file_url) return <File className="w-5 h-5 text-blue-500" />;
    if (material.content) return <AlignLeft className="w-5 h-5 text-purple-500" />;
    return <BookOpen className="w-5 h-5 text-gray-500" />;
  };

  if (isLoading) {
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

        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Materi Kursus</h1>
                <p className="text-gray-600 max-w-2xl">
                  {course?.title || 'Loading...'}
                </p>
              </div>

              <button
                onClick={() => router.push(`/mentor/courses/${courseId}/materials/create`)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Materi
              </button>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 mt-6 text-sm text-gray-600">
              <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                <BookOpen className="w-4 h-4 text-primary" />
                {materials.length} Total Materi
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                <Video className="w-4 h-4 text-red-500" />
                {materials.filter(m => m.video_url).length} Video
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200">
                <File className="w-4 h-4 text-blue-500" />
                {materials.filter(m => m.file_url).length} File
              </span>
            </div>
          </div>

          {/* Empty State */}
          {materials.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Materi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Silakan tambahkan materi pembelajaran pertama untuk kursus ini.
              </p>
              <button
                onClick={() => router.push(`/mentor/courses/${courseId}/materials/create`)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Materi
              </button>
            </div>
          )}

          {/* Materials List */}
          {materials.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {materials.map((material, index) => (
                  <div
                    key={material.id}
                    className="group p-4 hover:bg-light-50 transition-colors flex items-center gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-light-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-gray-900 truncate pr-4">
                          {material.title}
                        </h3>
                        {/* Type Icon */}
                        <div className="shrink-0">
                          {getMaterialIcon(material)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {material.description || 'Tidak ada deskripsi'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                      <button
                        onClick={() => router.push(`/mentor/courses/${courseId}/materials/${material.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}