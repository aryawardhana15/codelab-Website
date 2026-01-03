'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { loginValidation } from '../data/loginData';

interface LoginInput {
  email: string;
  password: string;
}

interface UseLoginReturn {
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  register: (name: keyof LoginInput) => UseFormRegisterReturn<keyof LoginInput>;
  handleSubmit: ReturnType<typeof useForm<LoginInput>>['handleSubmit'];
  errors: ReturnType<typeof useForm<LoginInput>>['formState']['errors'];
  onSubmit: (data: LoginInput) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);

      if (response.data.success) {
        toast.success(response.data.message);

        // Save to context and localStorage
        login(response.data.data.user, response.data.data.token);

        // Redirect based on role
        const { role } = response.data.data.user;
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'mentor') {
          router.push('/mentor/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showPassword,
    setShowPassword,
    register: (name: keyof LoginInput) => register(name, loginValidation[name]),
    handleSubmit,
    errors,
    onSubmit,
  };
}
