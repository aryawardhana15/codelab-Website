'use client';

import { useForm } from 'react-hook-form';
import {
  AlertCircle,
  CalendarDays,
  Save,
  Loader2,
  Image as ImageIcon,
  Video,
  CalendarClock,
  Eye,
} from 'lucide-react';

export interface EventFormValues {
  title: string;
  description: string;
  date?: string | null;
  thumbnail_image_url?: string | null;
  meeting_url?: string | null;
  published: boolean;
}

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (data: EventFormValues) => void | Promise<void>;
  onCancel: () => void;
}

const toDatetimeLocalValue = (raw?: string | null) => {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EventForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      date: toDatetimeLocalValue(defaultValues?.date ?? null),
      thumbnail_image_url: defaultValues?.thumbnail_image_url ?? '',
      meeting_url: defaultValues?.meeting_url ?? '',
      published: defaultValues?.published ?? true,
    },
  });

  const submit = handleSubmit((data) => {
    const payload: EventFormValues = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : null,
      thumbnail_image_url: data.thumbnail_image_url?.trim() ? data.thumbnail_image_url : null,
      meeting_url: data.meeting_url?.trim() ? data.meeting_url : null,
    };
    return onSubmit(payload);
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">Informasi Event</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Judul event wajib diisi' })}
              type="text"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              placeholder="Contoh: Workshop Web Development"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', { required: 'Deskripsi wajib diisi' })}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-gray-400"
              placeholder="Tulis detail event di sini..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-primary" />
              Tanggal & Waktu (opsional)
            </label>
            <input
              {...register('date')}
              type="datetime-local"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Media & Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">Media & Tautan</h2>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <label className="text-sm font-bold text-gray-700">Thumbnail Image URL</label>
            </div>
            <input
              {...register('thumbnail_image_url', {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'URL thumbnail tidak valid',
                },
              })}
              type="url"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail_image_url && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.thumbnail_image_url.message}
              </p>
            )}
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-5 h-5 text-red-500" />
              <label className="text-sm font-bold text-gray-700">Meeting URL</label>
            </div>
            <input
              {...register('meeting_url', {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Meeting URL tidak valid',
                },
              })}
              type="url"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              placeholder="https://meet.google.com/..."
            />
            {errors.meeting_url && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.meeting_url.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Publish */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">Status Publish</h2>
        </div>

        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <input
            {...register('published')}
            type="checkbox"
            id="published"
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="published" className="flex-1 cursor-pointer">
            <span className="block font-semibold text-gray-700">Published</span>
            <span className="text-sm text-gray-500">
              Event akan ditampilkan ke pengguna jika dicentang
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary px-8 py-3 rounded-xl font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
