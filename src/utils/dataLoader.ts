import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { RegionCollection, AdminLevel } from '../types';

export async function loadKoreaGeoJSON(level: AdminLevel): Promise<RegionCollection> {
  try {
    const response = await fetch(`/data/korea-${level}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${level} data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if it's TopoJSON or GeoJSON
    if (data.type === 'Topology') {
      const topology = data as Topology;
      const objectKey = Object.keys(topology.objects)[0];
      return feature(topology, topology.objects[objectKey]) as RegionCollection;
    }

    return data as RegionCollection;
  } catch (error) {
    console.error(`Error loading ${level} data:`, error);
    throw error;
  }
}

export async function loadCSVData(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length === 0) {
          resolve([]);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            const value = values[index];
            obj[header] = isNaN(Number(value)) ? value : Number(value);
          });
          return obj;
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function loadJSONData(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
