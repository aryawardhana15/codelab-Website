'use client';

import { Zap, Star } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  currentLevel: number;
  levelName: string;
  levelProgress: number;
  nextLevelXP: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function XPBar({
  currentXP,
  currentLevel,
  levelName,
  levelProgress,
  nextLevelXP,
  size = 'md'
}: XPBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
              <Star className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
            </div>
            <span className={`font-bold text-white ${textSizeClasses[size]}`}>
              Level {currentLevel}
            </span>
          </div>
          <span className={`text-white/80 ${textSizeClasses[size]}`}>
            {levelName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <Zap className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
          <span className={`text-white font-semibold ${textSizeClasses[size]}`}>
            {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </span>
        </div>
      </div>
      <div className={`w-full bg-white/20 rounded-full ${sizeClasses[size]} overflow-hidden backdrop-blur-sm`}>
        <div
          className={`bg-white ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${Math.min(levelProgress, 100)}%` }}
        >
          {size === 'lg' && levelProgress > 10 && (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary drop-shadow-md">
                {levelProgress}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
