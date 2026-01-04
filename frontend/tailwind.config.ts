import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ========================================
      // CODELAB DESIGN SYSTEM - COLOR PALETTE
      // ========================================
      colors: {
        // Primary Colors - Orange
        primary: {
          DEFAULT: '#FF9933',
          50: '#FFF5EB',
          100: '#FFE5CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9933',  // Main
          500: '#FFA500',
          600: '#FF8C00',
          700: '#E67E22',
          800: '#CC6600',
          900: '#994D00',
        },
        // Secondary Colors - Yellow
        secondary: {
          DEFAULT: '#FFD700',
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF176',
          300: '#FFEB3B',
          400: '#FFE082',
          500: '#FFD700',  // Main
          600: '#FFC107',
          700: '#F4B400',
          800: '#E6A800',
          900: '#CC9500',
        },
        // Neutral Colors - Light Theme
        light: {
          DEFAULT: '#FFFFFF',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Accent Colors
        accent: {
          navy: '#1E3A8A',
          orange: {
            light: '#FFB84D',
            DEFAULT: '#FF9933',
            dark: '#E67E22',
          },
          yellow: {
            light: '#FFE082',
            DEFAULT: '#F4B400',
            gold: '#FFD700',
          },
        },
        // Semantic Colors
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
      },
      // ========================================
      // GRADIENTS (via backgroundImage)
      // ========================================
      backgroundImage: {
        // Primary Gradients
        'gradient-primary': 'linear-gradient(180deg, #FF9933 0%, #FFD700 100%)',
        'gradient-primary-hover': 'linear-gradient(180deg, #FF8C00 0%, #FFC107 100%)',
        'gradient-primary-horizontal': 'linear-gradient(90deg, #FF9933 0%, #FFD700 100%)',
        
        // Orange Gradients
        'gradient-orange': 'linear-gradient(180deg, #E67E22 0%, #FFB84D 100%)',
        'gradient-orange-reverse': 'linear-gradient(180deg, #FFB84D 0%, #E67E22 100%)',
        
        // Yellow/Gold Gradients
        'gradient-gold': 'linear-gradient(180deg, #F4B400 0%, #FFE082 100%)',
        'gradient-gold-reverse': 'linear-gradient(180deg, #FFE082 0%, #F4B400 100%)',
        
        // Light Gradients
        'gradient-light': 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
        'gradient-light-gray': 'linear-gradient(180deg, #E5E7EB 0%, #F9FAFB 100%)',
        
        // Radial Gradients
        'gradient-radial-primary': 'radial-gradient(circle, #FF9933 0%, #FFD700 100%)',
        'gradient-radial-light': 'radial-gradient(circle, #F9FAFB 0%, #FFFFFF 100%)',
        
        // Diagonal Gradients
        'gradient-diagonal': 'linear-gradient(135deg, #FF9933 0%, #FFD700 100%)',
        'gradient-diagonal-light': 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
      },
      // ========================================
      // TYPOGRAPHY
      // ========================================
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      // ========================================
      // SPACING & SIZING
      // ========================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // ========================================
      // BORDERS & RADIUS
      // ========================================
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // ========================================
      // SHADOWS
      // ========================================
      boxShadow: {
        'glow-primary': '0 0 20px rgba(255, 153, 51, 0.3)',
        'glow-secondary': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-primary-lg': '0 0 40px rgba(255, 153, 51, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 153, 51, 0.1)',
      },
      // ========================================
      // ANIMATIONS
      // ========================================
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 153, 51, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 153, 51, 0.5)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      // ========================================
      // TRANSITIONS
      // ========================================
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config

