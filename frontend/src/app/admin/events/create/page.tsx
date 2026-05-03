'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import EventForm, { EventFormValues } from '../EventForm';

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/events', data);
      if (response.data.success) {
        toast.success('Event berhasil dibuat');
        router.push('/admin/events');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat event');
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
                <h1 className="text-2xl font-bold text-gray-900">Buat Event Baru</h1>
                <p className="text-gray-600">Isi detail event di bawah ini</p>
              </div>
            </div>
          </div>

          <EventForm
            isSubmitting={isLoading}
            submitLabel="Simpan Event"
            onSubmit={onSubmit}
            onCancel={() => router.push('/admin/events')}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
