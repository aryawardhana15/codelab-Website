import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function OrderBranding() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>
                {/* Wavy decoration */}
                <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20" width="200" height="400" viewBox="0 0 200 400" fill="none">
                    <path d="M100,0 Q150,100 100,200 Q50,300 100,400" stroke="white" strokeWidth="8" fill="none" />
                </svg>
            </div>

            <div className="sticky top-0 h-screen flex flex-col justify-center items-center w-full p-12 text-white">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mb-8">
                    <div className="relative w-20 h-20">
                        <Image
                            src="/codelab-icon-transparent.png"
                            alt="Codelab Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-4xl font-bold">Codelab</span>
                </Link>

                <h1 className="text-4xl font-bold text-center mb-4">
                    Wujudkan Ide & Skillmu!
                </h1>
                <p className="text-xl text-white/90 text-center max-w-md">
                    Isi formulir ini untuk mendaftar Bimbingan IT atau memesan Jasa Coding Profesional.
                </p>

                {/* Features */}
                <div className="mt-12 space-y-4">
                    {[
                        'Konsultasi Gratis di Awal',
                        'Mentor & Developer Expert',
                        'Solusi Tepat Sasaran',
                        'Garansi Kepuasan'
                    ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-white/90">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
