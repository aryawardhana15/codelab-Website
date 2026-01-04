'use client';

import { useState, useEffect } from 'react';
import { testimonials } from '@/shared/data/landingData';
import { Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialsSection() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonials" className="py-20 bg-white overflow-hidden">
            <div className="container-app">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="badge badge-primary mb-4">Testimoni</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Apa Kata <span className="text-gradient">Alumni</span> Kami?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dengarkan pengalaman mereka yang sudah sukses berkarir di bidang IT.
                    </p>
                </motion.div>

                {/* Testimonial Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative min-h-[280px]">
                        <AnimatePresence mode="wait">
                            {testimonials.map((testimonial, index) => (
                                activeTestimonial === index && (
                                    <motion.div
                                        key={testimonial.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.4 }}
                                        className="card shadow-glow-primary"
                                    >
                                        <div className="flex flex-col md:flex-row items-start gap-6">
                                            {/* Avatar */}
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shrink-0"
                                            >
                                                <Quote className="w-10 h-10 text-white" />
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                                                        <p className="text-primary">{testimonial.role}</p>
                                                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.2, delay: 0.2 + i * 0.05 }}
                                                            >
                                                                <Star className="w-5 h-5 text-secondary fill-secondary" />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                    className="text-gray-600 text-lg leading-relaxed"
                                                >
                                                    &quot;{testimonial.text}&quot;
                                                </motion.p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`h-3 rounded-full transition-all ${activeTestimonial === index
                                    ? 'bg-primary w-8'
                                    : 'bg-light-300 hover:bg-light-400 w-3'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
