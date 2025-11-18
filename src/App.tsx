import { useState } from 'react';
import { useMapData } from './hooks/useMapData';
import MapViewer from './components/MapViewer/MapViewer';
import BaseMapSelector from './components/BaseMapSelector/BaseMapSelector';
import DataUploader from './components/DataUploader/DataUploader';
import Legend from './components/Legend/Legend';
import type { BaseMapType, VisualizationData } from './types';

// Import sample data
import sampleData from './data/sampleData';

function App() {
  const [baseMapType, setBaseMapType] = useState<BaseMapType>('geographic');
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [colorScheme, setColorScheme] = useState<string>('blues');

  const { data: geoData, loading, error } = useMapData('sido');

  const handleDataLoad = (data: VisualizationData) => {
    setVisualizationData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">지도 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !geoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">오류 발생</h2>
          <p className="text-gray-700">
            {error?.message || '지도 데이터를 로드할 수 없습니다.'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            public/data/korea-sido.json 파일이 존재하는지 확인하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            한국 지리 데이터 시각화
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            다양한 베이스 맵으로 데이터를 시각화하세요
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <BaseMapSelector
              currentMap={baseMapType}
              onMapChange={setBaseMapType}
            />

            <DataUploader
              onDataLoad={handleDataLoad}
              sampleDatasets={sampleData}
            />

            {/* Color scheme selector */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-3">색상 테마</h3>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="blues">파란색</option>
                <option value="reds">빨간색</option>
                <option value="greens">초록색</option>
                <option value="oranges">주황색</option>
                <option value="purples">보라색</option>
                <option value="diverging">분기형</option>
                <option value="rainbow">무지개</option>
              </select>
            </div>

            {/* Legend */}
            {visualizationData && (
              <Legend
                data={visualizationData}
                colorScheme={colorScheme}
              />
            )}
          </div>

          {/* Map viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <MapViewer
                mapType={baseMapType}
                geoData={geoData}
                visualizationData={visualizationData || undefined}
                width={900}
                height={700}
                colorScheme={colorScheme}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            데이터 출처:{' '}
            <a
              href="https://github.com/cubensys/Korea_District"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Korea_District
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
