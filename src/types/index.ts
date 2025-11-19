import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export type BaseMapType = 'geographic' | 'population-cartogram' | 'hexagonal';

export interface RegionProperties {
  code: string;
  name: string;
  nameEn?: string;
  population?: number;
  area?: number;
  [key: string]: any;
}

export type RegionFeature = Feature<Polygon | MultiPolygon, RegionProperties>;
export type RegionCollection = FeatureCollection<Polygon | MultiPolygon, RegionProperties>;

export interface DataPoint {
  regionCode: string;
  regionName: string;
  value: number;
  [key: string]: any;
}

export interface VisualizationData {
  name: string;
  description?: string;
  data: DataPoint[];
  colorScheme?: string;
  unit?: string;
}

export interface MapViewState {
  baseMapType: BaseMapType;
  selectedRegion: string | null;
  hoveredRegion: string | null;
  visualizationData: VisualizationData | null;
}

export interface HexCell {
  q: number;
  r: number;
  regionCode: string;
  regionName: string;
  x: number;
  y: number;
}

export type AdminLevel = 'sido' | 'sigungu' | 'eupmyeondong';

// Quiz types
export type QuizMode = 'find-region' | 'name-quiz' | 'outline-quiz' | 'time-attack' | 'practice';

export interface QuizQuestion {
  regionCode: string;
  regionName: string;
  options?: string[]; // For multiple choice
}

export interface QuizState {
  mode: QuizMode;
  adminLevel: AdminLevel;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  questions: QuizQuestion[];
  answers: Array<{
    question: QuizQuestion;
    userAnswer: string;
    correct: boolean;
    timeSpent?: number;
  }>;
  timeLimit?: number; // seconds
  timeRemaining?: number;
  isComplete: boolean;
}
