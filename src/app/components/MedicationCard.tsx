import { Card } from './ui/card';
import { Button } from './ui/button';
import { Pill, Clock, Pencil, Trash2, Check } from 'lucide-react';
import { Medication } from './MedicationForm';
import { motion } from 'motion/react';

interface MedicationCardProps {
  medication: Medication;
  onEdit: () => void;
  onDelete: () => void;
  onMarkTaken: () => void;
  isTakenToday: boolean;
}

const DAYS_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MedicationCard({ medication, onEdit, onDelete, onMarkTaken, isTakenToday }: MedicationCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysText = () => {
    const sortedDays = [...medication.days].sort((a, b) => a - b);
    
    // Check if all days are selected
    if (sortedDays.length === 7) {
      return 'Every day';
    }
    
    // Check if weekdays only (Mon-Fri)
    if (sortedDays.length === 5 && sortedDays.every(d => d >= 1 && d <= 5)) {
      return 'Weekdays';
    }
    
    // Check if weekends only
    if (sortedDays.length === 2 && sortedDays.includes(0) && sortedDays.includes(6)) {
      return 'Weekends';
    }
    
    return sortedDays.map(day => DAYS_LABELS[day]).join(', ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 transition-all ${isTakenToday ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' : 'bg-white'}`}>
        <div className="flex items-start gap-4">
          <motion.div 
            className="flex-shrink-0 mt-1"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isTakenToday 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-amber-400 to-orange-500'
            }`}>
              {isTakenToday ? (
                <Check className="size-6 text-white" />
              ) : (
                <Pill className="size-6 text-white" />
              )}
            </div>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium mb-2">{medication.name}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock className="size-4" />
              <span>{formatTime(medication.time)}</span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              {getDaysText()}
            </div>

            {!isTakenToday ? (
              <Button
                onClick={onMarkTaken}
                size="sm"
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
              >
                <Check className="size-4 mr-2" />
                Mark as Taken
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <Check className="size-4" />
                Taken today! Great job! 🎉
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}