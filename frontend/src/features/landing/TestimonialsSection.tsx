'use client';

import { useState } from 'react';
import { testimonials } from '@/shared/data/landingData';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container-app">
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">Testimoni</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Apa Kata <span className="text-gradient">Alumni</span> Kami?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dengarkan pengalaman mereka yang sudah sukses berkarir di bidang IT.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative min-h-[280px]">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={`card shadow-glow-primary transition-all duration-500 ${activeTestimonial === index
                                        ? 'opacity-100 scale-100 relative'
                                        : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shrink-0">
                                        <Quote className="w-10 h-10 text-white" />
                                    </div>

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
                                                    <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            &quot;{testimonial.text}&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === index
                                        ? 'bg-primary w-8'
                                        : 'bg-light-300 hover:bg-light-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
