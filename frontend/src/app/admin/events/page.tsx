'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Video,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Link from 'next/link';

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string | null;
  thumbnail_image_url: string | null;
  meeting_url: string | null;
  published: boolean;
  created_at: string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/events/admin/all?limit=100');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: number, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) return;

    try {
      const response = await api.delete(`/events/${eventId}`);
      if (response.data.success) {
        toast.success('Event berhasil dihapus');
        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus event');
    }
  };

  const handleTogglePublish = async (eventId: number, currentStatus: boolean) => {
    try {
      const response = await api.patch(`/events/${eventId}/published`, {
        published: !currentStatus,
      });
      if (response.data.success) {
        toast.success(currentStatus ? 'Event di-unpublish' : 'Event dipublish');
        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status publish');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tanggal belum ditentukan';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light-200 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Events</h1>
              </div>
              <p className="text-gray-600">Total {events.length} event</p>
            </div>

            <Link href="/admin/events/create" className="btn btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Buat Event Baru
            </Link>
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <CalendarDays className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Event</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Buat event pertama untuk ditampilkan ke pengguna.
              </p>
              <Link href="/admin/events/create" className="btn btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Buat Event Pertama
              </Link>
            </div>
          )}

          {/* Events Grid */}
          {events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-glow-primary transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Banner */}
                  <div className="h-32 bg-gray-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    {event.thumbnail_image_url ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.thumbnail_image_url})` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-brand flex items-center justify-center">
                        <CalendarDays className="w-12 h-12 text-white/50" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                          event.published
                            ? 'bg-success/90 text-white border-success'
                            : 'bg-gray-100/90 text-gray-600 border-gray-200'
                        }`}
                      >
                        {event.published ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.meeting_url && (
                        <div className="flex items-center gap-2">
                          <Video className="w-3.5 h-3.5" />
                          <a
                            href={event.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate hover:text-primary"
                          >
                            {event.meeting_url}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Edit</span>
                      </button>

                      <button
                        onClick={() => handleTogglePublish(event.id, event.published)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-100 text-gray-500 hover:text-primary transition-colors"
                        title={event.published ? 'Unpublish' : 'Publish'}
                      >
                        {event.published ? (
                          <>
                            <EyeOff className="w-5 h-5 mb-1 text-orange-500" />
                            <span className="text-[10px] font-medium">Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5 mb-1 text-green-500" />
                            <span className="text-[10px] font-medium">Publish</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
