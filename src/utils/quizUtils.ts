import type { RegionCollection, QuizQuestion } from '../types';

export function generateQuizQuestions(
  geoData: RegionCollection,
  count: number = 10
): QuizQuestion[] {
  const features = geoData.features;
  const shuffled = [...features].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, features.length));

  return selected.map(feature => ({
    regionCode: feature.properties.CTPRVN_CD || feature.properties.SIG_CD || feature.properties.code || '',
    regionName: feature.properties.CTP_KOR_NM || feature.properties.SIG_KOR_NM || feature.properties.name || '',
  }));
}

export function generateMultipleChoiceOptions(
  correctAnswer: string,
  allRegions: string[],
  optionCount: number = 4
): string[] {
  // Remove correct answer from pool
  const otherRegions = allRegions.filter(r => r !== correctAnswer);

  // Shuffle and take random options
  const shuffled = [...otherRegions].sort(() => Math.random() - 0.5);
  const wrongOptions = shuffled.slice(0, optionCount - 1);

  // Add correct answer and shuffle
  const options = [...wrongOptions, correctAnswer];
  return options.sort(() => Math.random() - 0.5);
}

export function calculateDistance(
  clickedRegion: string,
  correctRegion: string,
  _geoData: RegionCollection
): number {
  // For now, just return 0 if correct, 100 if wrong
  // TODO: Calculate actual geographic distance
  return clickedRegion === correctRegion ? 0 : 100;
}

export function calculateScore(
  distance: number,
  maxDistance: number = 100
): number {
  // Score from 0-100 based on distance
  // Perfect click = 100 points
  // Maximum distance = 0 points
  if (distance === 0) return 100;
  if (distance >= maxDistance) return 0;

  return Math.round(100 * (1 - distance / maxDistance));
}
