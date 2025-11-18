import { useState, useRef } from 'react';
import { loadCSVData, loadJSONData } from '../../utils/dataLoader';
import type { VisualizationData } from '../../types';

interface DataUploaderProps {
  onDataLoad: (data: VisualizationData) => void;
  sampleDatasets?: VisualizationData[];
}

export default function DataUploader({ onDataLoad, sampleDatasets = [] }: DataUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      let rawData: any;

      if (file.name.endsWith('.csv')) {
        rawData = await loadCSVData(file);
      } else if (file.name.endsWith('.json')) {
        rawData = await loadJSONData(file);
      } else {
        throw new Error('지원되지 않는 파일 형식입니다. CSV 또는 JSON 파일을 업로드하세요.');
      }

      // Transform raw data into visualization format
      // Expecting format: { regionCode/regionName, value, ... }
      const visualizationData: VisualizationData = {
        name: file.name,
        description: `Uploaded from ${file.name}`,
        data: rawData.map((item: any) => ({
          regionCode: item.regionCode || item.code || '',
          regionName: item.regionName || item.name || '',
          value: parseFloat(item.value) || 0,
          ...item,
        })),
      };

      onDataLoad(visualizationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드 중 오류가 발생했습니다.');
      console.error('Error loading file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleSelect = (dataset: VisualizationData) => {
    onDataLoad(dataset);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">데이터 선택</h3>

      {/* Sample datasets */}
      {sampleDatasets.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">샘플 데이터셋</h4>
          <div className="space-y-2">
            {sampleDatasets.map((dataset, index) => (
              <button
                key={index}
                onClick={() => handleSampleSelect(dataset)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="font-medium text-sm">{dataset.name}</div>
                {dataset.description && (
                  <div className="text-xs text-gray-600 mt-1">{dataset.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File upload */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">파일 업로드</h4>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '로딩 중...' : 'CSV/JSON 파일 업로드'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          형식: regionCode 또는 regionName, value 컬럼 필수
        </p>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
