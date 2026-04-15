import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

interface CalendarViewProps {
  medicationLogs: Array<{ medicationId: string; date: string }>;
  medications: Array<{ id: string; name: string; days?: number[]; createdAt?: string }>;
  currentTheme: string;
}

export function CalendarView({ medicationLogs, medications, currentTheme }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the earliest medication creation date
  const getEarliestMedicationDate = () => {
    if (medications.length === 0) return null;
    
    const dates = medications
      .map(med => med.createdAt)
      .filter((date): date is string => !!date)
      .map(date => new Date(date));
    
    if (dates.length === 0) return null;
    
    return new Date(Math.min(...dates.map(d => d.getTime())));
  };

  const earliestMedicationDate = getEarliestMedicationDate();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate > today;
  };

  const isBeforeAppStart = (day: number) => {
    if (!earliestMedicationDate) return true; // If no medications, all dates are before app start
    
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Set to start of day for fair comparison
    checkDate.setHours(0, 0, 0, 0);
    const startDate = new Date(earliestMedicationDate);
    startDate.setHours(0, 0, 0, 0);
    
    return checkDate < startDate;
  };

  const getDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getMedicationsTakenOnDate = (day: number) => {
    const dateString = getDateString(day);
    const logsForDate = medicationLogs.filter(log => log.date === dateString);
    return logsForDate.length;
  };

  const getTotalMedicationsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    return medications.filter(med => med.days?.includes(dayOfWeek)).length;
  };

  const getCompletionRate = (day: number) => {
    const taken = getMedicationsTakenOnDate(day);
    const total = getTotalMedicationsForDate(day);
    if (total === 0) return null;
    return (taken / total) * 100;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const completionRate = getCompletionRate(day);
    const isFuture = isFutureDate(day);
    const isCurrentDay = isToday(day);
    const isBeforeStart = isBeforeAppStart(day);
    
    days.push(
      <motion.div
        key={day}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: day * 0.01 }}
        className="aspect-square"
      >
        <div
          className={`w-full h-full rounded-xl flex flex-col items-center justify-center relative transition-all ${
            isCurrentDay
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg scale-110'
              : isFuture
              ? 'bg-gray-50 text-gray-300'
              : isBeforeStart
              ? 'bg-gray-50 text-gray-300'
              : completionRate === 100
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md'
              : completionRate && completionRate > 0
              ? 'bg-gradient-to-br from-yellow-300 to-amber-400 text-white shadow-sm'
              : completionRate === 0
              ? 'bg-red-100 text-red-600'
              : 'bg-white border border-gray-200'
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {!isFuture && completionRate !== null && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              {completionRate === 100 ? (
                <Check className="size-3" />
              ) : completionRate === 0 ? (
                <X className="size-3" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Calculate monthly stats
  const totalDaysWithMeds = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(day => !isFutureDate(day) && !isBeforeAppStart(day) && getTotalMedicationsForDate(day) > 0).length;
  
  const perfectDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(day => !isBeforeAppStart(day) && getCompletionRate(day) === 100).length;
  
  const missedDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(day => {
      if (isBeforeAppStart(day)) return false; // Don't count days before app start as missed
      const rate = getCompletionRate(day);
      return rate === 0;
    }).length;

  return (
    <div className="pb-20">
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="size-8 text-amber-600 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Progress Calendar
          </h1>
          <p className="text-gray-700">
            Track your medication journey day by day
          </p>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{perfectDays}</div>
          <div className="text-xs text-gray-600 mt-1">Perfect Days</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{totalDaysWithMeds - perfectDays - missedDays}</div>
          <div className="text-xs text-gray-600 mt-1">Partial Days</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">{missedDays}</div>
          <div className="text-xs text-gray-600 mt-1">Missed Days</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="h-10 w-10"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-10 w-10"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-medium mb-3">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
            <span>All meds taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-300 to-amber-400" />
            <span>Some meds taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100" />
            <span>None taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-orange-500" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}