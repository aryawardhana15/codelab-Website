'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-light-200">
            <div className="container-app">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Codelab</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#programs" className="text-gray-600 hover:text-primary transition-colors">Program</a>
                        <a href="#roadmap" className="text-gray-600 hover:text-primary transition-colors">Roadmap</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimoni</a>
                        <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Kontak</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="btn btn-ghost btn-sm">
                            Masuk
                        </Link>
                        <Link href="/register" className="btn btn-primary btn-sm">
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
