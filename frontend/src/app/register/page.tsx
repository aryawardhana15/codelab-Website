import type { Metadata } from 'next';
import { RegisterBranding, RegisterForm } from '@/features/register';

export const metadata: Metadata = {
    title: 'Daftar Gratis',
    description: 'Daftar gratis di Codelab dan mulai perjalanan belajar IT-mu. Akses kursus coding bergamifikasi, mentor ahli, dan komunitas teknologi.',
    alternates: { canonical: '/register' },
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex">
            <RegisterBranding />
            <RegisterForm />
        </div>
    );
}
