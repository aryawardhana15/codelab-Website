'use client';

import Link from 'next/link';
import { contactInfo } from '@/shared/data/landingData';
import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-10 right-20 w-32 h-32 border-4 border-white rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute bottom-10 left-20 w-24 h-24 border-4 border-white rounded-full"
                />
            </div>

            <div className="container-app relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Siap Memulai Perjalanan IT Kamu?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-white/90 mb-10"
                    >
                        Mulai langkahmu sekarang! Belajar coding dari nol atau wujudkan ide aplikasi dan website impianmu bersama ahli kami.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/order" className="btn btn-light btn-lg">
                                Daftar Sekarang - Gratis!
                            </Link>
                        </motion.div>
                        <motion.a
                            href={contactInfo.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                        >
                            Konsultasi Dulu
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
