import { useState } from 'react';
import type { BaseMapType, RegionCollection, VisualizationData } from '../../types';
import GeographicMap from '../../maps/GeographicMap';
import PopulationCartogram from '../../maps/PopulationCartogram';
import HexagonalMap from '../../maps/HexagonalMap';

interface MapViewerProps {
  mapType: BaseMapType;
  geoData: RegionCollection;
  visualizationData?: VisualizationData;
  width?: number;
  height?: number;
  colorScheme?: string;
}

export default function MapViewer({
  mapType,
  geoData,
  visualizationData,
  width = 900,
  height = 700,
  colorScheme = 'blues',
}: MapViewerProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (regionCode: string) => {
    console.log('Selected region:', regionCode);
  };

  const handleRegionHover = (regionCode: string | null) => {
    setHoveredRegion(regionCode);
  };

  const dataPoints = visualizationData?.data || [];

  // Get info about hovered region
  const hoveredInfo = hoveredRegion ? dataPoints.find(
    d => d.regionCode === hoveredRegion || d.regionName === hoveredRegion
  ) : null;

  return (
    <div className="relative">
      {mapType === 'geographic' && (
        <GeographicMap
          data={geoData}
          visualizationData={dataPoints}
          onRegionClick={handleRegionClick}
          onRegionHover={handleRegionHover}
          width={width}
          height={height}
          colorScheme={colorScheme}
        />
      )}

      {mapType === 'population-cartogram' && visualizationData && (
        <PopulationCartogram
          data={geoData}
          visualizationData={dataPoints}
          onRegionClick={handleRegionClick}
          onRegionHover={handleRegionHover}
          width={width}
          height={height}
          colorScheme={colorScheme}
          mode="dorling"
        />
      )}

      {mapType === 'hexagonal' && (
        <HexagonalMap
          data={geoData}
          visualizationData={dataPoints}
          onRegionClick={handleRegionClick}
          onRegionHover={handleRegionHover}
          width={width}
          height={height}
          colorScheme={colorScheme}
          hexSize={50}
        />
      )}

      {/* Hover tooltip */}
      {hoveredInfo && (
        <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-3 border border-gray-200 pointer-events-none">
          <div className="font-semibold">{hoveredInfo.regionName}</div>
          <div className="text-sm text-gray-600">
            값: {hoveredInfo.value.toLocaleString()}
          </div>
        </div>
      )}

      {/* Info message for cartogram without data */}
      {mapType === 'population-cartogram' && !visualizationData && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">데이터를 선택하세요</p>
            <p className="text-sm text-gray-600 mt-2">
              인구 카토그램을 표시하려면 데이터가 필요합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
