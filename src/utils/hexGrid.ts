import type { HexCell } from '../types';

// Manual layout for Korean provinces (17 metropolitan cities/provinces)
// This is a simplified hexagonal layout for visualization
const SIDO_HEX_LAYOUT: Record<string, { q: number; r: number }> = {
  '서울특별시': { q: 1, r: 2 },
  '부산광역시': { q: 3, r: 5 },
  '대구광역시': { q: 2, r: 4 },
  '인천광역시': { q: 0, r: 2 },
  '광주광역시': { q: 0, r: 5 },
  '대전광역시': { q: 1, r: 3 },
  '울산광역시': { q: 4, r: 4 },
  '세종특별자치시': { q: 1, r: 4 },
  '경기도': { q: 1, r: 1 },
  '강원특별자치도': { q: 3, r: 1 },
  '충청북도': { q: 2, r: 3 },
  '충청남도': { q: 0, r: 3 },
  '전북특별자치도': { q: 0, r: 4 },
  '전라남도': { q: -1, r: 5 },
  '경상북도': { q: 3, r: 3 },
  '경상남도': { q: 2, r: 5 },
  '제주특별자치도': { q: 0, r: 7 },
};

export function generateHexGrid(regionNames: string[], hexSize: number = 50): HexCell[] {
  const cells: HexCell[] = [];
  const sqrt3 = Math.sqrt(3);

  regionNames.forEach((name, index) => {
    // Try to find a predefined position
    let coords = SIDO_HEX_LAYOUT[name];

    // If not found (e.g., for sigungu), auto-generate grid position
    if (!coords) {
      const cols = Math.ceil(Math.sqrt(regionNames.length));
      const q = index % cols;
      const r = Math.floor(index / cols);
      coords = { q, r };
    }

    const { q, r } = coords;

    // Convert axial coordinates to pixel coordinates
    const x = hexSize * (sqrt3 * q + (sqrt3 / 2) * r);
    const y = hexSize * ((3 / 2) * r);

    cells.push({
      q,
      r,
      regionCode: name,
      regionName: name,
      x,
      y,
    });
  });

  return cells;
}

export function hexCorners(x: number, y: number, size: number): string {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    points.push([px, py]);
  }
  return points.map(p => p.join(',')).join(' ');
}

export function getCellCenter(cell: HexCell): [number, number] {
  return [cell.x, cell.y];
}
