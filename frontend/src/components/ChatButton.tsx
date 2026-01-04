'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { MessageCircle, Loader2 } from 'lucide-react';

interface ChatButtonProps {
  courseId: number;
  courseName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ChatButton({ courseId, courseName, size = 'md', className = '' }: ChatButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChatClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      // Check if chat already exists
      const checkResponse = await api.get(`/chats/course/${courseId}`);

      if (checkResponse.data.data) {
        // Chat exists, navigate to it
        router.push(`/chat/${checkResponse.data.data.id}?course=${encodeURIComponent(courseName)}`);
      } else {
        // Create new chat
        const createResponse = await api.post('/chats', { course_id: courseId });

        if (createResponse.data.success) {
          router.push(`/chat/${createResponse.data.data.id}?course=${encodeURIComponent(courseName)}`);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuka chat');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'btn-sm text-xs',
    md: 'text-sm',
    lg: 'btn-lg text-base'
  };

  return (
    <button
      type="button"
      onClick={handleChatClick}
      disabled={isLoading}
      className={`btn btn-success text-white hover:brightness-110 border-none shadow-md hover:shadow-lg transition-all duration-300 ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat Mentor
        </>
      )}
    </button>
  );
}
