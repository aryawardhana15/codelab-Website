'use client';

import { useRef, useState } from 'react';
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
  UploadCloud,
  X,
} from 'lucide-react';

export interface EventFormValues {
  title: string;
  description: string;
  date?: string | null;
  thumbnail_image?: File | null;
  meeting_url?: string | null;
  published: boolean;
}

interface EventFormProps {
  defaultValues?: {
    title?: string;
    description?: string;
    date?: string | null;
    thumbnail_image_url?: string | null;
    meeting_url?: string | null;
    published?: boolean;
  };
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
  } = useForm<Omit<EventFormValues, 'thumbnail_image'>>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      date: toDatetimeLocalValue(defaultValues?.date ?? null),
      meeting_url: defaultValues?.meeting_url ?? '',
      published: defaultValues?.published ?? true,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.thumbnail_image_url ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (previewUrl && selectedFile) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    if (selectedFile && previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(defaultValues?.thumbnail_image_url ?? null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = handleSubmit((data) => {
    const payload: EventFormValues = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : null,
      thumbnail_image: selectedFile,
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
          {/* Thumbnail file upload */}
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <label className="text-sm font-bold text-gray-700">Thumbnail Image</label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="w-full max-h-56 object-cover rounded-xl border border-gray-200"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-white transition-all border border-gray-200"
                  >
                    Ganti
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded-lg shadow hover:bg-white transition-all border border-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {selectedFile && (
                  <p className="mt-2 text-xs text-gray-500 truncate">{selectedFile.name}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary"
              >
                <UploadCloud className="w-8 h-8" />
                <span className="text-sm font-medium">Klik untuk upload gambar</span>
                <span className="text-xs">PNG, JPG, WEBP (maks. 10MB)</span>
              </button>
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
