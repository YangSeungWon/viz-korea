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
}

export default function GeographicMap({
  data,
  visualizationData,
  onRegionClick,
  onRegionHover,
  width = 800,
  height = 600,
  colorScheme = 'blues',
}: GeographicMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Create projection for Korea
    const projection = d3.geoMercator()
      .center([127.5, 36.5])
      .scale(5000)
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
        const code = d.properties.CTPRVN_CD || d.properties.code;
        const name = d.properties.CTP_KOR_NM || d.properties.name;
        const value = valueMap.get(code) || valueMap.get(name);
        return value !== undefined ? colorScale(value) : '#e0e0e0';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        const code = d.properties.CTPRVN_CD || d.properties.code;
        if (onRegionClick) onRegionClick(code);
      })
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);

        const code = d.properties.CTPRVN_CD || d.properties.code;
        if (onRegionHover) onRegionHover(code);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#333')
          .attr('stroke-width', 1);

        if (onRegionHover) onRegionHover(null);
      })
      .append('title')
      .text((d) => {
        const name = d.properties.CTP_KOR_NM || d.properties.name;
        const code = d.properties.CTPRVN_CD || d.properties.code;
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

  }, [data, visualizationData, width, height, colorScheme, onRegionClick, onRegionHover]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded"
    />
  );
}
