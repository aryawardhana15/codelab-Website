import { Mission } from '@/types/gamification';

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'badge-primary'; // Orange
      case 'weekly':
        return 'badge-secondary'; // Yellow
      case 'achievement':
        return 'badge-info'; // Blue (or keep as accent)
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Harian';
      case 'weekly':
        return 'Mingguan';
      case 'achievement':
        return 'Pencapaian';
      default:
        return type;
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group ${mission.is_completed
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-light-200 hover:border-primary/50 hover:shadow-glow-primary'
        }`}
    >
      {/* Background decoration */}
      {!mission.is_completed && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 -mr-10 -mt-10 rounded-full blur-2xl pointer-events-none"></div>
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className={`badge ${getTypeColor(mission.type)}`}>
              {getTypeLabel(mission.type)}
            </span>
            {!!mission.is_completed && (
              <span className="badge badge-success">
                Selesai ✓
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{mission.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{mission.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {!mission.is_completed ? (
        <div className="mb-5 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-bold text-primary">
              {mission.current_progress} / {mission.requirement_count}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ease-out bg-gradient-primary relative ${mission.progress_percentage > 0 ? 'shadow-[0_0_10px_rgba(255,153,51,0.5)]' : ''
                }`}
              style={{ width: `${Math.min(mission.progress_percentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reward */}
      <div className="flex items-center justify-between relative z-10 pt-2 border-t border-gray-50 mt-auto">
        <div className="flex items-center space-x-2 bg-secondary/10 px-3 py-1.5 rounded-lg">
          <svg className="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-gray-900">+{mission.xp_reward} XP</span>
        </div>
        {mission.badge_reward && (
          <div className="flex items-center space-x-1 text-primary animate-bounce-slow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wide">Badge</span>
          </div>
        )}
      </div>

      {/* Reset Info */}
      {mission.reset_at && !mission.is_completed ? (
        <p className="text-xs text-light-400 mt-3 text-right italic">
          Reset: {new Date(mission.reset_at).toLocaleDateString('id-ID')}
        </p>
      ) : null}
    </div>
  );
}

