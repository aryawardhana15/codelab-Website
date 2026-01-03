'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

const stats = [
    { value: '500+', label: 'Alumni Sukses' },
    { value: '50+', label: 'Expert Mentor' },
    { value: '100+', label: 'Kursus Tersedia' },
    { value: '95%', label: 'Tingkat Kepuasan' },
];

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

        // REMOVED SMALL PARTICLES AS REQUESTED

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
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center gap-2 mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                            <span className="text-sm font-medium text-[#F97316]">
                                Platform Edukasi IT #1 di Indonesia
                            </span>
                        </div>
                        <h1 className="mb-8">
                            <span className="block text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-2">
                                Belajar
                            </span>
                            <span className="block text-6xl md:text-7xl lg:text-8xl font-extrabold italic mb-2 bg-gradient-to-r from-[#F9A825] via-[#FFD54F] to-[#F9A825] bg-clip-text text-transparent">
                                Coding
                            </span>
                            <span className="block text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-[#F9A825] via-[#FFD54F] to-[#F9A825] bg-clip-text text-transparent">
                                Jadi Mudah
                            </span>
                        </h1>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-full flex items-center overflow-x-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FFF8E7] to-[#FDF8F3]">
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
                            // REMOVED BACKDROP FILTER for performance
                            filter: orb.blur,
                        }}
                    />
                ))}

                {/* SMALL PARTICLES RENDER REMOVED */}

                {/* 4. Rings (Structural Elements) */}
                <motion.div className="absolute top-[15%] right-[10%] w-[300px] h-[300px]" style={{ x: parallaxX50, y: parallaxY50, willChange: 'transform' }}>
                    <div className="w-full h-full animate-spin-slow">
                        <div className="w-full h-full rounded-full border-[4px] border-orange-200/60 dashed" style={{ filter: 'blur(1px)' }} />
                    </div>
                </motion.div>

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
                            zIndex: 0, // Behind text
                            filter: p.blur, // Apply blur
                        }}
                    />
                ))}

                {/* Particles */}
                <motion.div
                    className="absolute top-[20%] right-[25%] w-2 h-2 rounded-full bg-orange-400/40 animate-twinkle-1"
                    style={{
                        x: parallaxX20,
                        y: parallaxY20,
                    }}
                />
                <motion.div
                    className="absolute top-[40%] left-[30%] w-2 h-2 rounded-full bg-yellow-400/50 animate-twinkle-2"
                    style={{
                        x: parallaxX35,
                        y: parallaxY35,
                    }}
                />
                <motion.div
                    className="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full bg-orange-300/45 animate-twinkle-3"
                    style={{
                        x: parallaxX45,
                        y: parallaxY45,
                    }}
                />
                <motion.div
                    className="absolute top-[75%] left-[20%] w-2 h-2 rounded-full bg-yellow-300/40 animate-twinkle-1"
                    style={{
                        x: parallaxX25,
                        y: parallaxY25,
                    }}
                />
                <motion.div
                    className="absolute top-[30%] left-[40%] w-1.5 h-1.5 rounded-full bg-orange-400/35 animate-twinkle-2"
                    style={{
                        x: parallaxX55,
                        y: parallaxY55,
                    }}
                />
                <motion.div
                    className="absolute top-[85%] right-[45%] w-2 h-2 rounded-full bg-yellow-400/45 animate-twinkle-3"
                    style={{
                        x: parallaxX30,
                        y: parallaxY30,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center justify-center gap-2 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                        <span className="text-sm font-medium text-[#F97316]">
                            Platform Edukasi IT #1 di Indonesia
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h1 className="mb-8 select-none">
                        <motion.span
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0 }}
                            className="block text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-2"
                        >
                            Belajar
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block text-6xl md:text-7xl lg:text-8xl font-extrabold italic mb-2 animate-gradient"
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
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Tingkatkan skill IT kamu dengan bimbingan mentor berpengalaman,
                        kursus terstruktur, dan komunitas developer yang supportive.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
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
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className="text-center transition-all duration-300"
                            >
                                <div
                                    className="text-3xl md:text-4xl font-bold mb-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #F9A825 0%, #F97316 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
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