'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Home, BookOpen, FolderOpen, Award, Users, ShieldCheck, MessageSquare, Bell, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path: string) => {
    if (!pathname) return false;

    // Special handling for gamification routes
    if (path === '/gamification') {
      return pathname.startsWith('/gamification');
    }

    // Exact match for other routes
    return pathname === path || pathname.startsWith(path + '/');
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/chats/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-primary-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 group"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/codelab-icon-transparent.png"
                  alt="Codelab Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gradient">
                Codelab
              </span>
            </button>

            {/* Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <a
                href="/dashboard"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/dashboard')
                  ? 'text-primary bg-primary-50'
                  : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Beranda
                </span>
              </a>

              {user?.role === 'pelajar' && (
                <>
                  <a
                    href="/courses"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/courses')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Kursus
                    </span>
                  </a>
                  <a
                    href="/my-courses"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/my-courses')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Kursus Saya
                    </span>
                  </a>
                  <a
                    href="/gamification/stats"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/gamification')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Pencapaian
                    </span>
                  </a>
                </>
              )}

              {user?.role === 'mentor' && (
                <>
                  <a
                    href="/mentor/courses"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/mentor/courses')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Kursus Saya
                    </span>
                  </a>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <a
                    href="/admin/users"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/admin/users')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Users
                    </span>
                  </a>
                  <a
                    href="/admin/courses"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/admin/courses')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Kursus
                    </span>
                  </a>
                  <a
                    href="/admin/mentors"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive('/admin/mentors')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Verifikasi Mentor
                    </span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center space-x-2">
            {/* Chat Icon with Unread Count */}
            {(user?.role === 'pelajar' || user?.role === 'mentor') && (
              <button
                onClick={() => router.push(user?.role === 'pelajar' ? '/chat/mentors' : '/mentor/chat')}
                className="relative p-2.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 group"
              >
                <MessageSquare className="h-5 w-5" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform bg-gradient-primary rounded-full shadow-lg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Bell */}
            <button className="relative p-2.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 group">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-primary-100">
              <button
                onClick={() => router.push('/profile/edit')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-shadow">
                  {user?.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-primary !py-2"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
