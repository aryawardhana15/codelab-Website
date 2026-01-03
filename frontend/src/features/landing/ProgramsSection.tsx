'use client';

import { useState } from 'react';
import { programs } from '@/shared/data/landingData';
import {
    BookOpen,
    Code,
    Lightbulb,
    CheckCircle,
    Users,
    Monitor,
    TrendingUp,
    Headphones,
    Bug,
    Settings,
    Send,
    MessageSquare,
    Handshake,
    UserCheck,
    FileCheck,
    CheckCircle2,
    Share2,
    Video,
    GraduationCap,
    ArrowRight
} from 'lucide-react';

// Program Icons mapping
const ProgramIcons = {
    book: <BookOpen className="w-8 h-8" />,
    code: <Code className="w-8 h-8" />,
    event: <Lightbulb className="w-8 h-8" />,
};

// Feature icons for Program 1
const FeatureIcons = {
    '✅': <CheckCircle className="w-6 h-6 text-success" />,
};

// Service icons for Program 2
const ServiceIcons: Record<string, React.ReactNode> = {
    '💻': <Monitor className="w-10 h-10 text-primary" />,
    '🐛': <Bug className="w-10 h-10 text-primary" />,
    '⚙️': <Settings className="w-10 h-10 text-primary" />,
};

// Workflow icons for Program 2
const WorkflowIcons: Record<string, React.ReactNode> = {
    '📩': <Send className="w-5 h-5" />,
    '🗣️': <MessageSquare className="w-5 h-5" />,
    '🤝': <Handshake className="w-5 h-5" />,
    '👨‍💻': <UserCheck className="w-5 h-5" />,
    '📝': <FileCheck className="w-5 h-5" />,
    '✅': <CheckCircle2 className="w-5 h-5" />,
};

// Event icons for Program 3
const EventIcons: Record<string, React.ReactNode> = {
    '📱': <Share2 className="w-8 h-8 text-primary" />,
    '🎥': <Video className="w-8 h-8 text-primary" />,
    '🎓': <GraduationCap className="w-8 h-8 text-primary" />,
};

export default function ProgramsSection() {
    const [activeProgram, setActiveProgram] = useState(0);

    return (
        <section id="programs" className="p-16 pb-20 bg-light-50">
            <div className="container-app">
                <div className="text-center mb-12">
                    <span className="badge badge-primary mb-4">Program Kami</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Solusi Lengkap untuk <span className="text-gradient">Karir IT</span> Kamu
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dari belajar coding, jasa development, hingga event & komunitas - semua ada di Codelab.
                    </p>
                </div>

                {/* Program Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {programs.map((program, index) => (
                        <button
                            key={program.id}
                            onClick={() => setActiveProgram(index)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeProgram === index
                                ? 'bg-gradient-primary text-white shadow-glow-primary'
                                : 'bg-light-100 text-gray-700 hover:bg-light-200'
                                }`}
                        >
                            {ProgramIcons[program.icon as keyof typeof ProgramIcons]}
                            {program.title}
                        </button>
                    ))}
                </div>

                {/* Program Content */}
                <div className="max-w-5xl mx-auto">
                    {programs.map((program, index) => (
                        <div
                            key={program.id}
                            className={`transition-all duration-500 ${activeProgram === index ? 'opacity-100' : 'opacity-0 hidden'
                                }`}
                        >
                            <div className="card shadow-lg border-2 border-primary/20">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white">
                                        {ProgramIcons[program.icon as keyof typeof ProgramIcons]}
                                    </div>
                                    <div>
                                        <span className="text-sm text-primary font-medium">{program.subtitle}</span>
                                        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                            {ProgramIcons[program.icon as keyof typeof ProgramIcons]}
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-500">{program.focus}</p>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-600 mb-8">{program.description}</p>

                                {/* Program 1: Learning */}
                                {program.id === 'codelab-learning' && (
                                    <>
                                        {/* Features */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Kenapa Belajar di Codelab?</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {program.features?.map((feature, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-4 bg-light-50 rounded-xl">
                                                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                                            <CheckCircle className="w-5 h-5 text-success" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{feature.text}</p>
                                                            <p className="text-sm text-gray-600">{feature.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Classes */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Pilihan Kelas Kami</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {program.classes?.map((cls, i) => (
                                                    <div key={i} className="p-4 border border-light-200 rounded-xl hover:border-primary transition-colors flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Users className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-primary">{cls.name}</p>
                                                            <p className="text-sm text-gray-600">{cls.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Program 2: Solutions */}
                                {program.id === 'coding-solutions' && (
                                    <>
                                        {/* Services */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Layanan Unggulan</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {program.features?.map((feature, i) => (
                                                    <div key={i} className="text-center p-6 bg-light-50 rounded-xl">
                                                        <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                            {ServiceIcons[feature.icon] || <Code className="w-10 h-10 text-primary" />}
                                                        </div>
                                                        <p className="font-semibold text-gray-900 mb-2">{feature.text}</p>
                                                        <p className="text-sm text-gray-600">{feature.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Benefits */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Keunggulan Jasa Kami</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {program.benefits?.map((benefit, i) => (
                                                    <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
                                                        <CheckCircle className="w-4 h-4" />
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Workflow */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Alur Pemesanan</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                {program.workflow?.map((step, i) => (
                                                    <div key={i} className="text-center">
                                                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                                                            {WorkflowIcons[step.step] || <CheckCircle2 className="w-5 h-5" />}
                                                        </div>
                                                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Program 3: Event */}
                                {program.id === 'codelab-event' && (
                                    <div className="mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Apa yang Bisa Kamu Ikuti?</h4>
                                        <div className="space-y-4">
                                            {program.events?.map((event, i) => (
                                                <div key={i} className="p-6 bg-light-50 rounded-xl border-l-4 border-primary">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                            {EventIcons[event.icon] || <Lightbulb className="w-8 h-8 text-primary" />}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-lg">{event.name}</h5>
                                                            <p className="text-gray-600 mb-2">{event.desc}</p>
                                                            {event.format && (
                                                                <p className="text-sm text-primary font-medium">Format: {event.format}</p>
                                                            )}
                                                            {event.highlight && (
                                                                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-secondary/20 text-secondary-800 rounded-full text-sm font-medium">
                                                                    <TrendingUp className="w-4 h-4" />
                                                                    {event.highlight}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <a
                                    href={program.ctaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg w-full sm:w-auto inline-flex items-center gap-2"
                                >
                                    {program.cta}
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
