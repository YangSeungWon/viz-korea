import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { RegionCollection, DataPoint } from '../types';
import { createDorlingCartogram, createScaledCartogram } from '../utils/cartogram';
import { createColorScale } from '../utils/colorScale';

interface PopulationCartogramProps {
  data: RegionCollection;
  visualizationData: DataPoint[];
  onRegionClick?: (regionCode: string) => void;
  onRegionHover?: (regionCode: string | null) => void;
  width?: number;
  height?: number;
  colorScheme?: string;
  mode?: 'dorling' | 'scaled';
}

export default function PopulationCartogram({
  data,
  visualizationData,
  onRegionClick,
  onRegionHover,
  width = 800,
  height = 600,
  colorScheme = 'blues',
  mode = 'dorling',
}: PopulationCartogramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cartogramData, setCartogramData] = useState<RegionCollection | null>(null);

  useEffect(() => {
    if (!data || !visualizationData || visualizationData.length === 0) return;

    // Generate cartogram
    try {
      const cartogram = mode === 'dorling'
        ? createDorlingCartogram(data, visualizationData, {
            valueKey: 'value',
            scaleFactor: 0.15,
          })
        : createScaledCartogram(data, visualizationData, {
            valueKey: 'value',
            scaleFactor: 0.01,
          });

      setCartogramData(cartogram);
    } catch (error) {
      console.error('Error creating cartogram:', error);
    }
  }, [data, visualizationData, mode]);

  useEffect(() => {
    if (!svgRef.current || !cartogramData) return;

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

    // Create value map
    const valueMap = new Map<string, number>();
    const values: number[] = [];

    visualizationData.forEach(d => {
      valueMap.set(d.regionCode, d.value);
      valueMap.set(d.regionName, d.value);
      values.push(d.value);
    });

    // Create color scale
    const colorScale = createColorScale(values, colorScheme as any);

    // Draw cartogram
    g.selectAll('path')
      .data(cartogramData.features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d) => {
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

  }, [cartogramData, visualizationData, width, height, colorScheme, onRegionClick, onRegionHover]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded"
    />
  );
}
