import type { BaseMapType } from '../../types';

interface BaseMapSelectorProps {
  currentMap: BaseMapType;
  onMapChange: (mapType: BaseMapType) => void;
}

export default function BaseMapSelector({ currentMap, onMapChange }: BaseMapSelectorProps) {
  const mapTypes: { value: BaseMapType; label: string; description: string }[] = [
    {
      value: 'geographic',
      label: '지리적 지도',
      description: '실제 지리적 경계선'
    },
    {
      value: 'population-cartogram',
      label: '인구 카토그램',
      description: '인구에 비례한 크기'
    },
    {
      value: 'hexagonal',
      label: '육각형 타일',
      description: '균등한 크기의 육각형'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">베이스 맵 선택</h3>
      <div className="space-y-2">
        {mapTypes.map((mapType) => (
          <button
            key={mapType.value}
            onClick={() => onMapChange(mapType.value)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              currentMap === mapType.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{mapType.label}</div>
            <div className="text-sm text-gray-600">{mapType.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
