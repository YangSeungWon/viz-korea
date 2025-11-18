import type { AdminLevel } from '../../types';

interface AdminLevelSelectorProps {
  currentLevel: AdminLevel;
  onLevelChange: (level: AdminLevel) => void;
}

export default function AdminLevelSelector({ currentLevel, onLevelChange }: AdminLevelSelectorProps) {
  const levels: { value: AdminLevel; label: string; description: string }[] = [
    {
      value: 'sido',
      label: '시도',
      description: '광역자치단체 (17개)'
    },
    {
      value: 'sigungu',
      label: '시군구',
      description: '기초자치단체 (250개)'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">행정구역 레벨</h3>
      <div className="space-y-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onLevelChange(level.value)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              currentLevel === level.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{level.label}</div>
            <div className="text-sm text-gray-600">{level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
