import { useState } from 'react';
import { Plus, Bell, BellOff, Sparkles, Pill } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MedicationForm, Medication } from '../components/MedicationForm';
import { MedicationCard } from '../components/MedicationCard';
import { StatsDisplay } from '../components/StatsDisplay';
import { useNavigate } from 'react-router';

interface HomeViewProps {
  medications: Medication[];
  medicationLogs: Array<{ medicationId: string; date: string }>;
  coins: number;
  streak: number;
  longestStreak: number;
  notificationsEnabled: boolean;
  onRequestNotifications: () => void;
  onSaveMedication: (medication: Medication) => void;
  onEditMedication: (medication: Medication) => void;
  onDeleteMedication: (id: string) => void;
  onMarkAsTaken: (id: string) => void;
  isMedicationTakenToday: (id: string) => boolean;
}

export function HomeView({
  medications,
  medicationLogs,
  coins,
  streak,
  longestStreak,
  notificationsEnabled,
  onRequestNotifications,
  onSaveMedication,
  onEditMedication,
  onDeleteMedication,
  onMarkAsTaken,
  isMedicationTakenToday,
}: HomeViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();
  const navigate = useNavigate();

  const handleSave = (medication: Medication) => {
    onSaveMedication(medication);
    setShowForm(false);
    setEditingMedication(undefined);
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setShowForm(true);
    onEditMedication(medication);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMedication(undefined);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          MyMeds
        </h1>
        <p className="text-gray-700">
          Take your meds, earn rewards, feel amazing! ✨
        </p>
      </div>

      {/* Stats Display */}
      <StatsDisplay
        coins={coins}
        streak={streak}
        longestStreak={longestStreak}
        onOpenShop={() => navigate('/shop')}
      />

      {/* Notification toggle */}
      <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {notificationsEnabled ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Bell className="size-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <BellOff className="size-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium">
              {notificationsEnabled ? 'Reminders Active' : 'Enable Reminders'}
            </p>
            <p className="text-sm text-gray-600">
              {notificationsEnabled
                ? "We'll remind you when it's time!"
                : 'Get gentle reminders for your meds'}
            </p>
          </div>
        </div>
        {!notificationsEnabled && (
          <Button 
            onClick={onRequestNotifications}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
          >
            Enable
          </Button>
        )}
      </div>

      {/* Form or Add Button */}
      {showForm ? (
        <div className="mb-6 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
          <MedicationForm
            onSave={handleSave}
            onCancel={handleCancel}
            editingMedication={editingMedication}
          />
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          className="mb-6 w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg text-white h-14 text-lg rounded-2xl"
        >
          <Plus className="size-5 mr-2" />
          Add New Medication
        </Button>
      )}

      {/* Medications List */}
      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="size-10 text-white" />
            </div>
            <p className="text-xl font-medium text-gray-700 mb-2">Ready to start your journey?</p>
            <p className="text-sm text-gray-600">
              Add your first medication and start earning rewards!
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">Your Medications</span>
              <span className="px-2 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm">
                {medications.length}
              </span>
            </h2>
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={() => handleEdit(medication)}
                onDelete={() => onDeleteMedication(medication.id)}
                onMarkTaken={() => onMarkAsTaken(medication.id)}
                isTakenToday={isMedicationTakenToday(medication.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}