import { Badge } from '@/types/gamification';
import { Award, Lock, CheckCircle } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border-2 transition-all duration-300 ${badge.earned
          ? 'bg-white border-primary-200 shadow-lg hover:shadow-xl hover:scale-[1.02]'
          : 'bg-gray-50 border-gray-200 opacity-70'
        }`}
    >
      {/* Earned indicator */}
      {badge.earned && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-md">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Lock Icon for locked badges */}
      {!badge.earned && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <Lock className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      )}

      {/* Badge Icon/Image */}
      <div className="flex justify-center mb-4">
        {badge.icon_url ? (
          <img
            src={badge.icon_url}
            alt={badge.badge_name}
            className={`w-16 h-16 ${!badge.earned && 'grayscale opacity-50'}`}
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${badge.earned
                ? 'bg-gradient-primary'
                : 'bg-gray-300'
              }`}
          >
            <Award
              className={`w-8 h-8 ${badge.earned ? 'text-white' : 'text-gray-500'}`}
            />
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className={`font-bold text-base mb-1 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
          {badge.badge_name}
        </h3>
        <p className={`text-xs mb-2 line-clamp-2 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
          {badge.description}
        </p>
        {badge.requirement && (
          <p className="text-xs text-gray-400 italic line-clamp-1">
            {badge.requirement}
          </p>
        )}
        {badge.earned && badge.earned_at && (
          <div className="mt-3 pt-3 border-t border-primary-100">
            <p className="text-xs text-success font-semibold flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Didapat: {formatDate(badge.earned_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
