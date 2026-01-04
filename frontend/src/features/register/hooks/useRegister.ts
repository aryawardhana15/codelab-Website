'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, UseFormRegister } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterInput } from '@/types/auth';
import { registerValidation } from '../data/registerData';

interface UseRegisterReturn {
  isLoading: boolean;
  role: 'pelajar' | 'mentor';
  setRole: (role: 'pelajar' | 'mentor') => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  showMentorFields: boolean;
  setShowMentorFields: (show: boolean) => void;
  register: ReturnType<typeof useForm<RegisterInput>>['register'];
  handleSubmit: ReturnType<typeof useForm<RegisterInput>>['handleSubmit'];
  errors: ReturnType<typeof useForm<RegisterInput>>['formState']['errors'];
  password: string;
  onSubmit: (data: RegisterInput) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'pelajar' | 'mentor'>('pelajar');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMentorFields, setShowMentorFields] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>();
  const password = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    // Validate password match
    if (data.password !== data.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        cv_url: data.cv_url,
        expertise: data.expertise,
        experience: data.experience,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // Save to context
        login(response.data.data.user, response.data.data.token);

        // Redirect based on role
        if (role === 'mentor' && !response.data.data.user.is_verified) {
          router.push('/waiting-verification');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registrasi gagal');
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithValidation = (name: keyof RegisterInput, options?: any) => {
    const baseValidation = registerValidation[name as keyof typeof registerValidation] || {};
    
    if (name === 'confirmPassword') {
      return register(name, {
        ...baseValidation,
        validate: (value: string) => value === password || 'Password tidak cocok',
      });
    }
    
    return register(name, { ...baseValidation, ...options });
  };

  return {
    isLoading,
    role,
    setRole,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showMentorFields,
    setShowMentorFields,
    register: registerWithValidation as UseFormRegister<RegisterInput>,
    handleSubmit,
    errors,
    password,
    onSubmit,
  };
}
