'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, Search, Mail, GraduationCap, UserCheck, Shield, Ban, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
  total_enrollments?: number;
  total_courses?: number;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      if (roleFilter) params.append('role', roleFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await api.get(`/admin/users?${params.toString()}`);

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const response = await api.post(`/admin/users/${selectedUser.id}/suspend`, {
        reason: suspendReason
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowSuspendModal(false);
        setSuspendReason('');
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        toast.success('User berhasil dihapus');
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus user');
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
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat users...</p>
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
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Kelola Users 👥
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Kelola semua pengguna platform
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="group p-3 bg-white hover:bg-light-50 rounded-xl shadow-card transition-all border border-light-200"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Filters */}
            <div className="relative flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select w-full sm:w-48"
                >
                  <option value="">👥 Semua Role</option>
                  <option value="pelajar">🎓 Pelajar</option>
                  <option value="mentor">👨‍🏫 Mentor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Cards */}
          <div className="px-4 sm:px-0 mt-6">
            {users.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada user ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((userItem) => (
                  <div key={userItem.id} className="group card card-hover overflow-hidden border-2 border-primary-100">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* User Info */}
                          <div className="flex items-start mb-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg ${userItem.role === 'mentor'
                                ? 'bg-gradient-primary'
                                : 'bg-gradient-gold'
                              }`}>
                              {userItem.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{userItem.name}</h3>
                              <p className="text-gray-600 flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-1" />
                                {userItem.email}
                              </p>

                              {/* Badges */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`badge ${userItem.role === 'mentor'
                                    ? 'badge-primary'
                                    : 'badge-info'
                                  }`}>
                                  {userItem.role === 'mentor' ? '👨‍🏫 Mentor' : '🎓 Pelajar'}
                                </span>
                                {!!userItem.is_verified ? (
                                  <span className="badge badge-success">✅ Verified</span>
                                ) : (
                                  <span className="badge badge-warning">⏳ Pending</span>
                                )}
                                {!!userItem.is_suspended && (
                                  <span className="badge badge-error">🚫 Suspended</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Activity Stats */}
                          <div className={`p-4 rounded-xl border-2 ${userItem.role === 'mentor'
                              ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200'
                              : 'bg-gradient-to-br from-info/5 to-info/10 border-info/20'
                            }`}>
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg mr-3 ${userItem.role === 'mentor' ? 'bg-primary/20' : 'bg-info/20'
                                }`}>
                                {userItem.role === 'mentor' ? (
                                  <GraduationCap className={`h-5 w-5 ${userItem.role === 'mentor' ? 'text-primary' : 'text-info'}`} />
                                ) : (
                                  <UserCheck className="h-5 w-5 text-info" />
                                )}
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">
                                  {userItem.role === 'pelajar'
                                    ? (userItem.total_enrollments || 0)
                                    : (userItem.total_courses || 0)
                                  }
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                  {userItem.role === 'pelajar' ? 'Enrollments' : 'Courses'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-6 flex flex-col space-y-3">
                          <button
                            onClick={() => {
                              setSelectedUser(userItem);
                              setShowSuspendModal(true);
                            }}
                            disabled={isProcessing}
                            className={`btn ${userItem.is_suspended
                                ? 'bg-success hover:bg-success-dark text-white'
                                : 'bg-gradient-primary text-white hover:shadow-glow-primary'
                              } disabled:opacity-50`}
                          >
                            {userItem.is_suspended ? (
                              <>
                                <Shield className="h-5 w-5 mr-2" />
                                Unsuspend
                              </>
                            ) : (
                              <>
                                <Ban className="h-5 w-5 mr-2" />
                                Suspend
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(userItem.id, userItem.name)}
                            disabled={isProcessing}
                            className="btn btn-outline border-error text-error hover:bg-error hover:text-white disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

        {/* Suspend/Unsuspend Modal */}
        {showSuspendModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowSuspendModal(false)}></div>

              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 pt-6 pb-4 bg-white">
                  <div className="sm:flex sm:items-start">
                    <div className={`flex items-center justify-center flex-shrink-0 w-14 h-14 mx-auto rounded-full sm:mx-0 ${selectedUser.is_suspended ? 'bg-success/20' : 'bg-primary/20'
                      }`}>
                      {selectedUser.is_suspended ? (
                        <Shield className="w-7 h-7 text-success" />
                      ) : (
                        <Ban className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
                        {selectedUser.is_suspended ? '✅ Unsuspend User' : '🚫 Suspend User'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedUser.is_suspended
                            ? `Apakah Anda yakin ingin mengaktifkan kembali akun "${selectedUser.name}"?`
                            : `Apakah Anda yakin ingin menangguhkan akun "${selectedUser.name}"?`
                          }
                        </p>
                        <label className="input-label">
                          Alasan (opsional):
                        </label>
                        <textarea
                          value={suspendReason}
                          onChange={(e) => setSuspendReason(e.target.value)}
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
                    onClick={handleSuspend}
                    disabled={isProcessing}
                    className={`btn w-full sm:w-auto disabled:opacity-50 ${selectedUser.is_suspended
                        ? 'bg-success hover:bg-success-dark text-white'
                        : 'btn-primary'
                      }`}
                  >
                    {isProcessing ? 'Memproses...' : selectedUser.is_suspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuspendModal(false);
                      setSuspendReason('');
                      setSelectedUser(null);
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