'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AlertTriangle, CheckCircle, Clock, Mail, MessageSquare, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Report {
  id: number;
  reporter_id: number;
  reporter_name: string;
  reporter_email: string;
  forum_id?: number;
  reply_id?: number;
  reason: string;
  status: string;
  forum_title?: string;
  forum_content?: string;
  reply_content?: string;
  created_at: string;
}

export default function ReportsModerationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveAction, setResolveAction] = useState<'delete_content' | 'dismiss'>('delete_content');
  const [resolveReason, setResolveReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/reports?page=${currentPage}&limit=20`);

      if (response.data.success) {
        setReports(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedReport) return;

    setIsProcessing(true);
    try {
      const response = await api.post(`/admin/reports/${selectedReport.id}/resolve`, {
        action: resolveAction,
        reason: resolveReason
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowResolveModal(false);
        setResolveReason('');
        setResolveAction('delete_content');
        setSelectedReport(null);
        fetchReports();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memproses laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat laporan...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

            <div className="relative flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium mb-3 shadow-lg">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Content Moderation
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Moderasi Reports 🚨
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Review dan proses laporan konten
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="group p-3 bg-white hover:bg-light-50 rounded-xl shadow-card transition-all border border-light-200"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>

          {/* Empty State */}
          {!isLoading && reports.length === 0 && (
            <div className="px-4 sm:px-0">
              <div className="relative card p-12 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-success/10 to-success/5 rounded-full filter blur-3xl opacity-50"></div>

                <div className="relative">
                  <div className="inline-block p-6 bg-gradient-to-br from-success/10 to-success/20 rounded-full mb-6">
                    <CheckCircle className="h-20 w-20 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada laporan pending ✅</h3>
                  <p className="text-gray-600">Semua laporan sudah diproses</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          {reports.length > 0 && (
            <div className="px-4 sm:px-0 space-y-6">
              {reports.map((report) => (
                <div key={report.id} className="group card card-hover overflow-hidden border-2 border-primary-100">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Report Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`badge ${report.forum_id ? 'badge-primary' : 'badge-info'}`}>
                              {report.forum_id ? '📝 Forum Post' : '💬 Reply'}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(report.created_at).toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Reporter Info */}
                        <div className="mb-4 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                              {report.reporter_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 mb-1">
                                Dilaporkan oleh: {report.reporter_name}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {report.reporter_email}
                              </p>
                              <div className="mt-2 flex items-start">
                                <AlertTriangle className="h-4 w-4 text-error mr-1 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-900">
                                  <span className="font-bold">Alasan: </span>
                                  {report.reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reported Content */}
                        {report.forum_id && report.forum_title && (
                          <div className="p-5 bg-gradient-to-br from-light-100 to-light-200 rounded-xl border-2 border-light-300">
                            <div className="flex items-center mb-3">
                              <div className="p-2 bg-primary/20 rounded-lg mr-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                              </div>
                              <p className="text-sm font-bold text-gray-900">Forum Post Content:</p>
                            </div>
                            <p className="text-base font-bold text-gray-900 mb-2">{report.forum_title}</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{report.forum_content}</p>
                          </div>
                        )}

                        {report.reply_id && report.reply_content && (
                          <div className="p-5 bg-gradient-to-br from-info/5 to-info/10 rounded-xl border-2 border-info/20">
                            <div className="flex items-center mb-3">
                              <div className="p-2 bg-info/20 rounded-lg mr-2">
                                <MessageSquare className="h-4 w-4 text-info" />
                              </div>
                              <p className="text-sm font-bold text-gray-900">Reply Content:</p>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-3">{report.reply_content}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="ml-6 flex flex-col space-y-3">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setResolveAction('delete_content');
                            setShowResolveModal(true);
                          }}
                          disabled={isProcessing}
                          className="btn bg-error hover:bg-error-dark text-white hover:shadow-lg disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Hapus
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setResolveAction('dismiss');
                            setShowResolveModal(true);
                          }}
                          disabled={isProcessing}
                          className="btn btn-light disabled:opacity-50"
                        >
                          <X className="h-5 w-5 mr-2" />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 px-4 sm:px-0">
              <div className="card px-6 py-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-light disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-light disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Halaman <span className="font-bold text-primary">{currentPage}</span> dari{' '}
                      <span className="font-bold text-primary">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn btn-light rounded-r-none disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn btn-light rounded-l-none border-l-0 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resolve Modal */}
        {showResolveModal && selectedReport && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowResolveModal(false)}></div>

              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 pt-6 pb-4 bg-white">
                  <div className="sm:flex sm:items-start">
                    <div className={`flex items-center justify-center flex-shrink-0 w-14 h-14 mx-auto rounded-full sm:mx-0 ${resolveAction === 'delete_content' ? 'bg-error/20' : 'bg-light-200'
                      }`}>
                      {resolveAction === 'delete_content' ? (
                        <Trash2 className="w-7 h-7 text-error" />
                      ) : (
                        <X className="w-7 h-7 text-gray-600" />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
                        {resolveAction === 'delete_content' ? '🗑️ Hapus Konten' : '❌ Dismiss Laporan'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          {resolveAction === 'delete_content'
                            ? 'Apakah Anda yakin ingin menghapus konten yang dilaporkan? Tindakan ini tidak dapat dibatalkan.'
                            : 'Apakah Anda yakin ingin dismiss laporan ini? Konten akan tetap dipertahankan.'
                          }
                        </p>
                        <label className="input-label">
                          Alasan (opsional):
                        </label>
                        <textarea
                          value={resolveReason}
                          onChange={(e) => setResolveReason(e.target.value)}
                          rows={4}
                          className="input resize-none"
                          placeholder="Masukkan alasan..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-light-50 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={isProcessing}
                    className={`btn w-full sm:w-auto disabled:opacity-50 ${resolveAction === 'delete_content'
                        ? 'bg-error hover:bg-error-dark text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                  >
                    {isProcessing ? 'Memproses...' : resolveAction === 'delete_content' ? 'Hapus Konten' : 'Dismiss'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResolveModal(false);
                      setResolveReason('');
                      setSelectedReport(null);
                    }}
                    disabled={isProcessing}
                    className="btn btn-light w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}