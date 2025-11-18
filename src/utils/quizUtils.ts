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

