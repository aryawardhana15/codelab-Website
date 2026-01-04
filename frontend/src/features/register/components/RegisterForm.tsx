'use client';

import Link from 'next/link';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    Code,
    User,
    Users,
    CheckCircle,
    ChevronDown,
    FileText,
    Briefcase,
    Award
} from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { registerFormConfig, roleOptions, mentorFieldsConfig } from '../data/registerData';

export default function RegisterForm() {
    const {
        isLoading,
        role,
        setRole,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        showMentorFields,
        setShowMentorFields,
        register,
        handleSubmit,
        errors,
        onSubmit,
    } = useRegister();

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-light-50 p-8 overflow-y-auto">
            <div className="w-full max-w-lg py-8">
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <Code className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Codelab</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {registerFormConfig.title}
                    </h2>
                    <p className="text-gray-600">
                        {registerFormConfig.loginLink.text}{' '}
                        <Link href={registerFormConfig.loginLink.href} className="text-primary font-semibold hover:text-primary-600 transition-colors">
                            {registerFormConfig.loginLink.linkText}
                        </Link>
                    </p>
                </div>

                {/* Register Card */}
                <div className="card">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Role Selection - Dropdown */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Tipe Akun
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'pelajar' | 'mentor')}
                                className="select"
                            >
                                {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Nama Lengkap
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                autoComplete="name"
                                className={`input ${errors.name ? 'input-error' : ''}`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="input-error-text">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                Email
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className={`input ${errors.email ? 'input-error' : ''}`}
                                placeholder="nama@email.com"
                            />
                            {errors.email && (
                                <p className="input-error-text">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="input-error-text">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`input pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="input-error-text">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Mentor Fields - Collapsible */}
                        {role === 'mentor' && (
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                <button
                                    type="button"
                                    onClick={() => setShowMentorFields(!showMentorFields)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-gray-900">{mentorFieldsConfig.title}</span>
                                        <span className="text-xs text-gray-500">{mentorFieldsConfig.optional}</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showMentorFields ? 'rotate-180' : ''}`} />
                                </button>

                                {showMentorFields && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="input-label flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                {mentorFieldsConfig.fields.cv_url.label}
                                            </label>
                                            <input
                                                {...register('cv_url')}
                                                type="url"
                                                className="input"
                                                placeholder={mentorFieldsConfig.fields.cv_url.placeholder}
                                            />
                                            <p className="input-helper">{mentorFieldsConfig.fields.cv_url.helper}</p>
                                        </div>

                                        <div>
                                            <label className="input-label flex items-center gap-2">
                                                <Code className="w-4 h-4 text-primary" />
                                                {mentorFieldsConfig.fields.expertise.label}
                                            </label>
                                            <input
                                                {...register('expertise')}
                                                type="text"
                                                className="input"
                                                placeholder={mentorFieldsConfig.fields.expertise.placeholder}
                                            />
                                            <p className="input-helper">{mentorFieldsConfig.fields.expertise.helper}</p>
                                        </div>

                                        <div>
                                            <label className="input-label flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-primary" />
                                                {mentorFieldsConfig.fields.experience.label}
                                            </label>
                                            <textarea
                                                {...register('experience')}
                                                rows={3}
                                                className="input min-h-[80px]"
                                                placeholder={mentorFieldsConfig.fields.experience.placeholder}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full btn-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {registerFormConfig.loadingText}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    {registerFormConfig.submitButtonText}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-light-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">{registerFormConfig.socialLoginText}</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button className="btn btn-outline-dark w-full">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {registerFormConfig.googleButtonText}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    {registerFormConfig.termsText.prefix}{' '}
                    <a href="#" className="text-primary hover:text-primary-600">{registerFormConfig.termsText.terms}</a>
                    {' '}{registerFormConfig.termsText.and}{' '}
                    <a href="#" className="text-primary hover:text-primary-600">{registerFormConfig.termsText.privacy}</a>
                </p>
            </div>
        </div>
    );
}
