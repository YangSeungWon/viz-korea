import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { RegionCollection, DataPoint } from '../types';
import { createColorScale } from '../utils/colorScale';

interface GeographicMapProps {
  data: RegionCollection;
  visualizationData?: DataPoint[];
  onRegionClick?: (regionCode: string) => void;
  onRegionHover?: (regionCode: string | null) => void;
  width?: number;
  height?: number;
  colorScheme?: string;
  highlightRegion?: string;
  showZoomControls?: boolean;
}

export default function GeographicMap({
  data,
  visualizationData,
  onRegionClick,
  onRegionHover,
  width = 800,
  height = 600,
  colorScheme = 'blues',
  highlightRegion,
  showZoomControls = false,
}: GeographicMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<any>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Create projection for Korea (centered to include Jeju Island)
    const projection = d3.geoMercator()
      .center([127.5, 36.0])
      .scale(4500)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create value map if visualization data exists
    const valueMap = new Map<string, number>();
    const values: number[] = [];

    if (visualizationData) {
      visualizationData.forEach(d => {
        valueMap.set(d.regionCode, d.value);
        valueMap.set(d.regionName, d.value);
        values.push(d.value);
      });
    }

    // Create color scale
    const colorScale = values.length > 0
      ? createColorScale(values, colorScheme as any)
      : null;

    // Draw regions
    g.selectAll('path')
      .data(data.features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d) => {
        if (!colorScale) return '#e0e0e0';
        const code = d.properties.CTPRVN_CD || d.properties.SIG_CD || d.properties.code;
        const name = d.properties.CTP_KOR_NM || d.properties.SIG_KOR_NM || d.properties.name;
        const value = valueMap.get(code) || valueMap.get(name);
        return value !== undefined ? colorScale(value) : '#e0e0e0';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        const code = d.properties.CTPRVN_CD || d.properties.SIG_CD || d.properties.code;
        if (onRegionClick) onRegionClick(code);
      })
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 1.5);

        const code = d.properties.CTPRVN_CD || d.properties.SIG_CD || d.properties.code;
        if (onRegionHover) onRegionHover(code);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#333')
          .attr('stroke-width', 0.5);

        if (onRegionHover) onRegionHover(null);
      })
      .append('title')
      .text((d) => {
        const name = d.properties.CTP_KOR_NM || d.properties.SIG_KOR_NM || d.properties.name;
        const code = d.properties.CTPRVN_CD || d.properties.SIG_CD || d.properties.code;
        const value = valueMap.get(code) || valueMap.get(name);
        return value !== undefined ? `${name}: ${value}` : name;
      });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom as any);

    // Store zoom behavior for external controls
    zoomBehaviorRef.current = zoom;

    // Highlight region with blinking animation
    if (highlightRegion) {
      g.selectAll('path')
        .filter((d: any) => {
          const code = d.properties.CTPRVN_CD || d.properties.SIG_CD || d.properties.code;
          const name = d.properties.CTP_KOR_NM || d.properties.SIG_KOR_NM || d.properties.name;
          return code === highlightRegion || name === highlightRegion;
        })
        .style('animation', 'blink 0.8s ease-in-out infinite')
        .attr('fill', '#ff4444')
        .attr('stroke', '#cc0000')
        .attr('stroke-width', 3);

      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `;
      if (!document.querySelector('style[data-blink]')) {
        style.setAttribute('data-blink', 'true');
        document.head.appendChild(style);
      }
    }

  }, [data, visualizationData, width, height, colorScheme, onRegionClick, onRegionHover, highlightRegion]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.67);
    }
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded"
      />

      {showZoomControls && (
        <div className="absolute top-2 right-2 flex flex-col gap-1 bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 text-gray-700 font-bold"
            title="확대"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 text-gray-700 font-bold"
            title="축소"
          >
            −
          </button>
          <button
            onClick={handleZoomReset}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 text-gray-700 text-xs"
            title="리셋"
          >
            ⟲
          </button>
        </div>
      )}

      {showZoomControls && (
        <div className="text-xs text-gray-500 mt-1">
          💡 마우스 휠로 확대/축소, 드래그로 이동 가능
        </div>
      )}
    </div>
  );
}
