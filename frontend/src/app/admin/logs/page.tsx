'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, X, ChevronLeft, ChevronRight, Clock, Mail, Trash2, Shield, CheckCircle, XCircle, Edit } from 'lucide-react';

interface AdminLog {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: number;
  description: string;
  created_at: string;
}

export default function AdminLogsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/logs?page=${currentPage}&limit=50`);

      if (response.data.success) {
        setLogs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionConfig = (action: string) => {
    if (action.includes('delete')) return {
      badgeClass: 'badge-error',
      icon: Trash2,
      text: 'Delete'
    };
    if (action.includes('suspend')) return {
      badgeClass: 'badge-warning',
      icon: Shield,
      text: 'Suspend'
    };
    if (action.includes('verify') || action.includes('approve')) return {
      badgeClass: 'badge-success',
      icon: CheckCircle,
      text: 'Verify'
    };
    if (action.includes('reject')) return {
      badgeClass: 'badge-error',
      icon: XCircle,
      text: 'Reject'
    };
    return {
      badgeClass: 'badge-primary',
      icon: Edit,
      text: 'Action'
    };
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat logs...</p>
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
                  <FileText className="h-4 w-4 mr-2" />
                  Admin Activity
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Admin Logs 📋
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Riwayat aktivitas admin
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

          {/* Logs List */}
          <div className="px-4 sm:px-0">
            <div className="card overflow-hidden border-2 border-primary-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-light-200">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        ⏰ Waktu
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        👤 Admin
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        🎯 Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        📌 Target
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        📝 Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-light-100">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">Tidak ada logs</p>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => {
                        const config = getActionConfig(log.action);
                        const IconComponent = config.icon;
                        return (
                          <tr key={log.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                {new Date(log.created_at).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mr-3">
                                  {log.admin_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{log.admin_name}</div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {log.admin_email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`badge ${config.badgeClass}`}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {formatAction(log.action)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 bg-light-200 rounded-lg text-xs font-medium text-gray-700">
                                {log.target_type} #{log.target_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="max-w-md truncate">{log.description}</div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-light-50 to-light-100 px-6 py-4 flex items-center justify-between border-t border-light-200">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}