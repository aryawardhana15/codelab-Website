'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Send, Sparkles, MessageSquare, BookOpen, Bot, User, RefreshCw, X, ChevronRight } from 'lucide-react';

interface AIPracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    materialContent: string;
}

interface AnswerForm {
    answer: string;
}

type Mode = 'practice' | 'chat';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIPracticeModal({ isOpen, onClose, materialContent }: AIPracticeModalProps) {
    const [mode, setMode] = useState<Mode>('chat'); // Default to chat as requested

    // Practice Mode States
    const [practiceStep, setPracticeStep] = useState<'start' | 'question' | 'result'>('start');
    const [practiceLoading, setPracticeLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState<any>(null);

    // Chat Mode States
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, reset } = useForm<AnswerForm>();

    useEffect(() => {
        if (isOpen && chatMessages.length === 0) {
            setChatMessages([{
                role: 'assistant',
                content: 'Halo! Saya asisten AI Codelab. Ada yang membingungkan dari materi ini? Tanyakan saja, saya siap membantu! 😊'
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // --- Practice Handlers ---
    const handleGenerateQuestion = async () => {
        setPracticeLoading(true);
        try {
            const response = await api.post('/ai/practice/generate', { materialContent });
            if (response.data.success) {
                setQuestion(response.data.data.question);
                setPracticeStep('question');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal generate soal');
        } finally {
            setPracticeLoading(false);
        }
    };

    const handleSubmitAnswer = async (data: AnswerForm) => {
        setPracticeLoading(true);
        try {
            const response = await api.post('/ai/practice/evaluate', {
                question,
                answer: data.answer,
                materialContent
            });

            if (response.data.success) {
                setResult(response.data.data);
                setPracticeStep('result');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal evaluasi jawaban');
        } finally {
            setPracticeLoading(false);
        }
    };

    const handleResetPractice = () => {
        setPracticeStep('start');
        setQuestion('');
        setResult(null);
        reset();
    };

    // --- Chat Handlers ---
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatLoading(true);

        try {
            const response = await api.post('/ai/chat', {
                message: userMsg,
                materialContent,
                history: chatMessages.slice(-5) // Send last 5 messages for context
            });

            if (response.data.success) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.data.response }]);
            }
        } catch (error: any) {
            toast.error('Gagal mengirim pesan');
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-scale-in border border-white/20">

                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Asisten Belajar AI</h3>
                            <p className="text-xs text-gray-500">Codelab AI V1.1</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-100/80 p-1 rounded-xl">
                        <button
                            onClick={() => {
                                if (practiceStep === 'question') {
                                    toast.error('Selesaikan latihan dulu sebelum membuka diskusi!', { icon: '🔒' });
                                    return;
                                }
                                setMode('chat');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${mode === 'chat'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : practiceStep === 'question'
                                    ? 'text-gray-400 cursor-not-allowed opacity-50'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title={practiceStep === 'question' ? "Selesaikan latihan dulu!" : "Diskusi dengan AI"}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Diskusi
                            {practiceStep === 'question' && <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </button>
                        <button
                            onClick={() => setMode('practice')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${mode === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Latihan
                        </button>
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative bg-slate-50">

                    {/* --- CHAT MODE --- */}
                    {mode === 'chat' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                                <Bot className="w-5 h-5 text-indigo-600" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex gap-3 justify-start animate-pulse">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 shrink-0">
                                <div className="flex mx-auto gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Tanyakan sesuatu tentang materi ini..."
                                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3.5 focus:bg-white transition-colors"
                                        disabled={chatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim() || chatLoading}
                                        className="p-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* --- PRACTICE MODE --- */}
                    {mode === 'practice' && (
                        <div className="h-full overflow-y-auto p-4 md:p-8">
                            <div className="flex flex-col items-center justify-center min-h-full">
                                {practiceStep === 'start' && (
                                    <div className="text-center max-w-md mx-auto">
                                        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                                            <BookOpen className="w-16 h-16 text-indigo-600" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3">Uji Pemahamanmu</h4>
                                        <p className="text-gray-500 mb-8 leading-relaxed">
                                            AI akan membuatkan satu soal latihan unik berdasarkan materi ini.
                                        </p>
                                        <button
                                            onClick={handleGenerateQuestion}
                                            disabled={practiceLoading}
                                            className="w-full btn btn-primary py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                        >
                                            {practiceLoading ? (
                                                <>
                                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                                    Membuat Soal...
                                                </>
                                            ) : (
                                                <>
                                                    Mulai Latihan
                                                    <ChevronRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {practiceStep === 'question' && (
                                    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                                        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
                                            <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                                Pertanyaan AI
                                            </h5>
                                            <p className="text-gray-800 text-lg font-medium leading-relaxed">{question}</p>
                                        </div>

                                        <form onSubmit={handleSubmit(handleSubmitAnswer)} className="space-y-4">
                                            <div className="bg-white p-2 rounded-2xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                                                <textarea
                                                    {...register('answer', { required: true })}
                                                    rows={6}
                                                    className="w-full p-4 border-none bg-transparent focus:ring-0 text-gray-800 placeholder-gray-400 resize-none"
                                                    placeholder="Tulis jawabanmu di sini..."
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={practiceLoading}
                                                    className="btn btn-primary px-8 py-3 rounded-xl shadow-lg shadow-indigo-200"
                                                >
                                                    {practiceLoading ? 'Menilai...' : 'Kirim Jawaban'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {practiceStep === 'result' && result && (
                                    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                                        <div className="text-center mb-8">
                                            <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold border-[6px] shadow-xl ${result.score >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {result.score}
                                            </div>
                                            <h4 className="text-2xl font-bold text-gray-900">
                                                {result.score >= 70 ? 'Luar Biasa!' : 'Tetap Semangat!'}
                                            </h4>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors">
                                                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                    <Bot className="w-5 h-5 text-indigo-500" />
                                                    Feedback AI
                                                </h5>
                                                <p className="text-gray-600 leading-relaxed">{result.feedback}</p>
                                            </div>

                                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                                <h5 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    Jawaban Ideal
                                                </h5>
                                                <p className="text-emerald-700 leading-relaxed">{result.correctAnswer}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-4">
                                            <button
                                                onClick={handleResetPractice}
                                                className="px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:-translate-y-0.5"
                                            >
                                                Coba Soal Lain
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}
