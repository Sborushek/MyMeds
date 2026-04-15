import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { X } from 'lucide-react';

export interface Medication {
  id: string;
  name: string;
  time: string;
  days: number[]; // 0-6 (Sunday-Saturday)
  createdAt: string; // ISO date string when medication was added
}

interface MedicationFormProps {
  onSave: (medication: Medication) => void;
  onCancel: () => void;
  editingMedication?: Medication;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export function MedicationForm({ onSave, onCancel, editingMedication }: MedicationFormProps) {
  const [name, setName] = useState(editingMedication?.name || '');
  const [time, setTime] = useState(editingMedication?.time || '09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>(editingMedication?.days || []);

  useEffect(() => {
    if (editingMedication) {
      setName(editingMedication.name);
      setTime(editingMedication.time);
      setSelectedDays(editingMedication.days);
    }
  }, [editingMedication]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedDays.length === 0) {
      alert('Please enter a medication name and select at least one day');
      return;
    }

    onSave({
      id: editingMedication?.id || Date.now().toString(),
      name: name.trim(),
      time,
      days: selectedDays,
      createdAt: editingMedication?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          {editingMedication ? 'Edit Medication' : 'Add Medication'}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medication-name">Medication Name</Label>
        <Input
          id="medication-name"
          type="text"
          placeholder="e.g., Aspirin"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medication-time">Time</Label>
        <Input
          id="medication-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Days of the Week</Label>
        <div className="flex gap-2 flex-wrap">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day.value}
              className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 cursor-pointer transition-all ${
                selectedDays.includes(day.value)
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-orange-500 shadow-md'
                  : 'bg-white border-gray-300 hover:border-orange-300 hover:shadow-sm'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedDays.includes(day.value)}
                onChange={() => toggleDay(day.value)}
              />
              <span className="text-sm font-medium">{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white">
          {editingMedication ? 'Update' : 'Add'} Medication
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}