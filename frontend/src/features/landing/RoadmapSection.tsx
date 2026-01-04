'use client';

import Link from 'next/link';
import { roadmap } from '@/shared/data/landingData';
import { motion } from 'framer-motion';

export default function RoadmapSection() {
    return (
        <section id="roadmap" className="py-20 bg-light-800 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container-app relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="badge badge-primary mb-4">Learning Path</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Roadmap <span className="text-gradient-gold">Fullstack Developer</span>
                    </h2>
                    <p className="text-xl text-light-300 max-w-2xl mx-auto">
                        Ikuti jalur pembelajaran terstruktur untuk menjadi developer profesional.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {roadmap.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        >
                            <div className="w-32 shrink-0">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-block px-6 py-3 bg-gradient-primary text-white font-bold rounded-full text-sm"
                                >
                                    {item.category}
                                </motion.span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {item.skills.map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
                                        className="px-5 py-2.5 bg-light-700/50 border border-light-600 rounded-full text-light-100 hover:border-primary hover:bg-primary/10 transition-all cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link href="/register" className="btn btn-primary btn-lg">
                        Mulai Perjalananmu
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
