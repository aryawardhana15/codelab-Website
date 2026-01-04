import Link from 'next/link';
import { contactInfo } from '@/shared/data/landingData';

export default function CTASection() {
    return (
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-20 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 left-20 w-24 h-24 border-4 border-white rounded-full"></div>
            </div>

            <div className="container-app relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Siap Memulai Perjalanan IT Kamu?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Bergabung dengan ribuan alumni sukses kami. Daftar sekarang dan dapatkan akses
                        ke kursus gratis untuk pemula!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="btn btn-light btn-lg">
                            Daftar Sekarang - Gratis!
                        </Link>
                        <a
                            href={contactInfo.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                        >
                            Konsultasi Dulu
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
