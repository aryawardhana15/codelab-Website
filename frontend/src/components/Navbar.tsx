'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import {
  Home,
  BookOpen,
  FolderOpen,
  Award,
  Users,
  ShieldCheck,
  Mail,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavigation = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-primary-100/50 sticky top-0 z-50">
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
              <span className="text-xl font-bold text-gradient">Codelab</span>
            </button>

            {/* Navigation Links */}
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              <a
                href="/dashboard"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/dashboard')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/courses')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/my-courses')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/gamification')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/mentor/courses')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/admin/users')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/admin/courses')
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/admin/mentors')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Verifikasi Mentor
                    </span>
                  </a>
                  <a
                    href="/admin/contacts"
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive('/admin/contacts')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Pesan Kontak
                    </span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center space-x-2">
            {/* Chat Icon with Unread Count - Hidden on mobile */}
            {(user?.role === 'pelajar' || user?.role === 'mentor') && (
              <button
                onClick={() =>
                  router.push(
                    user?.role === 'pelajar' ? '/chat/mentors' : '/mentor/chat',
                  )
                }
                className="hidden lg:flex relative p-2.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 group"
              >
                <MessageSquare className="h-5 w-5" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform bg-gradient-primary rounded-full shadow-lg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Bell - Hidden on mobile */}
            {/* <button className="hidden lg:flex relative p-2.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 group">
              <Bell className="h-5 w-5" />
            </button> */}

            {/* User Menu - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-primary-100">
              <button
                onClick={() => router.push('/profile/edit')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-lg transition-shadow">
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
              <button onClick={handleLogout} className="btn btn-primary !py-2">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-[calc(100vh-4rem)] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-primary-100/50 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 pb-3 border-b border-primary-100">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleMobileNavigation('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'text-primary bg-primary-50'
                    : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Beranda</span>
              </button>

              {user?.role === 'pelajar' && (
                <>
                  <button
                    onClick={() => handleMobileNavigation('/courses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/courses')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Kursus</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation('/my-courses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/my-courses')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span className="font-medium">Kursus Saya</span>
                  </button>
                  <button
                    onClick={() =>
                      handleMobileNavigation('/gamification/stats')
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/gamification')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                    <span className="font-medium">Pencapaian</span>
                  </button>
                </>
              )}

              {user?.role === 'mentor' && (
                <button
                  onClick={() => handleMobileNavigation('/mentor/courses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/mentor/courses')
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                  }`}
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="font-medium">Kursus Saya</span>
                </button>
              )}

              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => handleMobileNavigation('/admin/users')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin/users')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Users</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation('/admin/courses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin/courses')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Kursus</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation('/admin/mentors')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin/mentors')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Verifikasi Mentor</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigation('/admin/contacts')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin/contacts')
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-primary-50/50'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Pesan Kontak</span>
                  </button>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-primary-100 space-y-2">
              {/* Chat Button */}
              {(user?.role === 'pelajar' || user?.role === 'mentor') && (
                <button
                  onClick={() =>
                    handleMobileNavigation(
                      user?.role === 'pelajar'
                        ? '/chat/mentors'
                        : '/mentor/chat',
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary-50/50 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Pesan</span>
                  </div>
                  {(unreadCount ?? 0) > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-gradient-primary rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Notification Button */}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary-50/50 rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifikasi</span>
              </button>

              {/* Profile Edit */}
              <button
                onClick={() => handleMobileNavigation('/profile/edit')}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary-50/50 rounded-lg transition-all duration-200"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Edit Profil</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
