import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { VisualizationData } from '../../types';
import { createColorScale } from '../../utils/colorScale';

interface LegendProps {
  data: VisualizationData;
  colorScheme?: string;
  width?: number;
  height?: number;
}

export default function Legend({
  data,
  colorScheme = 'blues',
  width = 300,
  height = 60,
}: LegendProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const values = data.data.map(d => d.value);
    if (values.length === 0) return;

    const min = Math.min(...values);
    const max = Math.max(...values);

    const colorScale = createColorScale(values, colorScheme as any);

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const value = min + (max - min) * (i / numStops);
      gradient.append('stop')
        .attr('offset', `${(i / numStops) * 100}%`)
        .attr('stop-color', colorScale(value));
    }

    // Draw rectangle with gradient
    const margin = { top: 10, right: 20, bottom: 30, left: 20 };
    const rectHeight = 20;

    svg.append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right)
      .attr('height', rectHeight)
      .style('fill', 'url(#legend-gradient)')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // Add axis
    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([margin.left, width - margin.right]);

    const axis = d3.axisBottom(scale)
      .ticks(5)
      .tickFormat(d => d3.format('.2s')(d));

    svg.append('g')
      .attr('transform', `translate(0, ${margin.top + rectHeight})`)
      .call(axis);

  }, [data, colorScheme, width, height]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold mb-2">{data.name}</h3>
      {data.description && (
        <p className="text-xs text-gray-600 mb-2">{data.description}</p>
      )}
      <svg ref={svgRef} width={width} height={height} />
      {data.unit && (
        <p className="text-xs text-gray-500 mt-1">단위: {data.unit}</p>
      )}
    </div>
  );
}
