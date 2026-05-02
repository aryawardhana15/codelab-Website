'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-light-50">
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FFF8E7] to-[#FDF8F3]">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute top-0 right-0 w-[600px] h-[600px]"
                        style={{
                            background:
                                'radial-gradient(circle at 70% 30%, #F97316 0%, transparent 60%)',
                            filter: 'blur(60px)',
                        }}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px]"
                        style={{
                            background:
                                'radial-gradient(circle at 30% 70%, #F9A825 0%, transparent 60%)',
                            filter: 'blur(60px)',
                        }}
                    />

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute top-[15%] right-[10%] w-[280px] h-[280px] rounded-full border-[4px] border-orange-200/60"
                        style={{ filter: 'blur(1px)' }}
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute bottom-[15%] left-[8%] w-[220px] h-[220px] rounded-full border-[3px] border-yellow-300/60"
                        style={{ filter: 'blur(1px)' }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Logo */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -20,
                                filter: 'blur(5px)',
                            }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="flex justify-center mb-8"
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                            >
                                <div className="relative w-12 h-12">
                                    <Image
                                        src="/codelab-icon-transparent.png"
                                        alt="Codelab Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-bold text-2xl text-gray-900 tracking-tight">
                                    Codelab
                                </span>
                            </Link>
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -20,
                                filter: 'blur(5px)',
                            }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                                duration: 0.8,
                                delay: 0.1,
                                ease: 'easeOut',
                            }}
                            className="inline-flex items-center justify-center gap-2 mb-8 px-4 py-2 rounded-full bg-orange-100"
                        >
                            <Sparkles className="w-4 h-4 text-[#F97316]" />
                            <span className="text-sm font-medium text-[#F97316]">
                                Sesuatu yang Keren Sedang Disiapkan
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <h1 className="mb-8 select-none cursor-default">
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    filter: 'blur(10px)',
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: 'blur(0px)',
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 0.2,
                                }}
                                className="block text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-2"
                            >
                                Coming
                            </motion.span>
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    filter: 'blur(10px)',
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: 'blur(0px)',
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 0.3,
                                }}
                                className="block text-5xl md:text-7xl lg:text-8xl font-extrabold italic"
                                style={{
                                    background:
                                        'linear-gradient(90deg, #F9A825 0%, #FFD54F 50%, #F9A825 100%)',
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Soon
                            </motion.span>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-gray-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
                        >
                            Kami sedang menyiapkan halaman ini untuk kamu.
                            Pantau terus Codelab untuk update terbaru, ya!
                        </motion.p>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white text-sm transition-all duration-300 overflow-hidden"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #F9A825 0%, #F97316 100%)',
                                        boxShadow:
                                            '0 4px 14px rgba(249, 168, 37, 0.3)',
                                    }}
                                >
                                    <ArrowLeft className="relative w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="relative">
                                        Kembali ke Beranda
                                    </span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
