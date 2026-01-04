import Link from 'next/link';
import { roadmap } from '@/shared/data/landingData';

export default function RoadmapSection() {
    return (
        <section id="roadmap" className="py-20 bg-light-800 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container-app relative z-10">
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">Learning Path</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Roadmap <span className="text-gradient-gold">Fullstack Developer</span>
                    </h2>
                    <p className="text-xl text-light-300 max-w-2xl mx-auto">
                        Ikuti jalur pembelajaran terstruktur untuk menjadi developer profesional.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {roadmap.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-32 shrink-0">
                                <span className="inline-block px-6 py-3 bg-gradient-primary text-white font-bold rounded-full text-sm">
                                    {item.category}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {item.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-5 py-2.5 bg-light-700/50 border border-light-600 rounded-full text-light-100 hover:border-primary hover:bg-primary/10 transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/register" className="btn btn-primary btn-lg">
                        Mulai Perjalananmu
                    </Link>
                </div>
            </div>
        </section>
    );
}
