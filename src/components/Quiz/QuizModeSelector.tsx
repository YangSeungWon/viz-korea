import { useState } from 'react';
import type { QuizMode, AdminLevel } from '../../types';

interface QuizModeSelectorProps {
  onModeSelect: (mode: QuizMode, level: AdminLevel) => void;
}

export default function QuizModeSelector({ onModeSelect }: QuizModeSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<AdminLevel>('sido');

  const modes = [
    {
      mode: 'find-region' as QuizMode,
      title: '지역 찾기',
      description: '지역 이름을 보고 지도에서 올바른 위치를 클릭하세요',
      icon: '🎯',
      color: 'blue',
    },
    {
      mode: 'name-quiz' as QuizMode,
      title: '이름 맞추기',
      description: '지도에서 강조된 지역의 이름을 맞추세요 (4지선다)',
      icon: '🤔',
      color: 'green',
    },
    {
      mode: 'time-attack' as QuizMode,
      title: '타임 어택',
      description: '60초 안에 최대한 많은 문제를 맞추세요!',
      icon: '⏱️',
      color: 'red',
    },
    {
      mode: 'practice' as QuizMode,
      title: '연습 모드',
      description: '정답을 확인하며 학습하세요',
      icon: '📚',
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">한국 지리 퀴즈</h1>
        <p className="text-gray-600">재미있게 한국 지리를 배워보세요!</p>
      </div>

      {/* Admin Level Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">난이도 선택</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedLevel('sido')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLevel === 'sido'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-semibold">시도</div>
            <div className="text-sm text-gray-600">광역자치단체 (17개)</div>
            <div className="text-xs text-gray-500 mt-1">쉬움</div>
          </button>
          <button
            onClick={() => setSelectedLevel('sigungu')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLevel === 'sigungu'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-semibold">시군구</div>
            <div className="text-sm text-gray-600">기초자치단체 (226개)</div>
            <div className="text-xs text-gray-500 mt-1">어려움</div>
          </button>
        </div>
      </div>

      {/* Quiz Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((modeInfo) => (
          <button
            key={modeInfo.mode}
            onClick={() => onModeSelect(modeInfo.mode, selectedLevel)}
            className={`bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-all border-2 border-transparent hover:border-${modeInfo.color}-500`}
          >
            <div className="text-4xl mb-3">{modeInfo.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{modeInfo.title}</h3>
            <p className="text-gray-600 text-sm">{modeInfo.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-2xl mr-3">💡</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">팁</h3>
            <p className="text-sm text-blue-800">
              먼저 연습 모드로 지역 이름과 위치를 익힌 후, 다른 모드에 도전해보세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
