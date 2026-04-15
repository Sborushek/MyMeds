import { Coins, Flame, Trophy, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface StatsDisplayProps {
  coins: number;
  streak: number;
  longestStreak: number;
  onOpenShop: () => void;
}

export function StatsDisplay({ coins, streak, longestStreak, onOpenShop }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Coins */}
      <motion.div
        className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Coins className="size-6" />
          <span className="text-sm opacity-90">Gold Coins</span>
        </div>
        <div className="text-3xl font-bold">{coins}</div>
        <Button
          onClick={onOpenShop}
          className="mt-3 w-full bg-white/20 hover:bg-white/30 border-0"
          size="sm"
        >
          <ShoppingBag className="size-4 mr-2" />
          Shop Rewards
        </Button>
      </motion.div>

      {/* Streak */}
      <motion.div
        className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 text-white shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Flame className="size-6" />
          <span className="text-sm opacity-90">Current Streak</span>
        </div>
        <div className="text-3xl font-bold">{streak} days</div>
        <div className="mt-3 flex items-center gap-2 text-sm opacity-90">
          <Trophy className="size-4" />
          <span>Best: {longestStreak} days</span>
        </div>
      </motion.div>
    </div>
  );
}
