'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, CalendarDays, Loader2 } from 'lucide-react';
import EventForm, { EventFormValues } from '../../EventForm';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [defaults, setDefaults] = useState<Partial<EventFormValues> | null>(null);

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/events/${eventId}`);
      if (response.data.success) {
        const ev = response.data.data;
        setDefaults({
          title: ev.title,
          description: ev.description,
          date: ev.date,
          thumbnail_image_url: ev.thumbnail_image_url,
          meeting_url: ev.meeting_url,
          published: ev.published,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat event');
      router.push('/admin/events');
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/events/${eventId}`, data);
      if (response.data.success) {
        toast.success('Event berhasil diupdate');
        router.push('/admin/events');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/admin/events"
              className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Daftar Event
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <CalendarDays className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-gray-600">Perbarui detail event</p>
              </div>
            </div>
          </div>

          {isFetching || !defaults ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <EventForm
              defaultValues={defaults}
              isSubmitting={isLoading}
              submitLabel="Simpan Perubahan"
              onSubmit={onSubmit}
              onCancel={() => router.push('/admin/events')}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
