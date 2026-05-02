'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Mail,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Calendar,
  MessageSquare,
  Tag,
} from 'lucide-react';

interface Contact {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  user_id: number | null;
  user_name: string | null;
  user_role: string | null;
  user_photo_url?: string | null;
  created_at: string;
}

export default function ContactsManagementPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchQuery]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (searchQuery) params.append('search', searchQuery);

      const response = await api.get(`/admin/contacts?${params.toString()}`);

      if (response.data.success) {
        setContacts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error('Gagal memuat data contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-primary font-medium animate-pulse">Memuat contacts...</p>
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
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Messages
                </div>
                <h1 className="text-4xl font-bold text-gradient">
                  Pesan Kontak 📬
                </h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Lihat semua pesan masuk dari form kontak
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="group p-3 bg-white hover:bg-light-50 rounded-xl shadow-card transition-all border border-light-200"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama, email, atau subjek..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>

          {/* Contacts Cards */}
          <div className="px-4 sm:px-0 mt-6">
            {contacts.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                  <Mail className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada pesan ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="group card card-hover overflow-hidden border-2 border-primary-100"
                  >
                    <div className="p-6">
                      {/* Header: Sender + Date */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold overflow-hidden">
                            {contact.user_id && contact.user_photo_url ? (
                              <img
                                src={contact.user_photo_url}
                                alt={contact.user_name || contact.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (contact.user_name || contact.full_name)
                                .charAt(0)
                                .toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {contact.user_id && contact.user_name
                                  ? contact.user_name
                                  : contact.full_name}
                              </h3>
                              {contact.user_id ? (
                                <span className="badge badge-success">
                                  <UserIcon className="h-3 w-3 mr-1" />
                                  Terdaftar{contact.user_role ? ` · ${contact.user_role}` : ''}
                                </span>
                              ) : (
                                <span className="badge bg-gray-200 text-gray-600">
                                  Tamu
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.user_id && contact.user_name && contact.user_name !== contact.full_name && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Dikirim sebagai: {contact.full_name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(contact.created_at)}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-gray-700">Subjek:</span>
                        <span className="badge badge-info">{contact.subject}</span>
                      </div>

                      {/* Message */}
                      <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                            {contact.message}
                          </p>
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-light disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn btn-light rounded-r-none disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
      </div>
    </ProtectedRoute>
  );
}
