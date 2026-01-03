'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface AIPracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    materialContent: string;
}

interface AnswerForm {
    answer: string;
}

export default function AIPracticeModal({ isOpen, onClose, materialContent }: AIPracticeModalProps) {
    const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState<any>(null);

    const { register, handleSubmit, reset } = useForm<AnswerForm>();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post('/ai/practice/generate', { materialContent });
            if (response.data.success) {
                setQuestion(response.data.data.question);
                setStep('question');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal generate soal');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async (data: AnswerForm) => {
        setLoading(true);
        try {
            const response = await api.post('/ai/practice/evaluate', {
                question,
                answer: data.answer,
                materialContent
            });

            if (response.data.success) {
                setResult(response.data.data);
                setStep('result');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal evaluasi jawaban');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep('start');
        setQuestion('');
        setResult(null);
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Latihan dengan AI</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto grow">
                    {step === 'start' && (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Siap untuk Latihan?</h4>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                AI akan membuatkan satu soal latihan berdasarkan materi ini untuk menguji pemahamanmu.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {loading ? 'Sedang Membuat Soal...' : 'Mulai Latihan'}
                            </button>
                        </div>
                    )}

                    {step === 'question' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <h5 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">Pertanyaan AI</h5>
                                <p className="text-gray-800 text-lg font-medium leading-relaxed">{question}</p>
                            </div>

                            <form onSubmit={handleSubmit(handleSubmitAnswer)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban Anda</label>
                                    <textarea
                                        {...register('answer', { required: true })}
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                                        placeholder="Tulis jawabanmu di sini..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Menilai...' : 'Kirim Jawaban'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 'result' && result && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-4 ${result.score >= 70 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                    {result.score}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">
                                    {result.score >= 70 ? 'Kerja Bagus!' : 'Perlu Latihan Lagi'}
                                </h4>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h5 className="font-bold text-gray-900 mb-1">Feedback AI:</h5>
                                    <p className="text-gray-700">{result.feedback}</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <h5 className="font-bold text-green-800 mb-1">Contoh Jawaban Benar:</h5>
                                    <p className="text-green-700">{result.correctAnswer}</p>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Coba Soal Lain
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
