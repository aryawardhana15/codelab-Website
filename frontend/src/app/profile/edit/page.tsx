'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import BadgeCard from '@/components/BadgeCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserStats, Badge } from '@/types/gamification';
import { User, Mail, FileText, Image, Target, Briefcase, Save, X, Trophy, Star, Award, TrendingUp } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    photo_url: '',
    expertise: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        photo_url: user.photo_url || '',
        expertise: user.expertise || '',
        experience: user.experience || ''
      });

      // Fetch gamification data for pelajar
      if (user.role === 'pelajar') {
        fetchGamificationData();
      }
    }
  }, [user]);

  const fetchGamificationData = async () => {
    try {
      const [statsResponse, badgesResponse] = await Promise.all([
        api.get('/gamification/stats').catch(() => ({ data: { success: false } })),
        api.get('/gamification/badges').catch(() => ({ data: { success: false } }))
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
      if (badgesResponse.data.success) {
        setBadges(badgesResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);

      if (response.data.success) {
        setSuccess('Profile berhasil diperbarui! 🎉');
        updateUser(response.data.data);
        setTimeout(() => {
          setShowEditForm(false);
          setSuccess('');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal memperbarui profile');
    } finally {
      setIsLoading(false);
    }
  };

  const earnedBadges = badges.filter(b => b.earned);
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light-50">
        <Navbar />

        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="relative mb-8 overflow-hidden bg-gradient-primary rounded-3xl p-8 shadow-glow-primary">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-24 -mb-24"></div>
            <div className="absolute top-4 right-4 text-6xl opacity-20">✨</div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white/20 p-1 shadow-xl backdrop-blur-sm">
                    {user?.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-primary">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                    {user?.name || 'User'}
                  </h1>
                  <p className="text-xl text-white/90 mb-4 capitalize">
                    {user?.role === 'pelajar' ? '🎓 Pelajar' : user?.role === 'mentor' ? '👨‍🏫 Mentor' : '👑 Admin'}
                  </p>

                  {/* Level & Rank for Pelajar */}
                  {user?.role === 'pelajar' && stats && (
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="bg-white shadow-lg rounded-xl px-5 py-3 border border-white/50 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-50 rounded-lg">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Level</p>
                            <p className="text-xl font-black text-gray-900">{stats.current_level}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white shadow-lg rounded-xl px-5 py-3 border border-white/50 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary-50 rounded-lg">
                            <Star className="h-5 w-5 text-secondary-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">XP</p>
                            <p className="text-xl font-black text-gray-900">{stats.total_xp.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {stats.rank > 0 && (
                        <div className="bg-white shadow-lg rounded-xl px-5 py-3 border border-white/50 transform hover:scale-105 transition-transform">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl filter drop-shadow-sm">{getRankEmoji(stats.rank)}</span>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ranking</p>
                              <p className="text-xl font-black text-gray-900">#{stats.rank}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white shadow-lg rounded-xl px-5 py-3 border border-white/50 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <Trophy className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Badges</p>
                            <p className="text-xl font-black text-gray-900">{earnedBadges.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                >
                  {showEditForm ? (
                    <>
                      <X className="h-5 w-5 mr-2" />
                      Tutup
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Level Progress Bar for Pelajar */}
          {user?.role === 'pelajar' && stats && (
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress Level
                </h3>
                <span className="badge badge-primary">
                  Level {stats.current_level}: {stats.level_name}
                </span>
              </div>
              <div className="relative h-6 bg-light-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(stats.level_progress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700 z-10">
                    {stats.level_progress}% menuju Level {stats.current_level + 1}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Badges Section for Pelajar */}
          {user?.role === 'pelajar' && earnedBadges.length > 0 && (
            <div className="card mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Badges yang Didapat
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {earnedBadges.slice(0, 12).map((badge) => (
                  <BadgeCard key={badge.badge_id} badge={badge} />
                ))}
              </div>
              {earnedBadges.length > 12 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    +{earnedBadges.length - 12} badges lainnya! 🎉
                  </p>
                  <button
                    onClick={() => router.push('/gamification/badges')}
                    className="btn btn-primary btn-sm"
                  >
                    Lihat Semua Badges
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit Form */}
          {showEditForm && (
            <div className="card animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-8 w-8 text-primary" />
                  Edit Profile
                </h2>
                <p className="text-gray-600">Perbarui informasi profil Anda</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error/10 border-2 border-error/30 rounded-xl">
                  <p className="text-error text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-success/10 border-2 border-success/30 rounded-xl">
                  <p className="text-success text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="input-label flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="input-label flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Masukkan email"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="input-label flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="input resize-none"
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label htmlFor="photo_url" className="input-label flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary" />
                    URL Foto Profil
                  </label>
                  <input
                    type="url"
                    id="photo_url"
                    name="photo_url"
                    value={formData.photo_url}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Expertise (for mentor) */}
                {user?.role === 'mentor' && (
                  <div>
                    <label htmlFor="expertise" className="input-label flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Keahlian
                    </label>
                    <textarea
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      rows={3}
                      className="input resize-none"
                      placeholder="Daftar keahlian Anda..."
                    />
                  </div>
                )}

                {/* Experience (for mentor) */}
                {user?.role === 'mentor' && (
                  <div>
                    <label htmlFor="experience" className="input-label flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Pengalaman
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={4}
                      className="input resize-none"
                      placeholder="Ceritakan pengalaman Anda..."
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="btn btn-light flex-1"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex-1 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bio Display (when not editing) */}
          {!showEditForm && user?.bio && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tentang Saya
              </h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
