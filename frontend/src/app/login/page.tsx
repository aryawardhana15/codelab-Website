import type { Metadata } from 'next';
import { LoginBranding, LoginForm } from '@/features/login';

export const metadata: Metadata = {
    title: 'Masuk',
    description: 'Masuk ke akun Codelab kamu untuk melanjutkan belajar coding, mengakses kursus, dan memantau progres gamifikasi.',
    alternates: { canonical: '/login' },
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <LoginBranding />
            <LoginForm />
        </div>
    );
}
