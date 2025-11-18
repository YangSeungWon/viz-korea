import * as turf from '@turf/turf';
import type { RegionCollection, DataPoint } from '../types';

export interface CartogramOptions {
  valueKey: string;
  iterations?: number;
  scaleFactor?: number;
}

/**
 * Creates a simple Dorling cartogram by replacing regions with circles
 * sized according to their data values
 */
export function createDorlingCartogram(
  geojson: RegionCollection,
  data: DataPoint[],
  options: CartogramOptions
): RegionCollection {
  const { scaleFactor = 1 } = options;

  // Create a map of region codes to values
  const valueMap = new Map<string, number>();
  data.forEach(d => {
    valueMap.set(d.regionCode, d.value);
  });

  // Calculate radius for each region based on value
  const features = geojson.features.map(feature => {
    const regionCode = feature.properties.code || feature.properties.name;
    const value = valueMap.get(regionCode) || 0;

    // Calculate centroid
    const centroid = turf.centroid(feature);

    // Calculate radius proportional to value (area proportional to value)
    const radius = Math.sqrt(value / Math.PI) * scaleFactor;

    // Create circle
    const circle = turf.circle(centroid, radius, {
      steps: 32,
      units: 'kilometers',
    });

    // Preserve properties
    circle.properties = {
      ...feature.properties,
      originalGeometry: feature.geometry,
      cartogramValue: value,
      cartogramRadius: radius,
    };

    return circle;
  });

  return {
    type: 'FeatureCollection',
    features: features as any,
  };
}

/**
 * Creates a non-contiguous cartogram by scaling regions from their centroids
 */
export function createScaledCartogram(
  geojson: RegionCollection,
  data: DataPoint[],
  options: CartogramOptions
): RegionCollection {
  const { scaleFactor: _scaleFactor = 0.01 } = options;

  // Create a map of region codes to values
  const valueMap = new Map<string, number>();
  const values: number[] = [];

  data.forEach(d => {
    valueMap.set(d.regionCode, d.value);
    values.push(d.value);
  });

  // Calculate average value for normalization
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

  const features = geojson.features.map(feature => {
    const regionCode = feature.properties.code || feature.properties.name;
    const value = valueMap.get(regionCode) || avgValue;

    // Calculate scale factor (regions with higher values get bigger)
    const scale = Math.sqrt(value / avgValue);

    // Get centroid
    const centroid = turf.centroid(feature);

    // Scale the feature from its centroid
    const scaled = turf.transformScale(feature, scale, {
      origin: centroid,
    });

    // Preserve properties
    scaled.properties = {
      ...feature.properties,
      cartogramValue: value,
      cartogramScale: scale,
    };

    return scaled;
  });

  return {
    type: 'FeatureCollection',
    features: features as any,
  };
}
