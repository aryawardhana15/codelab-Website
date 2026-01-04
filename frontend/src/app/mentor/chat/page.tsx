'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Chat } from '@/types/chat';
import {
  MessageSquare,
  Search,
  User,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  Filter,
  Loader2,
  BookOpen
} from 'lucide-react';

export default function MentorChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    // Poll untuk update unread count
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats');

      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error(error.response?.data?.message || 'Gagal memuat chat');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}j lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}h lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleChatClick = (chatId: number) => {
    router.push(`/chat/${chatId}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['mentor']}>
        <div className="min-h-screen bg-light-50">
          <Navbar />
          <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Memuat percakapan...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
            </div>
            <p className="text-gray-600 ml-1">
              Kelola pertanyaan dan diskusi dengan siswa Anda.
            </p>
          </div>

          {/* Stats & Filter Bar (Optional addition for better UX) */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {chats.length} Percakapan
              </span>
              {chats.filter(c => (c.unread_count ?? 0) > 0).length > 0 && (
                <span className="flex items-center gap-2 font-medium text-orange-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  {chats.filter(c => (c.unread_count ?? 0) > 0).length} Pesan Baru
                </span>
              )}
            </div>

            <button className="p-2 hover:bg-light-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Empty State */}
          {chats.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="inline-block p-6 bg-light-100 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesan</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                Belum ada siswa yang memulai percakapan. Pesan baru akan muncul di sini.
              </p>
            </div>
          )}

          {/* Chats List */}
          {chats.length > 0 && (
            <div className="space-y-3">
              {chats.map((chat) => {
                const hasUnread = (chat.unread_count ?? 0) > 0;

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={`group relative bg-white rounded-xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-md flex items-start gap-4 ${hasUnread
                        ? 'border-orange-100 bg-orange-50/30'
                        : 'border-gray-100 hover:border-primary/30'
                      }`}
                  >
                    {/* Unread Indicator Line */}
                    {hasUnread && (
                      <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full"></div>
                    )}

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {chat.pelajar_photo ? (
                        <img
                          src={chat.pelajar_photo}
                          alt={chat.pelajar_name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                          <span className="text-lg font-bold text-primary">
                            {chat.pelajar_name?.charAt(0).toUpperCase() || 'P'}
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold truncate text-base ${hasUnread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                          {chat.pelajar_name || 'Pelajar'}
                        </h3>
                        {chat.last_message_time && (
                          <span className={`text-xs whitespace-nowrap ml-2 ${hasUnread ? 'text-primary font-medium' : 'text-gray-400'
                            }`}>
                            {formatTime(chat.last_message_time)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate pr-4 ${hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'
                          }`}>
                          {chat.last_message || 'Belum ada pesan'}
                        </p>

                        {hasUnread && (
                          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold text-white bg-primary rounded-full shadow-sm animate-pulse">
                            {chat.unread_count! > 99 ? '99+' : chat.unread_count}
                          </span>
                        )}
                      </div>

                      {/* Course Context Badge */}
                      {chat.course_title && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-xs text-gray-600 border border-gray-100 max-w-full truncate group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                          <BookOpen className="w-3 h-3 shrink-0" />
                          <span className="truncate">{chat.course_title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}