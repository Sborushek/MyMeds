import { Sparkles, Lock, Check, Coins as CoinsIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Theme } from '../components/RewardsShop';
import { motion } from 'motion/react';

interface ShopViewProps {
  coins: number;
  themes: Theme[];
  currentTheme: string;
  onPurchase: (themeId: string) => void;
  onSelectTheme: (themeId: string) => void;
}

export function ShopView({ coins, themes, currentTheme, onPurchase, onSelectTheme }: ShopViewProps) {
  return (
    <div className="pb-20">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="size-8 text-amber-600 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Rewards Shop
          </h1>
          <p className="text-gray-700">
            Unlock beautiful themes with your coins!
          </p>
        </div>
      </div>

      {/* Coin Balance */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 mb-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Balance</p>
            <div className="flex items-center gap-2">
              <CoinsIcon className="size-8" />
              <span className="text-4xl font-bold">{coins}</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="space-y-4">
        <h2 className="font-medium text-gray-700">Available Themes</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border-2 p-5 transition-all ${
                currentTheme === theme.id
                  ? 'border-amber-500 bg-amber-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-24 h-24 rounded-xl ${theme.gradient} shadow-inner flex-shrink-0`}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{theme.name}</h3>
                  
                  {theme.unlocked ? (
                    <div>
                      {currentTheme === theme.id ? (
                        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                          <Check className="size-4" />
                          <span>Currently Active</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => onSelectTheme(theme.id)}
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                        >
                          Use This Theme
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <Lock className="size-4" />
                        <span className="text-sm font-medium">{theme.cost} coins</span>
                      </div>
                      <Button
                        onClick={() => onPurchase(theme.id)}
                        disabled={coins < theme.cost}
                        size="sm"
                        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                      >
                        {coins < theme.cost ? `Need ${theme.cost - coins} more coins` : 'Unlock Now'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
        <p className="text-sm text-blue-900">
          💡 <strong>Pro tip:</strong> Keep taking your medications daily to earn more coins. 
          You earn bonus coins for longer streaks!
        </p>
      </div>
    </div>
  );
}