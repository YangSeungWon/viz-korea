import { useState } from 'react';
import { useMapData } from '../../hooks/useMapData';
import GeographicMap from '../../maps/GeographicMap';
import type { AdminLevel } from '../../types';

interface PracticeModeProps {
  adminLevel: AdminLevel;
  onBack: () => void;
}

export default function PracticeMode({ adminLevel, onBack }: PracticeModeProps) {
  const { data: geoData, loading } = useMapData(adminLevel);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regionInfo = hoveredRegion || selectedRegion;
  const currentRegionData = regionInfo ? geoData?.features.find(f =>
    f.properties.CTPRVN_CD === regionInfo ||
    f.properties.SIG_CD === regionInfo ||
    f.properties.CTP_KOR_NM === regionInfo ||
    f.properties.SIG_KOR_NM === regionInfo
  ) : null;

  if (loading || !geoData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">지도 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← 뒤로 가기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">연습 모드</h2>
          <p className="text-gray-600">
            지도를 클릭하거나 마우스를 올려서 지역 정보를 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map */}
          <div className="lg:col-span-3 border border-gray-200 rounded-lg overflow-hidden">
            <GeographicMap
              data={geoData}
              onRegionClick={setSelectedRegion}
              onRegionHover={setHoveredRegion}
              width={700}
              height={600}
            />
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
              {currentRegionData ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    지역 정보
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">지역명</div>
                      <div className="font-semibold text-gray-900">
                        {currentRegionData.properties.CTP_KOR_NM ||
                         currentRegionData.properties.SIG_KOR_NM ||
                         currentRegionData.properties.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">지역 코드</div>
                      <div className="font-mono text-sm text-gray-900">
                        {currentRegionData.properties.CTPRVN_CD ||
                         currentRegionData.properties.SIG_CD ||
                         currentRegionData.properties.code}
                      </div>
                    </div>
                    {currentRegionData.properties.CTP_ENG_NM && (
                      <div>
                        <div className="text-sm text-gray-600">영문명</div>
                        <div className="text-sm text-gray-900">
                          {currentRegionData.properties.CTP_ENG_NM}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">👆</div>
                  <div className="text-sm">
                    지도의 지역을 클릭하거나<br />
                    마우스를 올려보세요
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  💡 팁: 이 모드로 지역 이름과 위치를 익힌 후 다른 퀴즈 모드에 도전해보세요!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Region List */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            전체 {adminLevel === 'sido' ? '시도' : '시군구'} 목록
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {geoData.features.map((feature, index) => {
              const name = feature.properties.CTP_KOR_NM ||
                          feature.properties.SIG_KOR_NM ||
                          feature.properties.name;
              const code = feature.properties.CTPRVN_CD ||
                          feature.properties.SIG_CD ||
                          feature.properties.code;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedRegion(code)}
                  className={`text-sm p-2 rounded border ${
                    selectedRegion === code
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
