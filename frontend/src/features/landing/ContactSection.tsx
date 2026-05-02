'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactInfo } from '@/shared/data/landingData';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface ContactFormInput {
    full_name: string;
    email: string;
    subject: string;
    message: string;
}

type AlertState = { type: 'success' | 'error'; message: string } | null;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function ContactSection() {
    const [alert, setAlert] = useState<AlertState>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormInput>();

    const onSubmit = async (data: ContactFormInput) => {
        setIsSubmitting(true);
        setAlert(null);
        try {
            const response = await api.post('/contacts', data);
            if (response.data.success) {
                setAlert({
                    type: 'success',
                    message: response.data.message || 'Pesan berhasil dikirim!',
                });
                reset();
            } else {
                setAlert({
                    type: 'error',
                    message: response.data.message || 'Gagal mengirim pesan',
                });
            }
        } catch (error: any) {
            setAlert({
                type: 'error',
                message:
                    error.response?.data?.message ||
                    'Gagal mengirim pesan. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-light-50">
            <div className="container-app">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="badge badge-primary mb-4">Hubungi Kami</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Ada Pertanyaan? <span className="text-gradient">Let&apos;s Talk!</span>
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Tim kami siap membantu kamu memilih program yang tepat sesuai kebutuhan dan tujuan karir kamu.
                        </p>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <motion.a
                                variants={itemVariants}
                                href={contactInfo.whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group"
                                whileHover={{ x: 10 }}
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">WhatsApp</p>
                                    <p className="text-gray-600">{contactInfo.whatsapp}</p>
                                </div>
                            </motion.a>

                            <motion.div variants={itemVariants} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">{contactInfo.email}</p>
                                </div>
                            </motion.div>

                            <motion.a
                                variants={itemVariants}
                                href={contactInfo.instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group"
                                whileHover={{ x: 10 }}
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                        <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                                        <circle cx="18.406" cy="5.594" r="1.44" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Instagram</p>
                                    <p className="text-gray-600">{contactInfo.instagram}</p>
                                </div>
                            </motion.a>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex gap-4 mt-8"
                        >
                            <motion.a
                                href={contactInfo.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white hover:shadow-glow-primary transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href={contactInfo.instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white hover:shadow-glow-primary transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                                    <circle cx="18.406" cy="5.594" r="1.44" />
                                </svg>
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="card"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>

                        <AnimatePresence>
                            {alert && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    role="alert"
                                    className={`mb-4 px-4 py-3 rounded-lg border text-sm ${
                                        alert.type === 'success'
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'bg-red-50 border-red-200 text-red-700'
                                    }`}
                                >
                                    {alert.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4"
                            noValidate
                        >
                            <motion.div variants={itemVariants}>
                                <label className="input-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Masukkan nama lengkap"
                                    {...register('full_name', {
                                        required: 'Nama lengkap wajib diisi',
                                    })}
                                />
                                {errors.full_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
                                )}
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="email@example.com"
                                    {...register('email', {
                                        required: 'Email wajib diisi',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email tidak valid',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="input-label">Subjek</label>
                                <select
                                    className="select"
                                    {...register('subject', {
                                        required: 'Subjek wajib dipilih',
                                    })}
                                >
                                    <option value="">Pilih subjek</option>
                                    <option value="learning">Konsultasi Belajar</option>
                                    <option value="solutions">Jasa Coding</option>
                                    <option value="event">Info Event</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.subject && (
                                    <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                                )}
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="input-label">Pesan</label>
                                <textarea
                                    className="input min-h-[120px]"
                                    placeholder="Tulis pesan kamu..."
                                    {...register('message', {
                                        required: 'Pesan wajib diisi',
                                    })}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                                )}
                            </motion.div>
                            <motion.button
                                variants={itemVariants}
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                            </motion.button>
                        </motion.form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
