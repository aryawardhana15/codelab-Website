'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserCheck, Mail, Lightbulb, Briefcase, FileText, Calendar, CheckCircle, XCircle, X } from 'lucide-react';

interface PendingMentor {
  id: number;
  name: string;
  email: string;
  cv_url?: string;
  expertise?: string;
  experience?: string;
  created_at: string;
}

export default function VerifyMentorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<PendingMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<PendingMentor | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const fetchPendingMentors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/mentors/pending');

      if (response.data.success) {
        setMentors(response.data.data);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data mentor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (mentorId: number) => {
    if (!confirm('Apakah Anda yakin ingin memverifikasi mentor ini?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.post(`/admin/mentors/${mentorId}/verify`);

      if (response.data.success) {
        toast.success('Mentor berhasil diverifikasi');
        fetchPendingMentors();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memverifikasi mentor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedMentor) return;

    setIsProcessing(true);
    try {
      const response = await api.post(`/admin/mentors/${selectedMentor.id}/reject`, {
        reason: rejectReason
      });

      if (response.data.success) {
        toast.success('Mentor berhasil ditolak');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedMentor(null);
        fetchPendingMentors();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menolak mentor');
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
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat data mentor...</p>
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
                  <UserCheck className="h-4 w-4 mr-2" />
                  Verification Required
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Verifikasi Mentor 👨‍🏫
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Review dan verifikasi pendaftaran mentor baru
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
          {mentors.length === 0 && (
            <div className="px-4 sm:px-0">
              <div className="relative card p-12 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full filter blur-3xl opacity-20"></div>

                <div className="relative">
                  <div className="inline-block p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full mb-6">
                    <CheckCircle className="h-20 w-20 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada mentor pending ✅</h3>
                  <p className="text-gray-600">Semua mentor sudah diverifikasi</p>
                </div>
              </div>
            </div>
          )}

          {/* Mentors List */}
          {mentors.length > 0 && (
            <div className="px-4 sm:px-0 space-y-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="group card card-hover overflow-hidden border-2 border-primary-100">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Mentor Info */}
                        <div className="flex items-start mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                            {mentor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{mentor.name}</h3>
                            <p className="text-gray-600 flex items-center mt-1">
                              <Mail className="h-4 w-4 mr-1" />
                              {mentor.email}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {mentor.expertise && (
                            <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                              <div className="flex items-center mb-2">
                                <Lightbulb className="h-5 w-5 text-primary mr-2" />
                                <span className="text-sm font-bold text-gray-700">Keahlian</span>
                              </div>
                              <p className="text-sm text-gray-600">{mentor.expertise}</p>
                            </div>
                          )}
                          {mentor.experience && (
                            <div className="p-4 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl border-2 border-secondary-200">
                              <div className="flex items-center mb-2">
                                <Briefcase className="h-5 w-5 text-secondary-700 mr-2" />
                                <span className="text-sm font-bold text-gray-700">Pengalaman</span>
                              </div>
                              <p className="text-sm text-gray-600">{mentor.experience}</p>
                            </div>
                          )}
                        </div>

                        {/* CV Link */}
                        {mentor.cv_url && (
                          <a
                            href={mentor.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl hover:from-primary-100 hover:to-secondary-100 transition-all group/link"
                          >
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm font-bold text-primary group-hover/link:text-primary-700">Lihat CV</span>
                          </a>
                        )}

                        <p className="mt-4 text-xs text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Mendaftar: {new Date(mentor.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="ml-6 flex flex-col space-y-3">
                        <button
                          onClick={() => handleVerify(mentor.id)}
                          disabled={isProcessing}
                          className="btn btn-primary hover:shadow-glow-primary disabled:opacity-50"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMentor(mentor);
                            setShowRejectModal(true);
                          }}
                          disabled={isProcessing}
                          className="btn btn-outline border-error text-error hover:bg-error hover:text-white disabled:opacity-50"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {showRejectModal && selectedMentor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowRejectModal(false)}></div>

              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 pt-6 pb-4 bg-white">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 mx-auto bg-error/20 rounded-full sm:mx-0">
                      <XCircle className="w-7 h-7 text-error" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
                        Tolak Mentor
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          Apakah Anda yakin ingin menolak pendaftaran mentor <strong>{selectedMentor.name}</strong>?
                          Akun akan dihapus dari sistem.
                        </p>
                        <label className="input-label">
                          Alasan penolakan (opsional):
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={4}
                          className="input resize-none"
                          placeholder="Masukkan alasan penolakan..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-light-50 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="btn bg-error hover:bg-error-dark text-white w-full sm:w-auto disabled:opacity-50"
                  >
                    {isProcessing ? 'Memproses...' : 'Tolak Mentor'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setSelectedMentor(null);
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