import { useState } from 'react';
import { Button } from './ui/button';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Theme {
  id: string;
  name: string;
  cost: number;
  gradient: string;
  preview: string;
  unlocked: boolean;
}

interface RewardsShopProps {
  onClose: () => void;
  coins: number;
  themes: Theme[];
  currentTheme: string;
  onPurchase: (themeId: string) => void;
  onSelectTheme: (themeId: string) => void;
}

export function RewardsShop({
  onClose,
  coins,
  themes,
  currentTheme,
  onPurchase,
  onSelectTheme,
}: RewardsShopProps) {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="size-6 text-amber-500" />
              Rewards Shop
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Unlock beautiful themes with your coins!
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
              {coins}
            </div>
            <div>
              <p className="font-medium">Your Balance</p>
              <p className="text-sm text-gray-600">Gold Coins Available</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                currentTheme === theme.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setSelectedPreview(theme.id)}
              onMouseLeave={() => setSelectedPreview(null)}
            >
              <div
                className={`h-24 rounded-lg mb-3 ${theme.gradient} shadow-inner`}
              />
              <h3 className="font-medium mb-1">{theme.name}</h3>
              
              {theme.unlocked ? (
                <div>
                  {currentTheme === theme.id ? (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <Check className="size-4" />
                      <span>Currently Active</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => onSelectTheme(theme.id)}
                      size="sm"
                      className="w-full mt-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
                    >
                      Use Theme
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="size-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{theme.cost} coins</span>
                  </div>
                  <Button
                    onClick={() => onPurchase(theme.id)}
                    disabled={coins < theme.cost}
                    size="sm"
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {coins < theme.cost ? 'Not Enough Coins' : 'Unlock'}
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-900">
            💡 <strong>Pro tip:</strong> Keep taking your medications daily to earn more coins and maintain your streak!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
