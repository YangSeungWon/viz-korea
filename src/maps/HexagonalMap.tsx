import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { RegionCollection, DataPoint, HexCell } from '../types';
import { generateHexGrid, hexCorners } from '../utils/hexGrid';
import { createColorScale } from '../utils/colorScale';

interface HexagonalMapProps {
  data: RegionCollection;
  visualizationData?: DataPoint[];
  onRegionClick?: (regionCode: string) => void;
  onRegionHover?: (regionCode: string | null) => void;
  width?: number;
  height?: number;
  colorScheme?: string;
  hexSize?: number;
}

export default function HexagonalMap({
  data,
  visualizationData,
  onRegionClick,
  onRegionHover,
  width = 800,
  height = 600,
  colorScheme = 'blues',
  hexSize = 50,
}: HexagonalMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hexGrid, setHexGrid] = useState<HexCell[]>([]);
  const [actualHexSize, setActualHexSize] = useState(hexSize);

  useEffect(() => {
    if (!data) return;

    // Extract region names
    const regionNames = data.features.map(f =>
      f.properties.CTP_KOR_NM || f.properties.SIG_KOR_NM || f.properties.name
    );

    // Adjust hex size based on number of regions
    const adjustedHexSize = regionNames.length > 100 ? 15 : hexSize;
    setActualHexSize(adjustedHexSize);

    const grid = generateHexGrid(regionNames, adjustedHexSize, data);
    setHexGrid(grid);
  }, [data, hexSize]);

  useEffect(() => {
    if (!svgRef.current || hexGrid.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Calculate bounds
    const minX = d3.min(hexGrid, d => d.x) || 0;
    const maxX = d3.max(hexGrid, d => d.x) || 0;
    const minY = d3.min(hexGrid, d => d.y) || 0;
    const maxY = d3.max(hexGrid, d => d.y) || 0;

    // Calculate center offset
    const centerX = width / 2 - (minX + maxX) / 2;
    const centerY = height / 2 - (minY + maxY) / 2;

    // Create value map
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

    // Draw hexagons
    g.selectAll('polygon')
      .data(hexGrid)
      .join('polygon')
      .attr('points', d => hexCorners(d.x + centerX, d.y + centerY, actualHexSize))
      .attr('fill', (d) => {
        if (!colorScale) return '#e0e0e0';
        const value = valueMap.get(d.regionCode) || valueMap.get(d.regionName);
        return value !== undefined ? colorScale(value) : '#e0e0e0';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        if (onRegionClick) onRegionClick(d.regionCode);
      })
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 3);

        if (onRegionHover) onRegionHover(d.regionCode);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);

        if (onRegionHover) onRegionHover(null);
      })
      .append('title')
      .text((d) => {
        const value = valueMap.get(d.regionCode) || valueMap.get(d.regionName);
        return value !== undefined ? `${d.regionName}: ${value}` : d.regionName;
      });

    // Add labels (only for sido level or larger hexagons)
    if (hexGrid.length <= 20) {
      g.selectAll('text')
        .data(hexGrid)
        .join('text')
        .attr('x', d => d.x + centerX)
        .attr('y', d => d.y + centerY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .style('pointer-events', 'none')
        .text(d => {
          // Shorten labels for better display
          const name = d.regionName;
          if (name.includes('특별시')) return name.replace('특별시', '');
          if (name.includes('광역시')) return name.replace('광역시', '');
          if (name.includes('특별자치시')) return name.replace('특별자치시', '');
          if (name.includes('특별자치도')) return name.replace('특별자치도', '');
          if (name.includes('도')) return name.replace('도', '');
          return name;
        });
    }

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom as any);

  }, [hexGrid, visualizationData, width, height, colorScheme, actualHexSize, onRegionClick, onRegionHover]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded bg-gray-50"
    />
  );
}
