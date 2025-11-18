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

  const downloadTemplate = (level: 'sido' | 'sigungu') => {
    const csvContent = level === 'sido'
      ? `regionCode,regionName,value
11,서울특별시,9411282
26,부산광역시,3330946
27,대구광역시,2368834
28,인천광역시,2987300
29,광주광역시,1433816
30,대전광역시,1442856
31,울산광역시,1107687
36,세종특별자치시,387196
41,경기도,13630943
51,강원특별자치도,1536503
43,충청북도,1602136
44,충청남도,2121029
52,전북특별자치도,1770007
46,전라남도,1824246
47,경상북도,2612191
48,경상남도,3298681
50,제주특별자치도,677793`
      : `regionCode,regionName,value
11110,종로구,162820
11140,중구,133240
11170,용산구,243160
11200,성동구,315290
11215,광진구,376270
11230,동대문구,368980
11260,중랑구,407600
11290,성북구,460780
11305,강북구,323960
11320,도봉구,335490
11350,노원구,553160
11380,은평구,493420
11410,서대문구,324370
11440,마포구,388600
11470,양천구,468600
11500,강서구,611730
11530,구로구,431610
11545,금천구,241470
11560,영등포구,368920
11590,동작구,400890
11620,관악구,506950
11650,서초구,430700
11680,강남구,546730
11710,송파구,667070
11740,강동구,454740`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sample_${level}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        {/* Template download buttons */}
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => downloadTemplate('sido')}
            className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            📥 시도 템플릿
          </button>
          <button
            onClick={() => downloadTemplate('sigungu')}
            className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            📥 시군구 템플릿
          </button>
        </div>

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
          템플릿을 다운로드하여 데이터를 입력하세요
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
