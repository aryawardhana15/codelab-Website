'use client';

import Link from 'next/link';
import Image from 'next/image';
import { contactInfo, footerLinks } from '@/shared/data/landingData';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-12 bg-light-800 text-light-100"
        >
            <div className="container-app">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="md:col-span-1"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/codelab-icon-transparent.png"
                                    alt="Codelab Logo"
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl text-white">Codelab</span>
                        </motion.div>
                        <p className="text-light-400 mb-4">
                            Platform pembelajaran IT terdepan di Indonesia. Belajar coding jadi mudah dan menyenangkan.
                        </p>
                        <div className="flex gap-3">
                            <motion.a
                                href={contactInfo.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn Codelab Indonesia"
                                title="LinkedIn"
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 bg-light-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href={contactInfo.instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram Codelab Indonesia"
                                title="Instagram"
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 bg-light-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                                    <circle cx="18.406" cy="5.594" r="1.44" />
                                </svg>
                            </motion.a>
                        </div>
                    </motion.div>



                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h4 className="font-bold text-white mb-4">Program</h4>
                        <ul className="space-y-2 text-light-400">
                            {footerLinks.program.map((link, i) => (
                                <motion.li key={i} variants={itemVariants}>
                                    <motion.a
                                        href={link.href}
                                        whileHover={{ x: 5, color: '#F97316' }}
                                        className="hover:text-primary transition-colors inline-block"
                                    >
                                        {link.label}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h4 className="font-bold text-white mb-4">Perusahaan</h4>
                        <ul className="space-y-2 text-light-400">
                            {footerLinks.company.map((link, i) => (
                                <motion.li key={i} variants={itemVariants}>
                                    <motion.a
                                        href={link.href}
                                        whileHover={{ x: 5, color: '#F97316' }}
                                        className="hover:text-primary transition-colors inline-block"
                                    >
                                        {link.label}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="border-t border-light-700 pt-8"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-light-400 text-sm">
                            © 2024 Codelab Indonesia. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-light-400">
                            <motion.a
                                href="#"
                                whileHover={{ color: '#F97316' }}
                                className="hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ color: '#F97316' }}
                                className="hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}
