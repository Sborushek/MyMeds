import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins } from 'lucide-react';

interface CelebrationAnimationProps {
  show: boolean;
  message: string;
  coinsEarned?: number;
}

export function CelebrationAnimation({ show, message, coinsEarned = 1 }: CelebrationAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -20 }}
            transition={{ 
              duration: 0.6,
              repeat: 2,
              repeatType: "reverse"
            }}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Sparkles className="size-12" />
            </motion.div>
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{message}</p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Coins className="size-5" />
                <span>+{coinsEarned} coin{coinsEarned !== 1 ? 's' : ''}!</span>
              </div>
            </div>
          </motion.div>

          {/* Floating coins */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 1 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 300,
                y: -200 + Math.random() * -100,
                opacity: 0,
                scale: 0.5,
              }}
              transition={{ 
                duration: 1 + Math.random() * 0.5,
                delay: i * 0.1 
              }}
              className="absolute"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                ¢
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
