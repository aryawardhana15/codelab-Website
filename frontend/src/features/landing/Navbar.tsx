'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
    { name: 'Program', href: '#programs' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimoni', href: '#testimonials' },
    { name: 'Kontak', href: '#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed z-50 left-0 right-0 mx-auto transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) w-[95%] max-w-6xl ${isScrolled
                    ? 'top-4 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/40 py-3'
                    : 'top-0 rounded-none bg-transparent py-6 border-transparent shadow-none'
                    }`}
            >
                <div className="w-full h-full flex items-center justify-between px-4 md:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/codelab-icon-transparent.png"
                                alt="Codelab Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-primary transition-all">
                            Codelab
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className={`hidden md:flex items-center px-6 py-2 rounded-full transition-all duration-300 ${isScrolled ? 'bg-transparent' : 'bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm'
                        }`}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-primary transform -translate-x-1/2 group-hover:w-1/2 transition-all duration-300 rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="btn btn-primary btn-sm px-6 shadow-glow-primary hover:scale-105 transition-transform"
                        >
                            Daftar Gratis
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 overflow-hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-gray-900 border-b border-gray-100 py-4 flex items-center justify-between group"
                                >
                                    {link.name}
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                </motion.a>
                            ))}

                            <div className="flex flex-col gap-4 mt-8">
                                <Link
                                    href="/login"
                                    className="btn btn-outline w-full justify-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary w-full justify-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Daftar Gratis
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
