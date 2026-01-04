'use client';

import React, { useState } from 'react';

export default function DesignSystemPage() {
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('');

    // Color mappings from tailwind.config.ts
    const primaryColors = {
        50: '#FFF5EB', 100: '#FFE5CC', 200: '#FFCC99', 300: '#FFB366',
        400: '#FF9933', 500: '#FFA500', 600: '#FF8C00', 700: '#E67E22',
        800: '#CC6600', 900: '#994D00'
    };

    const secondaryColors = {
        50: '#FFFDE7', 100: '#FFF9C4', 200: '#FFF176', 300: '#FFEB3B',
        400: '#FFE082', 500: '#FFD700', 600: '#FFC107', 700: '#F4B400',
        800: '#E6A800', 900: '#CC9500'
    };

    const lightColors = {
        50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
        400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
        800: '#1F2937', 900: '#111827'
    };

    return (
        <div className="min-h-screen bg-light-50 text-gray-900">
            {/* Header */}
            <div className="bg-gradient-primary py-12">
                <div className="container-app">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Codelab Design System
                    </h1>
                    <p className="text-white/90 text-lg">
                        Comprehensive showcase of all design tokens, components, and utilities
                    </p>
                </div>
            </div>

            <div className="container-app py-12">
                {/* ========================================
            COLORS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Colors</h2>

                    {/* Primary Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-primary">Primary (Orange)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div key={shade} className="text-center">
                                    <div
                                        className={`h-20 rounded-lg mb-2 border border-gray-300`}
                                        style={{ backgroundColor: primaryColors[shade as keyof typeof primaryColors] }}
                                    ></div>
                                    <p className="text-sm text-gray-600">{shade}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-secondary-700">Secondary (Yellow)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div key={shade} className="text-center">
                                    <div
                                        className={`h-20 rounded-lg mb-2 border border-gray-300`}
                                        style={{ backgroundColor: secondaryColors[shade as keyof typeof secondaryColors] }}
                                    ></div>
                                    <p className="text-sm text-gray-600">{shade}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Light Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Light (Neutral)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div key={shade} className="text-center">
                                    <div
                                        className={`h-20 rounded-lg mb-2 border border-gray-300`}
                                        style={{ backgroundColor: lightColors[shade as keyof typeof lightColors] }}
                                    ></div>
                                    <p className="text-sm text-gray-600">{shade}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Semantic Colors */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Semantic Colors</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="h-20 bg-success rounded-lg mb-2"></div>
                                <p className="text-sm">Success</p>
                            </div>
                            <div className="text-center">
                                <div className="h-20 bg-warning rounded-lg mb-2"></div>
                                <p className="text-sm">Warning</p>
                            </div>
                            <div className="text-center">
                                <div className="h-20 bg-error rounded-lg mb-2"></div>
                                <p className="text-sm">Error</p>
                            </div>
                            <div className="text-center">
                                <div className="h-20 bg-info rounded-lg mb-2"></div>
                                <p className="text-sm">Info</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            GRADIENTS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Gradients</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="h-32 bg-gradient-primary rounded-xl mb-2"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-primary</p>
                        </div>
                        <div>
                            <div className="h-32 bg-gradient-primary-horizontal rounded-xl mb-2"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-primary-horizontal</p>
                        </div>
                        <div>
                            <div className="h-32 bg-gradient-orange rounded-xl mb-2"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-orange</p>
                        </div>
                        <div>
                            <div className="h-32 bg-gradient-gold rounded-xl mb-2"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-gold</p>
                        </div>
                        <div>
                            <div className="h-32 bg-gradient-light rounded-xl mb-2 border border-gray-300"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-light</p>
                        </div>
                        <div>
                            <div className="h-32 bg-gradient-diagonal rounded-xl mb-2"></div>
                            <p className="text-sm text-gray-600 text-center">bg-gradient-diagonal</p>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            BUTTONS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Buttons</h2>

                    <div className="space-y-6">
                        {/* Primary Buttons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Primary Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="btn btn-primary">Primary</button>
                                <button className="btn btn-secondary">Secondary</button>
                                <button className="btn btn-light">Light</button>
                            </div>
                        </div>

                        {/* Outline Buttons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Outline Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="btn btn-outline">Outline</button>
                                <button className="btn btn-outline-dark">Outline Dark</button>
                                <button className="btn btn-ghost">Ghost</button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <button className="btn btn-primary btn-sm">Small</button>
                                <button className="btn btn-primary">Default</button>
                                <button className="btn btn-primary btn-lg">Large</button>
                            </div>
                        </div>

                        {/* Icon Buttons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Icon Buttons</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="btn btn-primary btn-icon">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button className="btn btn-outline btn-icon">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            CARDS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-2">Basic Card</h3>
                            <p className="text-gray-600">Default card style with padding and shadow.</p>
                        </div>
                        <div className="card card-hover">
                            <h3 className="text-lg font-semibold mb-2">Hoverable Card</h3>
                            <p className="text-gray-600">Hover me to see the effect!</p>
                        </div>
                        <div className="card card-glow">
                            <h3 className="text-lg font-semibold mb-2">Glow Card</h3>
                            <p className="text-gray-600">This card glows on hover.</p>
                        </div>
                        <div className="card card-bordered">
                            <h3 className="text-lg font-semibold mb-2">Bordered Card</h3>
                            <p className="text-gray-600">Card with visible border.</p>
                        </div>
                        <div className="card card-glass">
                            <h3 className="text-lg font-semibold mb-2">Glass Card</h3>
                            <p className="text-gray-600">Glassmorphism effect with blur.</p>
                        </div>
                        <div className="card card-hover card-glow">
                            <h3 className="text-lg font-semibold mb-2">Combined Effects</h3>
                            <p className="text-gray-600">Hover + glow combined.</p>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            FORM ELEMENTS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Form Elements</h2>

                    <div className="max-w-2xl space-y-6">
                        {/* Input */}
                        <div>
                            <label className="input-label">Default Input</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter some text..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <p className="input-helper">This is helper text</p>
                        </div>

                        {/* Input Error */}
                        <div>
                            <label className="input-label">Input with Error</label>
                            <input
                                type="text"
                                className="input input-error"
                                placeholder="Error state..."
                            />
                            <p className="input-error-text">This field is required</p>
                        </div>

                        {/* Input Success */}
                        <div>
                            <label className="input-label">Input with Success</label>
                            <input
                                type="text"
                                className="input input-success"
                                placeholder="Success state..."
                                value="Valid input"
                                readOnly
                            />
                        </div>

                        {/* Select */}
                        <div>
                            <label className="input-label">Select Dropdown</label>
                            <select
                                className="select"
                                value={selectValue}
                                onChange={(e) => setSelectValue(e.target.value)}
                            >
                                <option value="">Choose an option</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                            </select>
                        </div>

                        {/* Textarea */}
                        <div>
                            <label className="input-label">Textarea</label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Enter your message..."
                            ></textarea>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            BADGES
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Badges</h2>
                    <div className="flex flex-wrap gap-3">
                        <span className="badge badge-primary">Primary</span>
                        <span className="badge badge-secondary">Secondary</span>
                        <span className="badge badge-success">Success</span>
                        <span className="badge badge-warning">Warning</span>
                        <span className="badge badge-error">Error</span>
                        <span className="badge badge-info">Info</span>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            TYPOGRAPHY
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Typography</h2>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-display-xl text-gradient mb-2">Display XL</h1>
                            <p className="text-sm text-gray-600">text-display-xl</p>
                        </div>
                        <div>
                            <h2 className="text-display-lg text-gradient-gold mb-2">Display LG</h2>
                            <p className="text-sm text-gray-600">text-display-lg</p>
                        </div>
                        <div>
                            <h3 className="text-display-md text-gradient mb-2">Display MD</h3>
                            <p className="text-sm text-gray-600">text-display-md</p>
                        </div>
                        <div>
                            <h4 className="text-display-sm text-gradient mb-2">Display SM</h4>
                            <p className="text-sm text-gray-600">text-display-sm</p>
                        </div>

                        <div className="divider my-8"></div>

                        <div>
                            <h5 className="text-3xl mb-2">Heading 3XL</h5>
                            <p className="text-sm text-gray-600">text-3xl</p>
                        </div>
                        <div>
                            <h6 className="text-2xl mb-2">Heading 2XL</h6>
                            <p className="text-sm text-gray-600">text-2xl</p>
                        </div>
                        <div>
                            <p className="text-xl mb-2">Text XL</p>
                            <p className="text-sm text-gray-600">text-xl</p>
                        </div>
                        <div>
                            <p className="text-base mb-2">Text Base (Body)</p>
                            <p className="text-sm text-gray-600">text-base</p>
                        </div>
                        <div>
                            <p className="text-sm mb-2">Text Small</p>
                            <p className="text-sm text-gray-600">text-sm</p>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            SHADOWS & GLOWS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Shadows & Glows</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-card border border-light-200">
                            <h3 className="font-semibold mb-2">Card Shadow</h3>
                            <p className="text-sm text-gray-600">shadow-card</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-card-hover border border-light-200">
                            <h3 className="font-semibold mb-2">Card Hover</h3>
                            <p className="text-sm text-gray-600">shadow-card-hover</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-glow-primary border border-light-200">
                            <h3 className="font-semibold mb-2">Glow Primary</h3>
                            <p className="text-sm text-gray-600">shadow-glow-primary</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-glow-secondary border border-light-200">
                            <h3 className="font-semibold mb-2">Glow Secondary</h3>
                            <p className="text-sm text-gray-600">shadow-glow-secondary</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-glow-primary-lg border border-light-200">
                            <h3 className="font-semibold mb-2">Glow Large</h3>
                            <p className="text-sm text-gray-600">shadow-glow-primary-lg</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-inner-glow border border-light-200">
                            <h3 className="font-semibold mb-2">Inner Glow</h3>
                            <p className="text-sm text-gray-600">shadow-inner-glow</p>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            ANIMATIONS
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Animations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card animate-fade-in">
                            <h3 className="font-semibold mb-2">Fade In</h3>
                            <p className="text-sm text-gray-600">animate-fade-in</p>
                        </div>
                        <div className="card animate-fade-in-up">
                            <h3 className="font-semibold mb-2">Fade In Up</h3>
                            <p className="text-sm text-gray-600">animate-fade-in-up</p>
                        </div>
                        <div className="card animate-fade-in-down">
                            <h3 className="font-semibold mb-2">Fade In Down</h3>
                            <p className="text-sm text-gray-600">animate-fade-in-down</p>
                        </div>
                        <div className="card animate-slide-in-left">
                            <h3 className="font-semibold mb-2">Slide In Left</h3>
                            <p className="text-sm text-gray-600">animate-slide-in-left</p>
                        </div>
                        <div className="card animate-slide-in-right">
                            <h3 className="font-semibold mb-2">Slide In Right</h3>
                            <p className="text-sm text-gray-600">animate-slide-in-right</p>
                        </div>
                        <div className="card animate-scale-in">
                            <h3 className="font-semibold mb-2">Scale In</h3>
                            <p className="text-sm text-gray-600">animate-scale-in</p>
                        </div>
                        <div className="card shadow-glow-primary animate-pulse-glow">
                            <h3 className="font-semibold mb-2">Pulse Glow</h3>
                            <p className="text-sm text-gray-600">animate-pulse-glow</p>
                        </div>
                    </div>
                </section>

                <div className="divider my-16"></div>

                {/* ========================================
            UTILITIES
        ======================================== */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-gradient">Utilities</h2>

                    <div className="space-y-8">
                        {/* Glass Effect */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Glass Effect</h3>
                            <div className="relative h-48 bg-gradient-primary rounded-xl overflow-hidden p-6">
                                <div className="glass p-6 rounded-xl">
                                    <h4 className="font-semibold mb-2 text-gray-900">Glass Card</h4>
                                    <p className="text-sm text-gray-700">Glassmorphism effect with backdrop blur</p>
                                </div>
                            </div>
                        </div>

                        {/* Gradient Border */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Gradient Border</h3>
                            <div className="border-gradient bg-white p-6 rounded-xl">
                                <h4 className="font-semibold mb-2">Gradient Border</h4>
                                <p className="text-sm text-gray-600">Card with gradient border effect</p>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Links</h3>
                            <div className="space-y-2">
                                <p><a href="#" className="link">Primary Link</a></p>
                                <p><a href="#" className="link-muted">Muted Link</a></p>
                            </div>
                        </div>

                        {/* Dividers */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Dividers</h3>
                            <div>
                                <p className="mb-4">Content above</p>
                                <div className="divider"></div>
                                <p className="mt-4">Content below</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-8 text-gray-600">
                    <p>🎨 Codelab Design System v1.0 - Light Theme</p>
                </footer>
            </div>
        </div>
    );
}
