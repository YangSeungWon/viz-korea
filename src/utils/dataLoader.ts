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

// Helper function to detect column mapping
function detectColumnMapping(headers: string[]): {
  codeCol?: string;
  nameCol?: string;
  valueCol?: string;
} {
  const mapping: { codeCol?: string; nameCol?: string; valueCol?: string } = {};

  // Normalize headers for comparison
  const normalized = headers.map(h => h.toLowerCase().trim());

  // Detect region code column
  const codePatterns = ['regioncode', 'code', '지역코드', '코드', 'sig_cd', 'ctprvn_cd'];
  for (const pattern of codePatterns) {
    const idx = normalized.findIndex(h => h.includes(pattern) || pattern.includes(h));
    if (idx !== -1) {
      mapping.codeCol = headers[idx];
      break;
    }
  }

  // Detect region name column
  const namePatterns = ['regionname', 'name', '지역', '지역명', '시도', '시군구', 'region', 'sig_kor_nm', 'ctp_kor_nm'];
  for (const pattern of namePatterns) {
    const idx = normalized.findIndex(h => h.includes(pattern) || pattern.includes(h));
    if (idx !== -1) {
      mapping.nameCol = headers[idx];
      break;
    }
  }

  // Detect value column
  const valuePatterns = ['value', '값', '데이터', 'data', '인구', 'population', '수치', 'amount'];
  for (const pattern of valuePatterns) {
    const idx = normalized.findIndex(h => h.includes(pattern) || pattern.includes(h));
    if (idx !== -1) {
      mapping.valueCol = headers[idx];
      break;
    }
  }

  return mapping;
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
        const mapping = detectColumnMapping(headers);

        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};

          headers.forEach((header, index) => {
            const value = values[index];
            obj[header] = isNaN(Number(value)) ? value : Number(value);
          });

          // Add normalized fields
          if (mapping.codeCol && obj[mapping.codeCol]) {
            obj.regionCode = obj[mapping.codeCol];
          }
          if (mapping.nameCol && obj[mapping.nameCol]) {
            obj.regionName = obj[mapping.nameCol];
          }
          if (mapping.valueCol && obj[mapping.valueCol]) {
            obj.value = Number(obj[mapping.valueCol]);
          }

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
