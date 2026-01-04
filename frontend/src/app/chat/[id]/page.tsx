'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ChatBubble from '@/components/ChatBubble';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Message } from '@/types/chat';
import { Send, ArrowLeft, Loader2, Info, Sparkles } from 'lucide-react';

interface ChatInfo {
  id: number;
  mentor_name?: string;
  pelajar_name?: string;
  course_title?: string;
  course_id?: number | null;
}

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params?.id;
  const courseName = searchParams?.get('course');
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatId) {
      fetchChatInfo();
      fetchMessages();
      startPolling();
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [chatId]);

  const fetchChatInfo = async () => {
    try {
      const response = await api.get('/chats');
      if (response.data.success) {
        const chats = response.data.data;
        const currentChat = chats.find((chat: ChatInfo) => chat.id === parseInt(chatId as string));
        if (currentChat) {
          setChatInfo(currentChat);
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch chat info:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (silent: boolean = false) => {
    try {
      if (!silent) setIsLoading(true);

      const response = await api.get(`/chats/${chatId}/messages`);

      if (response.data.success) {
        setMessages(response.data.data);

        // Mark as read
        await api.put(`/chats/${chatId}/read`);
      }
    } catch (error: any) {
      if (!silent) {
        toast.error('Gagal memuat pesan');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const startPolling = () => {
    // Poll for new messages every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(true);
    }, 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await api.post(`/chats/${chatId}/messages`, {
        content: newMessage.trim()
      });

      if (response.data.success) {
        setNewMessage('');
        fetchMessages(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengirim pesan');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = async (messageId: number, newContent: string) => {
    try {
      const response = await api.put(`/chats/messages/${messageId}`, {
        content: newContent
      });

      if (response.data.success) {
        toast.success('Pesan berhasil diubah');
        fetchMessages(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah pesan');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await api.delete(`/chats/messages/${messageId}`);

      if (response.data.success) {
        toast.success('Pesan berhasil dihapus');
        fetchMessages(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus pesan');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light-50 flex justify-center items-center">
          <div className="animate-spin text-primary">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light-50 flex flex-col">
        <Navbar />

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (user?.role === 'pelajar') {
                    router.push(chatInfo?.course_id ? '/my-courses' : '/chat/mentors');
                  } else {
                    router.push('/mentor/chat');
                  }
                }}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-sm">
                  {user?.role === 'pelajar' ?
                    <span className="font-bold text-lg">M</span> :
                    <span className="font-bold text-lg">P</span>
                  }
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">
                    {chatInfo?.course_title
                      ? `${chatInfo.course_title}`
                      : user?.role === 'pelajar'
                        ? `${chatInfo?.mentor_name || 'Mentor'}`
                        : `${chatInfo?.pelajar_name || 'Pelajar'}`
                    }
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'pelajar'
                        ? chatInfo?.mentor_name || 'Mentor'
                        : chatInfo?.pelajar_name || 'Pelajar'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Privat & Aman</span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl opacity-50">👋</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesan</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Mulai percakapan dengan menyapa atau menanyakan pertanyaan Anda.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center py-4">
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    Awal Percakapan
                  </span>
                </div>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isSentByCurrentUser={message.sender_id === user?.id}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-white p-1">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  rows={1}
                  className="block w-full px-4 py-3.5 pr-10 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all text-sm shadow-sm bg-gray-50/50 focus:bg-white"
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="flex-shrink-0 w-12 h-[52px] flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" />
                )}
              </button>
            </div>

            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-400">
                Tekan <span className="font-semibold">Enter</span> untuk mengirim
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}