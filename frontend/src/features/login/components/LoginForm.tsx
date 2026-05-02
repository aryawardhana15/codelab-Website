'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn, Code } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { loginFormConfig } from '../data/loginData';

export default function LoginForm() {
    const {
        isLoading,
        showPassword,
        setShowPassword,
        register,
        handleSubmit,
        errors,
        onSubmit,
    } = useLogin();

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-light-50 p-8">
            <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/codelab-icon-transparent.png"
                                alt="Codelab Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Codelab
                        </span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {loginFormConfig.title}
                    </h2>
                    <p className="text-gray-600">
                        {loginFormConfig.registerLink.text}{' '}
                        <Link
                            href={loginFormConfig.registerLink.href}
                            className="text-primary font-semibold hover:text-primary-600 transition-colors"
                        >
                            {loginFormConfig.registerLink.linkText}
                        </Link>
                    </p>
                </div>

                {/* Login Card */}
                <div className="card">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
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
                                <p className="input-error-text">
                                    {errors.email.message}
                                </p>
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
                                    autoComplete="current-password"
                                    className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="input-error-text">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-light-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    {loginFormConfig.rememberMeText}
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="text-primary font-medium hover:text-primary-600 transition-colors"
                                >
                                    {loginFormConfig.forgotPasswordText}
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full btn-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {loginFormConfig.loadingText}
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    {loginFormConfig.submitButtonText}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    {/* <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-light-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">{loginFormConfig.socialLoginText}</span>
                        </div>
                    </div> */}

                    {/* Social Login */}
                    {/* <div className="space-y-3">
                        <button className="btn btn-outline-dark w-full">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loginFormConfig.googleButtonText}
                        </button>
                    </div> */}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    {loginFormConfig.termsText.prefix}{' '}
                    <a href="#" className="text-primary hover:text-primary-600">
                        {loginFormConfig.termsText.terms}
                    </a>{' '}
                    {loginFormConfig.termsText.and}{' '}
                    <a href="#" className="text-primary hover:text-primary-600">
                        {loginFormConfig.termsText.privacy}
                    </a>
                </p>
            </div>
        </div>
    );
}
