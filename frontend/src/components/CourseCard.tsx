'use client';

import { Course } from '@/types/course';
import { useRouter } from 'next/navigation';
import { Play, Info, UserPlus, Sparkles } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  showActions?: boolean;
}

export default function CourseCard({ course, onEnroll, showActions = true }: CourseCardProps) {
  const router = useRouter();

  const difficultyText = {
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Mahir'
  };

  const difficultyStyles = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-secondary-50 text-yellow-700 border-secondary-200',
    advanced: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-glow-primary transform hover:-translate-y-1 transition-all duration-500 ease-out border border-gray-100 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-gray-100 shrink-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center group-hover:from-primary-100 group-hover:via-white group-hover:to-secondary-100 transition-colors duration-500">
            <span className="text-6xl opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500">📚</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20 flex items-center gap-2 ${course.price > 0
              ? 'bg-white/95 text-primary-700'
              : 'bg-gradient-to-r from-primary to-secondary text-white'
            }`}>
            {course.price === 0 && <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />}
            <span className="text-sm font-extrabold tracking-wide">
              {course.price > 0 ? `Rp ${Number(course.price).toLocaleString('id-ID')}` : 'GRATIS'}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-4 left-4 z-10">
            <div className="backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-2xl border border-white/10 hover:bg-primary/90 transition-colors duration-300">
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                {course.category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col flex-1">
        {/* Level & Education Badges */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${difficultyStyles[course.difficulty]}`}>
            <div className={`w-2 h-2 rounded-full ${course.difficulty === 'beginner' ? 'bg-emerald-500' :
                course.difficulty === 'intermediate' ? 'bg-secondary-500' :
                  'bg-red-500'
              }`}></div>
            {difficultyText[course.difficulty]}
          </div>

          {course.education_level && (
            <span className="text-[11px] text-primary-700 font-bold bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 uppercase tracking-wider">
              {course.education_level}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer flex-grow"
          onClick={() => router.push(`/courses/${course.id}`)}
        >
          {course.title}
        </h3>

        {/* Mentor Info */}
        <div className="flex items-center gap-3 mb-6 pt-4 border-t border-gray-50 mt-auto">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-primary">
            <div className="w-full h-full rounded-full bg-white overflow-hidden p-[2px]">
              {course.mentor_photo ? (
                <img src={course.mentor_photo} alt={course.mentor_name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary rounded-full">
                  {course.mentor_name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Mentor</span>
            <span className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{course.mentor_name || 'Unknown'}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/courses/${course.id}`)}
              className="flex-1 group/btn relative overflow-hidden rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm py-3.5 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 active:scale-95"
            >
              <div className="flex items-center justify-center gap-2.5 relative z-10">
                <Info className="w-4.5 h-4.5 text-gray-400 group-hover/btn:text-gray-900 transition-colors" />
                Detail
              </div>
            </button>

            {course.isEnrolled ? (
              <button
                onClick={() => router.push(`/courses/${course.id}/learn`)}
                className="flex-1 group/btn relative overflow-hidden rounded-2xl bg-gradient-primary text-white font-bold text-sm py-3.5 shadow-lg hover:shadow-glow-secondary transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <div className="flex items-center justify-center gap-2.5 relative z-10">
                  <Play className="w-4.5 h-4.5 fill-current" />
                  Lanjut
                </div>
              </button>
            ) : (
              onEnroll && (
                <button
                  onClick={() => onEnroll(course.id)}
                  className="flex-1 group/btn relative overflow-hidden rounded-2xl bg-gray-900 text-white font-bold text-sm py-3.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <div className="flex items-center justify-center gap-2.5 relative z-10">
                    <UserPlus className="w-4.5 h-4.5" />
                    Gabung
                  </div>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
