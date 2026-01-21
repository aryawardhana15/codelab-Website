'use client';

import { ArrowRight, BookOpen, Code, Lightbulb, CheckCircle, Users, Monitor, Bug, Settings, Send, MessageSquare, Handshake, UserCheck, FileCheck, CheckCircle2, Share2, Video, GraduationCap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, animate } from 'framer-motion';
import { programs } from '@/shared/data/landingData';

// Program Icons mapping
const ProgramIcons = {
    book: <BookOpen className="w-8 h-8" />,
    code: <Code className="w-8 h-8" />,
    event: <Lightbulb className="w-8 h-8" />,
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
    '📱': <Share2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
    '🎥': <Video className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
    '🎓': <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
};

const stats = [
    { value: '20+', label: 'Siswa Sukses' },
    { value: '10+', label: 'Expert Mentor' },
    { value: '10+', label: 'Kursus Tersedia' },
    { value: '85%', label: 'Tingkat Kepuasan' },
];

const CounterItem = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => {
    const numericValue = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, numericValue, { duration: 2.5, ease: "easeOut", delay });
        return controls.stop;
    }, [count, numericValue, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            whileHover={{ scale: 1.05 }}
            className="text-center transition-all duration-300"
        >
            <div
                className="text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #F9A825 0%, #F97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                <motion.span>{rounded}</motion.span>
                <span>{suffix}</span>
            </div>
            <div className="text-sm text-gray-500 font-medium">
                {label}
            </div>
        </motion.div>
    );
};

