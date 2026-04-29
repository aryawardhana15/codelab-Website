'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Course } from '@/types/course';
import {
    ArrowLeft,
    BookOpen,
    Users,
    FileText,
    Edit,
    BarChart,
    Settings,
    ChevronRight,
    TrendingUp,
    Clock,
    ExternalLink,
    Target,
    MoreVertical,
    Loader2,
    BookIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function MentorCourseDashboard() {
    const router = useRouter();
    const params = useParams();
    const courseId = params?.id;
    const [course, setCourse] = useState<Course | null>(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        materials: 0,
        activeStudents: 0,
        completionRate: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            setIsLoading(true);
            const courseRes = await api.get(`/courses/${courseId}`);
            if (courseRes.data.success) {
                setCourse(courseRes.data.data);
            }

            const courseStatsRes = await api.get(`/courses/${courseId}/stats`);
            if (courseStatsRes.data.success) {
                setStats({
                    totalStudents: courseRes.data.data.enrollmentCount, // Mock
                    activeStudents: courseStatsRes.data.data.activeStudents, // Mock
                    completionRate: courseStatsRes.data.data.completionRate, // Mock
                    materials: courseRes.data.data.materialsCount,
                });
            }
        } catch (error) {
            toast.error('Gagal memuat data kursus');
            router.push('/mentor/courses');
        } finally {
            setIsLoading(false);
        }
    };

    const menuItems: {
        title: string;
        description: string;
        icon: React.ReactNode;
        href: string;
        color: string;
        disabled?: boolean;
    }[] = [
        {
            title: 'Edit Konten',
            description: 'Ubah detail kursus, harga, dan silabus',
            icon: <Edit className="w-6 h-6 text-blue-600" />,
            href: `/mentor/courses/${courseId}/edit`,
            color: 'bg-blue-50 border-blue-100 hover:border-blue-200',
        },
        {
            title: 'Materi Pembelajaran',
            description: 'Kelola video, artikel, dan file materi',
            icon: <BookOpen className="w-6 h-6 text-purple-600" />,
            href: `/mentor/courses/${courseId}/materials`,
            color: 'bg-purple-50 border-purple-100 hover:border-purple-200',
        },
        {
            title: 'Tugas & Kuis',
            description: 'Buat soal dan nilai pekerjaan siswa',
            icon: <FileText className="w-6 h-6 text-primary" />,
            href: `/mentor/courses/${courseId}/assignments`,
            color: 'bg-orange-50 border-orange-100 hover:border-orange-200',
        },
        // {
        //     title: 'Siswa Terdaftar',
        //     description: 'Lihat progres dan daftar siswa',
        //     icon: <Users className="w-6 h-6 text-green-600" />,
        //     href: `/mentor/courses/${courseId}/students`, // Future page
        //     color: 'bg-green-50 border-green-100 hover:border-green-200',
        //     disabled: true // Disable if page doesn't exist yet
        // }
    ];

    if (isLoading) {
        return (
            <ProtectedRoute allowedRoles={['mentor']}>
                <div className="min-h-screen bg-light-50">
                    <Navbar />
                    <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">
                            Memuat dashboard kursus...
                        </p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['mentor']}>
            <div className="min-h-screen bg-light-50">
                <Navbar />

                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link
                            href="/mentor/courses"
                            className="inline-flex items-center text-gray-500 hover:text-primary mb-4 transition-colors font-medium text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Kembali ke Daftar Kursus
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {course?.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            course?.difficulty === 'beginner'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : course?.difficulty ===
                                                    'intermediate'
                                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                  : 'bg-red-100 text-red-700 border-red-200'
                                        }`}
                                    >
                                        {course?.difficulty
                                            ? course.difficulty
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              course.difficulty.slice(1)
                                            : '-'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Last updated:{' '}
                                        {new Date().toLocaleDateString()}
                                    </span>
                                    <Link
                                        href={`/courses/${courseId}`}
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Isi Preview{' '}
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="btn btn-outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Total Siswa
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {stats.totalStudents}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                                <BookIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Jumlah Material
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {stats.materials}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Siswa Aktif
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {stats.activeStudents}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Completion Rate
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {stats.completionRate}%
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Course Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                href={item.disabled ? '#' : item.href}
                                key={index}
                                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                                    item.disabled
                                        ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                                        : `bg-white border-gray-100 hover:shadow-md ${item.color}`
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {!item.disabled && (
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
