import type { RegionCollection, QuizQuestion } from '../types';

export function generateQuizQuestions(
  geoData: RegionCollection,
  count: number = 10,
  sidoFilter?: string
): QuizQuestion[] {
  let features = geoData.features;

  // Filter by sido if specified (for sigungu level)
  if (sidoFilter && sidoFilter !== 'all') {
    features = features.filter(feature => {
      const sigCode = feature.properties.SIG_CD || '';
      const sigName = feature.properties.SIG_KOR_NM || '';

      // Check if this sigungu belongs to the selected sido
      // SIG_CD format: first 2 digits are sido code (e.g., 11xxx for Seoul)
      return sigCode.startsWith(sidoFilter) || sigName.includes(sidoFilter);
    });
  }

  const shuffled = [...features].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, features.length));

  return selected.map(feature => ({
    regionCode: feature.properties.CTPRVN_CD || feature.properties.SIG_CD || feature.properties.code || '',
    regionName: feature.properties.CTP_KOR_NM || feature.properties.SIG_KOR_NM || feature.properties.name || '',
  }));
}

export function getSidoList(geoData: RegionCollection): Array<{code: string, name: string}> {
  // Extract unique sido codes from sigungu data
  const sidoMap = new Map<string, string>();

  // Sido code to name mapping
  const sidoCodeMap: {[key: string]: string} = {
    '11': '서울특별시',
    '26': '부산광역시',
    '27': '대구광역시',
    '28': '인천광역시',
    '29': '광주광역시',
    '30': '대전광역시',
    '31': '울산광역시',
    '36': '세종특별자치시',
    '41': '경기도',
    '42': '강원특별자치도',
    '43': '충청북도',
    '44': '충청남도',
    '45': '전북특별자치도',
    '46': '전라남도',
    '47': '경상북도',
    '48': '경상남도',
    '50': '제주특별자치도',
    '51': '강원특별자치도',
    '52': '전북특별자치도'
  };

  geoData.features.forEach(feature => {
    const sigCode = feature.properties.SIG_CD || '';

    if (sigCode.length >= 2) {
      const sidoCode = sigCode.substring(0, 2);
      const sidoName = sidoCodeMap[sidoCode];
      if (sidoName) {
        sidoMap.set(sidoCode, sidoName);
      }
    }
  });

  return Array.from(sidoMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
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

