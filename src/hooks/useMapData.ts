import { useState, useEffect } from 'react';
import { loadKoreaGeoJSON } from '../utils/dataLoader';
import type { RegionCollection, AdminLevel } from '../types';

export function useMapData(level: AdminLevel = 'sido') {
  const [data, setData] = useState<RegionCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const geoData = await loadKoreaGeoJSON(level);
        if (!cancelled) {
          setData(geoData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load map data'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [level]);

  return { data, loading, error };
}
