'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Forum, ForumReply, CreateReplyInput } from '@/types/forum';

export default function ForumDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const forumId = params?.forumId;
  const { user } = useAuth();
  const [forum, setForum] = useState<Forum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'forum' | 'reply'>('forum');
  const [reportContentId, setReportContentId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateReplyInput>();

  useEffect(() => {
    if (forumId) {
      fetchForum();
    }
  }, [forumId]);

  const fetchForum = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/forums/${forumId}`);
      if (response.data.success) {
        setForum(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error('Gagal memuat forum');
      router.push(`/courses/${courseId}/forum`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReply = async (data: CreateReplyInput) => {
    if (!forumId) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/forums/${forumId}/replies`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        fetchForum(); // Refresh to get new reply
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeForum = async () => {
    if (!forumId) return;
    try {
      const response = await api.post(`/forums/${forumId}/like`);
      if (response.data.success) {
        fetchForum();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal like thread');
    }
  };

  const handleLikeReply = async (replyId: number) => {
    try {
      const response = await api.post(`/forums/replies/${replyId}/like`);
      if (response.data.success) {
        fetchForum();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal like reply');
    }
  };

  const handlePin = async () => {
    if (!forumId) return;
    try {
      const response = await api.put(`/forums/${forumId}/pin`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchForum();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal pin thread');
    }
  };

  const handleLock = async () => {
    if (!forumId) return;
    try {
      const response = await api.put(`/forums/${forumId}/lock`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchForum();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal lock thread');
    }
  };

  const handleDelete = async (type: 'forum' | 'reply', id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus?')) return;

    try {
      const endpoint = type === 'forum' ? `/forums/${id}` : `/forums/replies/${id}`;
      const response = await api.delete(endpoint);
      if (response.data.success) {
        toast.success('Berhasil dihapus');
        if (type === 'forum') {
          router.push(`/courses/${courseId}/forum`);
        } else {
          fetchForum();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus');
    }
  };

  const handleReport = async () => {
    if (!reportContentId || !reportReason.trim()) {
      toast.error('Alasan laporan wajib diisi');
      return;
    }

    try {
      const response = await api.post('/forums/report', {
        type: reportType,
        content_id: reportContentId,
        reason: reportReason
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowReportModal(false);
        setReportReason('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengirim laporan');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwner = (userId: number) => user?.id === userId;
  const isMentor = user?.role === 'mentor';
  const canModerate = isOwner(forum?.user_id || 0) || isMentor || user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!forum) return null;

  return (
    <ProtectedRoute allowedRoles={['pelajar', 'mentor']}>
      <div className="min-h-screen bg-light-gray">
        <Navbar />

        <div className="container-app py-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/courses/${courseId}/forum`)}
              className="flex items-center gap-2 text-light-600 hover:text-primary mb-6 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Kembali ke Forum</span>
            </button>

            <div className="card shadow-lg border-light-200">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    {forum.is_pinned && (
                      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 16a3.5 3.5 0 01-1.41-6.705 3.5 3.5 0 016.705-1.41 3.5 3.5 0 016.705 1.41 3.5 3.5 0 01-1.41 6.705L5.5 16z" />
                        </svg>
                      </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">{forum.title}</h1>
                    {forum.is_locked && (
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-orange rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {(forum?.author_name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{forum.author_name || 'User'}</span>
                    </div>
                    <span className="text-light-400">•</span>
                    <span className="text-sm text-light-500">{formatDate(forum.created_at)}</span>
                    {forum.tags && (
                      <>
                        <span className="text-light-400">•</span>
                        <span className="badge badge-primary">
                          {forum.tags}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {canModerate && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handlePin}
                      className="btn btn-sm btn-light hover:text-primary hover:border-primary/30"
                    >
                      {forum.is_pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={handleLock}
                      className="btn btn-sm btn-light hover:text-gray-900"
                    >
                      {forum.is_locked ? 'Unlock' : 'Lock'}
                    </button>
                    <button
                      onClick={() => handleDelete('forum', forum.id)}
                      className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border-transparent"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Forum Content */}
          <div className="card mb-8 p-8">
            <div className="prose max-w-none mb-8">
              <p className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">{forum.content}</p>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-light-200">
              <button
                onClick={handleLikeForum}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium ${forum.user_liked
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-gray-50 text-gray-600 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10'
                  }`}
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${forum.user_liked ? 'scale-110 fill-current' : ''}`} fill={forum.user_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  {forum.user_liked ? (
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.707.707l3.546-3.547a1 1 0 00.293-.707V10.333a1 1 0 00-1-1h-3.333a1 1 0 00-1 1zM15.818 3.482a1.5 1.5 0 010 2.828L11.177 10.9a1.5 1.5 0 01-2.121 0l-.707-.707a1.5 1.5 0 012.121-2.121l.354.353 5.657-5.657a1.5 1.5 0 012.121 0zm-6.364 5.657L4.879 7.879a1.5 1.5 0 00-2.121 2.121l6.364 6.364a1.5 1.5 0 002.121 0l6.364-6.364a1.5 1.5 0 00-2.121-2.121l-5.657 5.657z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  )}
                </svg>
                <span>{forum.likes_count}</span>
              </button>
              <button
                onClick={() => {
                  setReportType('forum');
                  setReportContentId(forum.id);
                  setShowReportModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-error hover:bg-error/5 rounded-xl transition-all border border-transparent hover:border-error/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Laporkan</span>
              </button>
            </div>
          </div>

          {/* Replies Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-glow-secondary">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Replies ({forum.replies?.length || 0})
              </h2>
            </div>
            {forum.replies && forum.replies.length > 0 && (
              <div className="space-y-4">
                {forum.replies.map((reply: ForumReply) => (
                  <div key={reply.id} className="card hover:border-primary/30 hover:shadow-glow-primary transition-all duration-300">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 border-2 border-white ring-2 ring-gray-100">
                        {(reply.author_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-900 text-lg">{reply.author_name || 'User'}</span>
                          {reply.author_role === 'mentor' && (
                            <span className="badge badge-secondary">
                              Mentor
                            </span>
                          )}
                          <span className="text-light-300">•</span>
                          <span className="text-sm text-light-500">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikeReply(reply.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${reply.user_liked
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gray-50 text-light-500 hover:text-primary hover:bg-primary/5'
                              }`}
                          >
                            <svg className={`w-4 h-4 ${reply.user_liked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {reply.user_liked ? (
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.707.707l3.546-3.547a1 1 0 00.293-.707V10.333a1 1 0 00-1-1h-3.333a1 1 0 00-1 1zM15.818 3.482a1.5 1.5 0 010 2.828L11.177 10.9a1.5 1.5 0 01-2.121 0l-.707-.707a1.5 1.5 0 012.121-2.121l.354.353 5.657-5.657a1.5 1.5 0 012.121 0zm-6.364 5.657L4.879 7.879a1.5 1.5 0 00-2.121 2.121l6.364 6.364a1.5 1.5 0 002.121 0l6.364-6.364a1.5 1.5 0 00-2.121-2.121l-5.657 5.657z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              )}
                            </svg>
                            <span>{reply.likes_count}</span>
                          </button>
                          <button
                            onClick={() => {
                              setReportType('reply');
                              setReportContentId(reply.id);
                              setShowReportModal(true);
                            }}
                            className="text-sm text-light-400 hover:text-error transition-colors"
                          >
                            Laporkan
                          </button>
                          {(isOwner(reply.user_id) || canModerate) && (
                            <button
                              onClick={() => handleDelete('reply', reply.id)}
                              className="text-sm text-error hover:text-red-700 font-medium"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Form */}
          {!forum.is_locked && (
            <div className="card shadow-lg border-t-4 border-t-primary">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tambah Reply</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmitReply)}>
                <textarea
                  {...register('content', { required: 'Konten reply wajib diisi' })}
                  rows={6}
                  className="input mb-4 resize-none bg-gray-50 focus:bg-white"
                  placeholder="Tulis reply Anda di sini..."
                />
                {errors.content && (
                  <p className="mb-4 text-sm text-error flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.content.message}
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary shadow-lg hover:shadow-glow-primary min-w-[150px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Kirim Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {forum.is_locked && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center mt-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="text-amber-800 font-semibold">Thread ini sudah di-lock</p>
              </div>
              <p className="text-amber-700 text-sm">Tidak bisa menambah reply baru.</p>
            </div>
          )}
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Laporkan Konten</h3>
              </div>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={5}
                className="input mb-6 resize-none"
                placeholder="Jelaskan alasan laporan..."
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="btn btn-light"
                >
                  Batal
                </button>
                <button
                  onClick={handleReport}
                  className="btn bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-200"
                >
                  Laporkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
