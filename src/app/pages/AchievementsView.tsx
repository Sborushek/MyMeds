import { Trophy, Award, Star, Zap, Target, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  progress: number;
  unlocked: boolean;
  reward: number;
}

interface AchievementsViewProps {
  streak: number;
  longestStreak: number;
  totalMedicationsTaken: number;
  coins: number;
}

export function AchievementsView({ 
  streak, 
  longestStreak, 
  totalMedicationsTaken,
  coins 
}: AchievementsViewProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Take your first medication',
      icon: Star,
      requirement: 1,
      progress: totalMedicationsTaken,
      unlocked: totalMedicationsTaken >= 1,
      reward: 5,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Zap,
      requirement: 7,
      progress: longestStreak,
      unlocked: longestStreak >= 7,
      reward: 10,
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Maintain a 30-day streak',
      icon: Target,
      requirement: 30,
      progress: longestStreak,
      unlocked: longestStreak >= 30,
      reward: 25,
    },
    {
      id: 'champion',
      title: 'Champion',
      description: 'Maintain a 100-day streak',
      icon: Crown,
      requirement: 100,
      progress: longestStreak,
      unlocked: longestStreak >= 100,
      reward: 50,
    },
    {
      id: 'century',
      title: 'Century Club',
      description: 'Take 100 medications total',
      icon: Award,
      requirement: 100,
      progress: totalMedicationsTaken,
      unlocked: totalMedicationsTaken >= 100,
      reward: 20,
    },
    {
      id: 'coin-collector',
      title: 'Coin Collector',
      description: 'Collect 50 coins',
      icon: Trophy,
      requirement: 50,
      progress: coins,
      unlocked: coins >= 50,
      reward: 10,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="pb-20">
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="size-8 text-amber-600 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-gray-700">
            Unlock rewards for your dedication
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{unlockedCount} / {totalCount}</h2>
            <p className="text-sm text-gray-600">Achievements Unlocked</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy className="size-8 text-white" />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const progressPercent = Math.min((achievement.progress / achievement.requirement) * 100, 100);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-5 shadow-lg transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                  : 'bg-white/80 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                    achievement.unlocked
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-amber-100 to-orange-100'
                  }`}
                >
                  <Icon
                    className={`size-7 ${
                      achievement.unlocked ? 'text-white' : 'text-amber-600'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs whitespace-nowrap">
                        <Star className="size-3" />
                        +{achievement.reward}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">
                          {achievement.progress} / {achievement.requirement}
                        </span>
                        <span className="font-medium text-amber-600">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Award className="size-4" />
                      <span>Unlocked!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <div className="mt-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-blue-900">
          💪 <strong>Keep going!</strong> Each medication you take brings you closer to your next achievement.
        </p>
      </div>
    </div>
  );
}