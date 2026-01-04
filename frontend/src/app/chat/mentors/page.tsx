'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MessageSquare, Users, Sparkles, Search, User, ChevronRight } from 'lucide-react';

interface Mentor {
  id: number;
  name: string;
  email: string;
  photo_url?: string;
  bio?: string;
  expertise?: string;
  experience?: string;
  created_at: string;
}

export default function MentorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState<number | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/mentors');

      if (response.data.success) {
        setMentors(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return;
      }
      toast.error(error.response?.data?.message || 'Gagal memuat mentor');
      setMentors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (mentorId: number) => {
    setIsStartingChat(mentorId);
    try {
      const response = await api.post('/chats', { mentor_id: mentorId });

      if (response.data.success) {
        const chatId = response.data.data.id;
        router.push(`/chat/${chatId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memulai chat');
    } finally {
      setIsStartingChat(null);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['pelajar']}>
        <div className="min-h-screen bg-light-50 flex justify-center items-center">
          <div className="animate-spin text-primary">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['pelajar']}>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4 border border-primary-100">
                <Users className="w-3.5 h-3.5" />
                <span>Mentor Profesional</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Pilih Mentor <span className="text-transparent bg-clip-text bg-gradient-primary">Terbaik</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed">
                Tanyakan materi yang tidak dimengerti atau minta saran karir langsung kepada para ahli.
                Kami memilih mentor terbaik untuk membantu perkembangan belajar Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Empty State */}
          {mentors.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="inline-flex p-6 bg-gray-100 rounded-full mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Mentor</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Saat ini belum ada mentor yang tersedia. Silakan cek kembali nanti atau hubungi admin jika Anda membutuhkan bantuan mendesak.
              </p>
            </div>
          )}

          {/* Mentors Grid */}
          {mentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-3xl p-8 shadow-card hover:shadow-glow-primary border border-gray-100 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent -z-0"></div>

                  <div className="relative mb-6 z-10">
                    <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg ring-4 ring-gray-50 group-hover:ring-primary-100 transition-all duration-500">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        {mentor.photo_url ? (
                          <img
                            src={mentor.photo_url}
                            alt={mentor.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm" title="Online">
                    </div>
                  </div>

                  <div className="relative z-10 w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{mentor.email}</p>

                    {mentor.expertise && (
                      <div className="inline-block px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold mb-6 border border-gray-100">
                        {mentor.expertise}
                      </div>
                    )}

                    {mentor.bio && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-8 italic min-h-[40px]">
                        "{mentor.bio}"
                      </p>
                    )}

                    <button
                      onClick={() => handleStartChat(mentor.id)}
                      disabled={isStartingChat === mentor.id}
                      className="btn btn-primary w-full justify-center py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 group-hover:translate-y-[-2px] transition-all duration-300"
                    >
                      {isStartingChat === mentor.id ? (
                        <>
                          <div className="animate-spin mr-2">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          Memulai...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Mulai Konsultasi
                        </>
                      )}
                    </button>
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