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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-primary p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner-glow">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Latihan dengan AI</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors hover:rotate-90 duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto grow">
                    {step === 'start' && (
                        <div className="text-center py-4">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
                                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-3">Siap untuk Latihan?</h4>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                AI akan membuatkan satu soal latihan berdasarkan materi ini untuk menguji pemahamanmu.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="btn btn-primary btn-lg shadow-glow-primary hover:scale-105 transition-all w-full max-w-xs flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sedang Membuat Soal...
                                    </>
                                ) : (
                                    <>
                                        Mulai Latihan
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 'question' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
                                <h5 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Pertanyaan AI
                                </h5>
                                <p className="text-gray-900 text-lg font-medium leading-relaxed font-display">{question}</p>
                            </div>

                            <form onSubmit={handleSubmit(handleSubmitAnswer)}>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jawaban Anda</label>
                                    <textarea
                                        {...register('answer', { required: true })}
                                        rows={6}
                                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                        placeholder="Tulis jawabanmu di sini..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary px-8 shadow-md"
                                    >
                                        {loading ? 'Menilai...' : 'Kirim Jawaban'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 'result' && result && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="text-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-8 shadow-lg transform transition-all hover:scale-105 cursor-default ${result.score >= 70
                                        ? 'bg-green-50 text-green-600 border-green-100'
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                    {result.score}
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                    {result.score >= 70 ? 'Kerja Bagus!' : 'Perlu Latihan Lagi'}
                                </h4>
                                <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Feedback AI:
                                    </h5>
                                    <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
                                </div>

                                <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                                    <h5 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Contoh Jawaban Benar:
                                    </h5>
                                    <p className="text-green-700 leading-relaxed">{result.correctAnswer}</p>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 border-2 border-gray-100 transition-all hover:border-primary/30 hover:text-primary"
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
