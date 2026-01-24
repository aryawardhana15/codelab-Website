'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Code, Loader2, CheckCircle } from 'lucide-react';

export default function OrderForm() {
    const [serviceType, setServiceType] = useState<'learning' | 'service'>('learning');
    const [isLoading, setIsLoading] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);

    // TODO: GANTI DENGAN ID FORMSPREE ANDA YANG ASLI
    // Contoh: https://formspree.io/f/xyzaabc
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvlbjqv";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setIsSuccess(true);
                form.reset();
            } else {
                alert('Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.');
            }
        } catch (error) {
            alert('Terjadi kesalahan koneksi. Silakan periksa internet Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full lg:w-1/2 min-h-screen bg-light-50 flex flex-col justify-center items-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-sm"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
                    <p className="text-gray-600 mb-6">
                        Terima kasih telah mendaftar. Tim Codelab akan segera menghubungi Anda melalui WhatsApp/Email.
                    </p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="btn btn-primary w-full justify-center"
                    >
                        Kembali
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-1/2 min-h-screen bg-light-50 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Formulir Pendaftaran</h2>
                    <p className="text-gray-600">
                        Silakan lengkapi data di bawah ini untuk terhubung dengan tim Codelab.
                    </p>
                </div>

                {/* Service Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => setServiceType('learning')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${serviceType === 'learning'
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-orange-200'
                            }`}
                    >
                        <BookOpen className="w-6 h-6" />
                        <span className="font-semibold text-sm">Bimbingan IT</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setServiceType('service')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${serviceType === 'service'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200'
                            }`}
                    >
                        <Code className="w-6 h-6" />
                        <span className="font-semibold text-sm">Jasa Coding</span>
                    </button>
                </div>

                <form
                    action={FORMSPREE_ENDPOINT}
                    method="POST"
                    className="space-y-5"
                    onSubmit={handleSubmit}
                >
                    {/* Hidden Subject Field for Formspree */}
                    <input
                        type="hidden"
                        name="_subject"
                        value={serviceType === 'learning' ? 'Pendaftaran Bimbingan IT Baru' : 'Pesanan Jasa Coding Baru'}
                    />

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                            <input
                                type="tel"
                                name="whatsapp"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                placeholder="08123456789"
                            />
                        </div>
                    </div>

                    {/* Conditional Fields: Learning */}
                    {serviceType === 'learning' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 mb-4">
                                <h4 className="font-semibold text-orange-800 mb-2 text-sm">Pilihan Program Belajar</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="program" value="Private 1-on-1" className="text-orange-500 focus:ring-orange-500" defaultChecked />
                                        <span className="text-sm text-gray-700">Private 1-on-1 Mentoring</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="program" value="Small Group" className="text-orange-500 focus:ring-orange-500" />
                                        <span className="text-sm text-gray-700">Small Group Class</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="program" value="Bootcamp" className="text-orange-500 focus:ring-orange-500" />
                                        <span className="text-sm text-gray-700">Intensive Bootcamp</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Belajar / Materi yang Diminati</label>
                                <textarea
                                    name="learning_goals"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                    placeholder="Contoh: Saya ingin belajar React.js untuk skripsi..."
                                ></textarea>
                            </div>
                        </motion.div>
                    )}

                    {/* Conditional Fields: Service */}
                    {serviceType === 'service' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Project</label>
                                <select
                                    name="project_type"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="Mobile App">Mobile App Development</option>
                                    <option value="Bug Fixing">Bug Fixing / Error Handling</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Tugas Kuliah/Skripsi">Bantuan Tugas/Skripsi</option>
                                    <option value="Other">Lainnya</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Budget</label>
                                <select
                                    name="budget"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                >
                                    <option value="< 1 Juta">&lt; Rp 1.000.000</option>
                                    <option value="1 - 5 Juta">Rp 1.000.000 - Rp 5.000.000</option>
                                    <option value="5 - 10 Juta">Rp 5.000.000 - Rp 10.000.000</option>
                                    <option value="> 10 Juta">&gt; Rp 10.000.000</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Kebutuhan Project</label>
                                <textarea
                                    name="project_details"
                                    rows={4}
                                    required={serviceType === 'service'}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    placeholder="Ceritakan detail fitur yang Anda butuhkan..."
                                ></textarea>
                            </div>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${serviceType === 'learning'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/30'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Kirim Pendaftaran
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        Data Anda akan dikirim ke tim Codelab via Email. Kami akan menghubungi Anda di WhatsApp sesegera mungkin.
                    </p>
                </form>
            </div>
        </div>
    );
}
