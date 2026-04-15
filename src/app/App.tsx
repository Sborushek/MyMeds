import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router';
import { Medication } from './components/MedicationForm';
import { Theme } from './components/RewardsShop';
import { CelebrationAnimation } from './components/CelebrationAnimation';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './pages/HomeView';
import { CalendarView } from './pages/CalendarView';
import { AchievementsView } from './pages/AchievementsView';
import { ShopView } from './pages/ShopView';

interface MedicationLog {
  medicationId: string;
  date: string; // YYYY-MM-DD format
}

interface GameState {
  coins: number;
  streak: number;
  longestStreak: number;
  lastTakenDate: string | null; // YYYY-MM-DD format
  currentTheme: string;
  unlockedThemes: string[];
}

const DEFAULT_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Sunny Warmth',
    cost: 0,
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    preview: 'from-amber-100 to-orange-100',
    unlocked: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    cost: 10,
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    preview: 'from-blue-100 to-cyan-100',
    unlocked: false,
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    cost: 15,
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    preview: 'from-purple-100 to-pink-100',
    unlocked: false,
  },
  {
    id: 'forest',
    name: 'Forest Calm',
    cost: 20,
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    preview: 'from-green-100 to-emerald-100',
    unlocked: false,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    cost: 25,
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    preview: 'from-rose-100 to-orange-100',
    unlocked: false,
  },
  {
    id: 'mint',
    name: 'Mint Fresh',
    cost: 30,
    gradient: 'bg-gradient-to-br from-teal-100 to-green-100',
    preview: 'from-teal-100 to-green-100',
    unlocked: false,
  },
];

function AppContent() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    streak: 0,
    longestStreak: 0,
    lastTakenDate: null,
    currentTheme: 'default',
    unlockedThemes: ['default'],
  });
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const storedMeds = localStorage.getItem('medications');
    const storedLogs = localStorage.getItem('medicationLogs');
    const storedGameState = localStorage.getItem('gameState');

    if (storedMeds) {
      try {
        const loadedMeds = JSON.parse(storedMeds);
        // Migrate old medications to have createdAt field
        const migratedMeds = loadedMeds.map((med: Medication) => ({
          ...med,
          createdAt: med.createdAt || new Date().toISOString()
        }));
        setMedications(migratedMeds);
      } catch (error) {
        console.error('Error loading medications:', error);
      }
    }

    if (storedLogs) {
      try {
        setMedicationLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    }

    if (storedGameState) {
      try {
        const loadedGameState = JSON.parse(storedGameState);
        setGameState(loadedGameState);
        
        // Update themes with unlocked status
        setThemes(prev => prev.map(theme => ({
          ...theme,
          unlocked: loadedGameState.unlockedThemes.includes(theme.id)
        })));
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medicationLogs', JSON.stringify(medicationLogs));
  }, [medicationLogs]);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Check for medication reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      medications.forEach((medication) => {
        if (
          medication.days.includes(currentDay) &&
          medication.time === currentTime &&
          notificationsEnabled
        ) {
          showNotification(medication);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [medications, notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const showNotification = (medication: Medication) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💊 Medication Reminder', {
        body: `Time to take your ${medication.name}! Earn coins by logging it.`,
        icon: '💊',
        tag: medication.id,
      });
    }
  };

  const isMedicationTakenToday = (medicationId: string): boolean => {
    const today = getTodayString();
    return medicationLogs.some(
      log => log.medicationId === medicationId && log.date === today
    );
  };

  const handleMarkAsTaken = (medicationId: string) => {
    const today = getTodayString();
    
    // Don't allow marking twice
    if (isMedicationTakenToday(medicationId)) {
      return;
    }

    // Add log
    setMedicationLogs(prev => [...prev, { medicationId, date: today }]);

    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (gameState.lastTakenDate === yesterdayString) {
      newStreak = gameState.streak + 1;
    } else if (gameState.lastTakenDate === today) {
      newStreak = gameState.streak;
    }

    // Calculate coin bonus based on streak
    const baseCoins = 1;
    const streakBonus = Math.floor(newStreak / 7); // Extra coin every 7 days
    const coinsEarned = baseCoins + streakBonus;

    // Update game state
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      streak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastTakenDate: today,
    }));

    // Show celebration
    const messages = [
      'Great job!',
      'Keep it up!',
      "You're doing amazing!",
      'Well done!',
      'Fantastic!',
      "You're a star!",
    ];
    setCelebrationMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handlePurchaseTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme || theme.unlocked || gameState.coins < theme.cost) {
      return;
    }

    // Deduct coins and unlock theme
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - theme.cost,
      unlockedThemes: [...prev.unlockedThemes, themeId],
      currentTheme: themeId,
    }));

    setThemes(prev => prev.map(t => 
      t.id === themeId ? { ...t, unlocked: true } : t
    ));
  };

  const handleSelectTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme || !theme.unlocked) {
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentTheme: themeId,
    }));
  };

  const handleSaveMedication = (medication: Medication) => {
    const existing = medications.find(m => m.id === medication.id);
    if (existing) {
      setMedications(prev =>
        prev.map(med => med.id === medication.id ? medication : med)
      );
    } else {
      setMedications(prev => [...prev, medication]);
    }
  };

  const handleEditMedication = (medication: Medication) => {
    // This is just for tracking in the parent
  };

  const handleDeleteMedication = (id: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== id));
      // Also remove logs for this medication
      setMedicationLogs(prev => prev.filter(log => log.medicationId !== id));
    }
  };

  const currentThemeGradient = themes.find(t => t.id === gameState.currentTheme)?.gradient || 'bg-gradient-to-br from-amber-100 to-orange-100';

  const totalMedicationsTaken = medicationLogs.length;

  return (
    <div className={`min-h-screen ${currentThemeGradient} transition-all duration-500`}>
      <div className="max-w-3xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                medications={medications}
                medicationLogs={medicationLogs}
                coins={gameState.coins}
                streak={gameState.streak}
                longestStreak={gameState.longestStreak}
                notificationsEnabled={notificationsEnabled}
                onRequestNotifications={requestNotificationPermission}
                onSaveMedication={handleSaveMedication}
                onEditMedication={handleEditMedication}
                onDeleteMedication={handleDeleteMedication}
                onMarkAsTaken={handleMarkAsTaken}
                isMedicationTakenToday={isMedicationTakenToday}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <CalendarView
                medicationLogs={medicationLogs}
                medications={medications}
                currentTheme={gameState.currentTheme}
              />
            }
          />
          <Route
            path="/achievements"
            element={
              <AchievementsView
                streak={gameState.streak}
                longestStreak={gameState.longestStreak}
                totalMedicationsTaken={totalMedicationsTaken}
                coins={gameState.coins}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopView
                coins={gameState.coins}
                themes={themes}
                currentTheme={gameState.currentTheme}
                onPurchase={handlePurchaseTheme}
                onSelectTheme={handleSelectTheme}
              />
            }
          />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Celebration Animation */}
      <CelebrationAnimation
        show={showCelebration}
        message={celebrationMessage}
        coinsEarned={1 + Math.floor(gameState.streak / 7)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}