// Helper Component to safely use hooks inside loops
// Disabling lint rule for this line as we're intentionally passing props
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ParallaxObject = ({
    parallaxX,
    parallaxY,
    speed,
    className,
    style,
    animate,
    transition,
    ...props
}: {
    parallaxX: MotionValue<number>;
    parallaxY: MotionValue<number>;
    speed: number;
    className?: string;
    style?: any;
    animate?: any;
    transition?: any;
    [key: string]: any;
}) => {
    const x = useTransform(parallaxX, (v) => v * speed);
    const y = useTransform(parallaxY, (v) => v * speed);

    return (
        <motion.div
            className={`absolute rounded-full ${className || ''}`}
            style={{ ...style, x, y, willChange: 'transform' }}
            animate={animate}
            transition={transition}
            {...props}
        />
    );
};

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [activeProgram, setActiveProgram] = useState(0);

    // Mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for cursor followers - INCREASED DAMPING FOR SMOOTHER FEEL
    const springConfig = { damping: 40, stiffness: 100 }; // Softer spring to reduce jitter
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const cursorX2 = useSpring(mouseX, { damping: 50, stiffness: 80 });
    const cursorY2 = useSpring(mouseY, { damping: 50, stiffness: 80 });

    // Transform mouse position to parallax values (-1 to 1)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Stable random data generation
    // AGGRESSIVE REDUCTION FOR PERFORMANCE
    const [particleData] = useState(() => {
        const generatePosition = (avoidCenter = false) => {
            let top, left;
            if (avoidCenter) {
                // Generate positions that are NOT in the center 40% of the screen
                do {
                    top = Math.random() * 100;
                    left = Math.random() * 100;
                } while (top > 30 && top < 70 && left > 20 && left < 80);
            } else {
                top = Math.random() * 100;
                left = Math.random() * 100;
            }
            return { top, left };
        };

        const mediumOrbs = Array.from({ length: 4 }, (_, i) => { // Reduced 8 -> 4
            const pos = generatePosition(true);
            return {
                id: i,
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: pos.top,
                left: pos.left,
                speed: -(Math.random() * 100 + 50),
                bg: i % 2 === 0 ? 'rgba(249, 115, 22, 0.5)' : 'rgba(253, 224, 71, 0.5)',
                blur: 'blur(8px)',
            };
        });

        const fastParticles = Array.from({ length: 3 }, (_, i) => { // Reduced 5 -> 3
            const pos = generatePosition(true);
            return {
                id: i,
                width: Math.random() * 15 + 5,
                height: Math.random() * 15 + 5,
                top: pos.top,
                left: pos.left,
                speed: -(Math.random() * 300 + 150),
                color: i % 2 === 0 ? '#F97316' : '#EAB308',
                blur: 'blur(4px)',
            };
        });

        return { mediumOrbs, fastParticles };
    });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const parallaxX = useTransform(mouseX, [0, windowSize.width || 1000], [-1, 1]);
    const parallaxY = useTransform(mouseY, [0, windowSize.height || 1000], [-1, 1]);

    // Pre-calculate all fixed parallax transforms
    const parallaxX40 = useTransform(parallaxX, (x) => x * -80);
    const parallaxY40 = useTransform(parallaxY, (y) => y * -80);
    const parallaxX30 = useTransform(parallaxX, (x) => x * -60);
    const parallaxY30 = useTransform(parallaxY, (y) => y * -60);
    const parallaxX50 = useTransform(parallaxX, (x) => x * -100);
    const parallaxY50 = useTransform(parallaxY, (y) => y * -100);
    const parallaxX70 = useTransform(parallaxX, (x) => x * -140);
    const parallaxY70 = useTransform(parallaxY, (y) => y * -140);
    const parallaxX60 = useTransform(parallaxX, (x) => x * -120);
    const parallaxY60 = useTransform(parallaxY, (y) => y * -120);
    const parallaxX90 = useTransform(parallaxX, (x) => x * -180);
    const parallaxY90 = useTransform(parallaxY, (y) => y * -180);
    const parallaxX80 = useTransform(parallaxX, (x) => x * -160);
    const parallaxY80 = useTransform(parallaxY, (y) => y * -160);
    const parallaxX20 = useTransform(parallaxX, (x) => x * -40);
    const parallaxY20 = useTransform(parallaxY, (y) => y * -40);
    const parallaxX35 = useTransform(parallaxX, (x) => x * -70);
    const parallaxY35 = useTransform(parallaxY, (y) => y * -70);
    const parallaxX45 = useTransform(parallaxX, (x) => x * -90);
    const parallaxY45 = useTransform(parallaxY, (y) => y * -90);
    const parallaxX25 = useTransform(parallaxX, (x) => x * -50);
    const parallaxY25 = useTransform(parallaxY, (y) => y * -50);
    const parallaxX55 = useTransform(parallaxX, (x) => x * -110);
    const parallaxY55 = useTransform(parallaxY, (y) => y * -110);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) {
        return (
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FDF8F3] via-[#FFF8E7] to-[#FDF8F3]">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-20 ">
                    {/* ... (Loading state content) ... */}
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-x-hidden bg-gradient-to-b from-[#FDF8F3] via-[#FFF8E7] to-[#FFF8E7]">
            {/* Smooth Cursor Followers */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    className="absolute w-[500px] h-[500px] opacity-40"
                    style={{
                        x: cursorX,
                        y: cursorY,
                        translateX: '-50%',
                        translateY: '-50%',
                        background: 'radial-gradient(circle at center, rgba(249, 168, 37, 0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        willChange: 'transform',
                    }}
                />
                <motion.div
                    className="absolute w-[800px] h-[800px] opacity-30"
                    style={{
                        x: cursorX2,
                        y: cursorY2,
                        translateX: '-50%',
                        translateY: '-50%',
                        background: 'radial-gradient(circle at center, rgba(253, 224, 166, 0.5) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        willChange: 'transform',
                    }}
                />
            </div>

            {/* Background Parallax Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* 1. Large Ambient Gradients (Base Layer) - Increased Opacity */}
                <motion.div className="absolute top-0 right-0 w-[800px] h-[800px]" style={{ x: parallaxX40, y: parallaxY40, willChange: 'transform' }}>
                    <div className="w-full h-full opacity-30 animate-pulse-slow">
                        <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 70% 30%, #F97316 0%, transparent 60%)', filter: 'blur(60px)' }} />
                    </div>
                </motion.div>
                {/* ... (Other parallax elements) ... */}
                <motion.div className="absolute bottom-0 left-0 w-[700px] h-[700px]" style={{ x: parallaxX30, y: parallaxY30, willChange: 'transform' }}>
                    <div className="w-full h-full opacity-30 animate-pulse-slow">
                        <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 30% 70%, #F9A825 0%, transparent 60%)', filter: 'blur(60px)' }} />
                    </div>
                </motion.div>

                {/* 2. Medium Floating Orbs (Mid Layer) */}
                {particleData.mediumOrbs.map((orb) => (
                    <ParallaxObject
                        key={`orb-${orb.id}`}
                        parallaxX={parallaxX}
                        parallaxY={parallaxY}
                        speed={orb.speed}
                        style={{
                            width: orb.width,
                            height: orb.height,
                            top: `${orb.top}%`,
                            left: `${orb.left}%`,
                            background: orb.bg,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            filter: orb.blur,
                        }}
                    />
                ))}

                {/* 4. Rings (Structural Elements) */}
                <motion.div className="absolute top-[15%] right-[10%] w-[300px] h-[300px]" style={{ x: parallaxX50, y: parallaxY50, willChange: 'transform' }}>
                    <div className="w-full h-full animate-spin-slow">
                        <div className="w-full h-full rounded-full border-[4px] border-orange-200/60 dashed" style={{ filter: 'blur(1px)' }} />
                    </div>
                </motion.div>
                {/* ... More Rings ... */}
                <motion.div className="absolute top-[18%] right-[13%] w-[220px] h-[220px]" style={{ x: parallaxX70, y: parallaxY70, willChange: 'transform' }}>
                    <div className="w-full h-full animate-spin-reverse">
                        <div className="w-full h-full rounded-full border-[3px] border-yellow-300/60" style={{ filter: 'blur(1px)' }} />
                    </div>
                </motion.div>

                <motion.div className="absolute bottom-[20%] left-[8%] w-[250px] h-[250px]" style={{ x: parallaxX40, y: parallaxY40, willChange: 'transform' }}>
                    <div className="w-full h-full animate-spin-slow-alt">
                        <div className="w-full h-full rounded-full border-[4px] border-orange-300/50" style={{ filter: 'blur(1px)' }} />
                    </div>
                </motion.div>

                {/* 5. Featured Orbs (Highlights) */}
                <motion.div className="absolute top-[30%] left-[10%] w-48 h-48" style={{ x: parallaxX60, y: parallaxY60, willChange: 'transform' }}>
                    <div className="w-full h-full rounded-full opacity-60 animate-float-1" style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)', filter: 'blur(30px)' }} />
                </motion.div>

                <motion.div className="absolute top-[50%] right-[8%] w-56 h-56" style={{ x: parallaxX90, y: parallaxY90, willChange: 'transform' }}>
                    <div className="w-full h-full rounded-full opacity-60 animate-float-2" style={{ background: 'radial-gradient(circle, #EAB308 0%, transparent 70%)', filter: 'blur(30px)' }} />
                </motion.div>

                {/* 6. Foreground Speed Particles (Depth Cue) */}
                {particleData.fastParticles.map((p) => (
                    <ParallaxObject
                        key={`fg-particle-${p.id}`}
                        parallaxX={parallaxX}
                        parallaxY={parallaxY}
                        speed={p.speed}
                        style={{
                            width: p.width,
                            height: p.height,
                            top: `${p.top}%`,
                            left: `${p.left}%`,
                            background: p.color,
                            opacity: 0.9,
                            zIndex: 0,
                            filter: p.blur,
                        }}
                    />
                ))}

                {/* Particles */}
                <motion.div className="absolute top-[20%] right-[25%] w-2 h-2 rounded-full bg-orange-400/40 animate-twinkle-1" style={{ x: parallaxX20, y: parallaxY20 }} />
                <motion.div className="absolute top-[40%] left-[30%] w-2 h-2 rounded-full bg-yellow-400/50 animate-twinkle-2" style={{ x: parallaxX35, y: parallaxY35 }} />
                <motion.div className="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full bg-orange-300/45 animate-twinkle-3" style={{ x: parallaxX45, y: parallaxY45 }} />
                <motion.div className="absolute top-[75%] left-[20%] w-2 h-2 rounded-full bg-yellow-300/40 animate-twinkle-1" style={{ x: parallaxX25, y: parallaxY25 }} />
                <motion.div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 rounded-full bg-orange-400/35 animate-twinkle-2" style={{ x: parallaxX55, y: parallaxY55 }} />
                <motion.div className="absolute top-[85%] right-[45%] w-2 h-2 rounded-full bg-yellow-400/45 animate-twinkle-3" style={{ x: parallaxX30, y: parallaxY30 }} />
            </div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 min-h-screen flex items-center pt-20 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center justify-center gap-2 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                        <span className="text-sm font-medium text-[#F97316]">
                            Platform Edukasi IT #1 di Indonesia
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h1 className="mb-8 select-none cursor-default">
                        <motion.span
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="block text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-2"
                        >
                            Belajar
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            whileHover={{ scale: 1.05, rotate: -1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="block text-6xl md:text-7xl lg:text-8xl font-extrabold italic mb-2 animate-gradient origin-left"
                            style={{
                                background: 'linear-gradient(90deg, #F9A825 0%, #FFD54F 50%, #F9A825 100%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Coding
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="block text-6xl md:text-7xl lg:text-8xl font-extrabold animate-gradient"
                            style={{
                                background: 'linear-gradient(90deg, #F9A825 0%, #FFD54F 50%, #F9A825 100%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Jadi Mudah
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Tingkatkan skill IT kamu dengan bimbingan mentor berpengalaman,
                        kursus terstruktur, dan komunitas developer yang supportive.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-16 max-w-lg mx-auto"
                    >
                        <motion.a
                            href="/register"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white text-sm transition-all duration-300 w-full sm:w-auto overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #F9A825 0%, #F97316 100%)',
                                boxShadow: '0 4px 14px rgba(249, 168, 37, 0.3)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer" />
                            <span className="relative">Mulai Belajar Gratis</span>
                            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                        <motion.a
                            href="#programs"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-gray-700 text-sm bg-white/80 backdrop-blur-sm border border-gray-900 hover:bg-white hover:border-orange-500 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                        >
                            Lihat Program
                        </motion.a>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <CounterItem
                                key={index}
                                value={stat.value}
                                label={stat.label}
                                delay={1 + index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Programs Section */}
            <div id="programs" className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-sm font-medium text-orange-600 mb-4">Program Kami</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Solusi Lengkap untuk <span className="bg-gradient-to-r from-[#F9A825] to-[#F97316] bg-clip-text text-transparent">Karir IT</span> Kamu
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dari belajar coding, jasa development, hingga event & komunitas - semua ada di Codelab.
                    </p>
                </motion.div>

                {/* Program Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {programs.map((program, index) => (
                        <button
                            key={program.id}
                            onClick={() => setActiveProgram(index)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeProgram === index
                                ? 'bg-gradient-to-r from-[#F9A825] to-[#F97316] text-white shadow-lg shadow-orange-500/30'
                                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200'
                                }`}
                        >
                            {ProgramIcons[program.icon as keyof typeof ProgramIcons]}
                            {program.title}
                        </button>
                    ))}
                </motion.div>

                {/* Program Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="max-w-5xl mx-auto"
                >
                    {programs.map((program, index) => (
                        <div
                            key={program.id}
                            className={`transition-all duration-500 ${activeProgram === index ? 'opacity-100' : 'opacity-0 hidden'
                                }`}
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#F97316] rounded-2xl flex items-center justify-center text-white">
                                        {ProgramIcons[program.icon as keyof typeof ProgramIcons]}
                                    </div>
                                    <div>
                                        <span className="text-sm text-orange-500 font-medium">{program.subtitle}</span>
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
                                                    <div key={i} className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-xl">
                                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
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
                                                    <div key={i} className="p-4 border border-gray-200 rounded-xl hover:border-orange-500 transition-colors flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                                            <Users className="w-4 h-4 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-orange-500">{cls.name}</p>
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
                                                    <div key={i} className="text-center p-6 bg-orange-50/50 rounded-xl">
                                                        <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-2xl flex items-center justify-center">
                                                            {ServiceIcons[feature.icon] || <Code className="w-10 h-10 text-orange-500" />}
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
                                                    <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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
                                                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-[#F9A825] to-[#F97316] rounded-full flex items-center justify-center text-white">
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
                                                <div key={i} className="p-4 md:p-6 bg-orange-50/50 rounded-xl border-l-4 border-orange-500">
                                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                                                            {EventIcons[event.icon] || <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-lg">{event.name}</h5>
                                                            <p className="text-gray-600 mb-2 text-sm md:text-base">{event.desc}</p>
                                                            {event.format && (
                                                                <p className="text-sm text-orange-500 font-medium">Format: {event.format}</p>
                                                            )}
                                                            {event.highlight && (
                                                                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
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
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white text-sm transition-all duration-300 w-full sm:w-auto justify-center bg-gradient-to-r from-[#F9A825] to-[#F97316] hover:shadow-lg hover:shadow-orange-500/30"
                                >
                                    {program.cta}
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.05); }
                }
                @keyframes float-1 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(25px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(-20px, 25px); }
                    66% { transform: translate(30px, -15px); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-25px, -25px); }
                }
                @keyframes twinkle-1 {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.5); }
                }
                @keyframes twinkle-2 {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.3); }
                }
                @keyframes twinkle-3 {
                    0%, 100% { opacity: 0.25; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.4); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes spin-slow-alt {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 7s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 9s ease-in-out infinite; }
                .animate-twinkle-1 { animation: twinkle-1 3s ease-in-out infinite; }
                .animate-twinkle-2 { animation: twinkle-2 2.5s ease-in-out infinite; animation-delay: 0.5s; }
                .animate-twinkle-3 { animation: twinkle-3 3.5s ease-in-out infinite; animation-delay: 1s; }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
                .animate-spin-slow-alt { animation: spin-slow-alt 25s linear infinite; }
                .animate-shimmer { animation: shimmer 1.5s ease-in-out; }
                .animate-gradient { animation: gradient-shift 3s ease-in-out infinite; }
            `}</style>
        </section>
    );
}