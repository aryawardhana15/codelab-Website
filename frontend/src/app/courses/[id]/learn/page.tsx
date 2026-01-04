'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import AIPracticeModal from '@/components/AIPracticeModal';
import { Material } from '@/types/material';
import { Course } from '@/types/course';
import {
  ChevronLeft, ChevronRight, PlayCircle, FileText, CheckCircle,
  MessageSquare, Layout, Sparkles, Download, ArrowLeft, Trophy
} from 'lucide-react';

export default function LearnCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);

      // Fetch course info
      const courseResponse = await api.get(`/courses/${courseId}`);
      if (courseResponse.data.success) {
        setCourse(courseResponse.data.data);
      }

      // Fetch materials
      const materialsResponse = await api.get(`/materials/course/${courseId}`);
      if (materialsResponse.data.success) {
        const mats = materialsResponse.data.data;
        setMaterials(mats);

        // Find first uncompleted material
        const firstUncompleted = mats.findIndex((m: Material) => !m.is_completed);
        if (firstUncompleted !== -1) {
          setCurrentMaterialIndex(firstUncompleted);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat data kursus');
      router.push('/my-courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    const currentMaterial = materials[currentMaterialIndex];

    if (!currentMaterial) return;

    if (currentMaterial.is_completed) {
      toast('Materi ini sudah ditandai selesai', { icon: 'ℹ️' });
      return;
    }

    setIsMarkingComplete(true);
    try {
      const response = await api.post(`/materials/${currentMaterial.id}/complete`);

      if (response.data.success) {
        toast.success(response.data.message);

        // Update local state
        const updatedMaterials = [...materials];
        updatedMaterials[currentMaterialIndex].is_completed = true;
        updatedMaterials[currentMaterialIndex].completed_at = new Date().toISOString();
        updatedMaterials[currentMaterialIndex].completed_at = new Date().toISOString();
        // updatedMaterials[currentMaterialIndex].user_xp = currentMaterial.xp_reward; // Removed as xp_reward is not in schema
        setMaterials(updatedMaterials);

        // Auto navigate to next material if exists
        if (currentMaterialIndex < materials.length - 1) {
          setTimeout(() => {
            setCurrentMaterialIndex(currentMaterialIndex + 1);
          }, 1500);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menandai materi selesai');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentMaterialIndex > 0) {
      setCurrentMaterialIndex(currentMaterialIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMaterialIndex < materials.length - 1) {
      setCurrentMaterialIndex(currentMaterialIndex + 1);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50 flex justify-center items-center">
          <div className="animate-spin text-primary">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (materials.length === 0) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <div className="inline-flex p-6 bg-gray-100 rounded-full mb-6">
              <Layout className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum ada materi</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Materi akan segera ditambahkan oleh mentor. Silakan cek kembali nanti!</p>
            <button
              onClick={() => router.push('/my-courses')}
              className="btn btn-primary"
            >
              Kembali ke Kursus Saya
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentMaterial = materials[currentMaterialIndex];
  if (!currentMaterial) return null;

  const completedCount = materials.filter(m => m.is_completed).length;
  const progressPercentage = Math.round((completedCount / materials.length) * 100);

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50 flex flex-col">
        <Navbar />

        {/* Top Bar - Progress & Title */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/my-courses')}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-gray-900 line-clamp-1">{course?.title}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span>{progressPercentage}% Selesai</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/courses/${courseId}/assignments`)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Tugas
              </button>
              <button
                onClick={() => router.push(`/courses/${courseId}/forum`)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Forum
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar - Material List */}
            <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    Daftar Materi
                  </h2>
                </div>
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {materials.map((material, index) => (
                    <button
                      key={material.id}
                      onClick={() => setCurrentMaterialIndex(index)}
                      className={`w-full text-left p-3 rounded-xl mb-1 transition-all duration-200 flex items-start gap-3 group ${index === currentMaterialIndex
                        ? 'bg-primary-50 border border-primary-100 shadow-sm'
                        : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border ${material.is_completed
                        ? 'bg-success text-white border-success'
                        : index === currentMaterialIndex
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                        {material.is_completed ? <CheckCircle className="w-3 h-3" /> : index + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium line-clamp-2 ${index === currentMaterialIndex ? 'text-primary-900' : 'text-gray-700'
                          }`}>
                          {material.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400 capitalize flex items-center gap-1">
                            {material.video_url ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {material.video_url ? 'Video' : 'Materi'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full order-1 lg:order-2 min-w-0">
              <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                {/* Content Header */}
                <div className="p-6 md:p-8 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{currentMaterial.title}</h2>
                      {currentMaterial.description && (
                        <p className="text-gray-600">{currentMaterial.description}</p>
                      )}
                    </div>
                    {currentMaterial.is_completed && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold text-sm shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Selesai</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Player */}
                {currentMaterial.video_url && (
                  <div className="w-full aspect-video bg-black relative group">
                    {getYoutubeEmbedUrl(currentMaterial.video_url) ? (
                      <iframe
                        src={getYoutubeEmbedUrl(currentMaterial.video_url)!}
                        title={currentMaterial.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full text-white">
                        Invalid Video URL
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 md:p-8 space-y-8">
                  {/* Text Content */}
                  {currentMaterial.content && (
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="whitespace-pre-wrap font-sans">{currentMaterial.content}</div>
                    </div>
                  )}

                  {/* Attachments */}
                  {currentMaterial.file_url && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors group">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Download className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Materi Tambahan</p>
                        <p className="text-xs text-gray-500">Klik untuk mengunduh file</p>
                      </div>
                      <a
                        href={currentMaterial.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-light text-sm"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  {/* Action Area */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                    <button
                      onClick={() => setIsAIModalOpen(true)}
                      className="flex-1 btn btn-light py-4 text-base justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                    >
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
                      Latihan dengan AI
                    </button>

                    {!currentMaterial.is_completed && (
                      <button
                        onClick={handleMarkComplete}
                        disabled={isMarkingComplete}
                        className="flex-1 btn btn-primary py-4 text-base justify-center shadow-glow-primary hover:shadow-glow-primary-lg"
                      >
                        {isMarkingComplete ? 'Memproses...' : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Tandai Selesai
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentMaterialIndex === 0}
                      className="btn btn-ghost text-gray-500 hover:text-gray-900 disabled:opacity-0 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      Sebelumnya
                    </button>
                    <span className="text-sm font-medium text-gray-400">
                      {currentMaterialIndex + 1} dari {materials.length}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentMaterialIndex === materials.length - 1}
                      className="btn btn-ghost text-gray-500 hover:text-gray-900 disabled:opacity-0 transition-opacity"
                    >
                      Selanjutnya
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AIPracticeModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          materialContent={currentMaterial?.content || currentMaterial?.description || ''}
        />
      </div>
    </ProtectedRoute>
  );
}
