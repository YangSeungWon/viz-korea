import { useState } from 'react';
import type { QuizMode, AdminLevel } from '../types';
import QuizModeSelector from '../components/Quiz/QuizModeSelector';
import FindRegionQuiz from '../components/Quiz/FindRegionQuiz';
import NameQuiz from '../components/Quiz/NameQuiz';
import TimeAttackQuiz from '../components/Quiz/TimeAttackQuiz';
import PracticeMode from '../components/Quiz/PracticeMode';

export default function QuizPage() {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [adminLevel, setAdminLevel] = useState<AdminLevel>('sido');

  const handleModeSelect = (mode: QuizMode, level: AdminLevel) => {
    setSelectedMode(mode);
    setAdminLevel(level);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  if (!selectedMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <QuizModeSelector onModeSelect={handleModeSelect} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {selectedMode === 'find-region' && (
        <FindRegionQuiz adminLevel={adminLevel} onBack={handleBack} />
      )}
      {selectedMode === 'name-quiz' && (
        <NameQuiz adminLevel={adminLevel} onBack={handleBack} />
      )}
      {selectedMode === 'time-attack' && (
        <TimeAttackQuiz adminLevel={adminLevel} onBack={handleBack} />
      )}
      {selectedMode === 'practice' && (
        <PracticeMode adminLevel={adminLevel} onBack={handleBack} />
      )}
    </div>
  );
}
