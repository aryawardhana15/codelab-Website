'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Code, Users, Zap } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'Codelab Activity',
        category: 'Learning Atmosphere',
        image: '/gallery/galeri (1).jpeg',
        span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
        icon: <Code className="w-4 h-4" />
    },
    {
        id: 2,
        title: 'Focus & Discussion',
        category: 'Mentoring',
        image: '/gallery/galeri (2).jpeg',
        span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
        icon: <Users className="w-4 h-4" />
    },
    {
        id: 3,
        title: 'Classroom Vibes',
        category: 'Daily Activity',
        image: '/gallery/galeri (3).jpeg',
        span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
        icon: <Zap className="w-4 h-4" />
    }
];

export default function GallerySection() {
    return (
        <section id="gallery" className="py-24 bg-light-800 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <div className="container-app relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-light-700/30 border border-light-600/30 text-primary-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
                        Dokumentasi
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-secondary-300">Codelab</span>
                    </h2>
                    <p className="text-lg text-light-400 max-w-2xl mx-auto leading-relaxed">
                        Intip keseruan belajar, hasil karya siswa, dan momen berbagi ilmu di ekosistem Codelab.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[auto]">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative rounded-[2rem] overflow-hidden ${project.span} border border-white/5 bg-light-700/20 backdrop-blur-sm min-h-[300px] md:min-h-[350px]`}
                        >
                            {/* Hover Border Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-overlay" />
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-[2rem]" />
                            </div>

                            {/* Image Background */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-light-900 via-light-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-30 flex flex-col justify-end h-full">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out w-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-primary-200">
                                            {project.icon}
                                            {project.category}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-light-300 transition-colors duration-300">
                                        {project.title}
                                    </h3>

                                    <p className="text-sm text-light-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                                        Dokumentasi kegiatan dan karya di lingkungan Codelab Indonesia.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
