import type { VisualizationData } from '../types';

// Sample population data (2023 estimates)
const populationData: VisualizationData = {
  name: '인구 통계 (2023)',
  description: '광역자치단체별 인구수',
  unit: '명',
  colorScheme: 'blues',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 9500000 },
    { regionCode: '26', regionName: '부산광역시', value: 3350000 },
    { regionCode: '27', regionName: '대구광역시', value: 2390000 },
    { regionCode: '28', regionName: '인천광역시', value: 2950000 },
    { regionCode: '29', regionName: '광주광역시', value: 1440000 },
    { regionCode: '30', regionName: '대전광역시', value: 1450000 },
    { regionCode: '31', regionName: '울산광역시', value: 1120000 },
    { regionCode: '36', regionName: '세종특별자치시', value: 380000 },
    { regionCode: '41', regionName: '경기도', value: 13600000 },
    { regionCode: '51', regionName: '강원특별자치도', value: 1540000 },
    { regionCode: '43', regionName: '충청북도', value: 1600000 },
    { regionCode: '44', regionName: '충청남도', value: 2120000 },
    { regionCode: '52', regionName: '전북특별자치도', value: 1780000 },
    { regionCode: '46', regionName: '전라남도', value: 1820000 },
    { regionCode: '47', regionName: '경상북도', value: 2620000 },
    { regionCode: '48', regionName: '경상남도', value: 3310000 },
    { regionCode: '50', regionName: '제주특별자치도', value: 680000 },
  ],
};

// Sample election data (fictional)
const electionData: VisualizationData = {
  name: '선거 득표율 (가상)',
  description: '광역자치단체별 득표율',
  unit: '%',
  colorScheme: 'diverging',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 52.3 },
    { regionCode: '26', regionName: '부산광역시', value: 48.7 },
    { regionCode: '27', regionName: '대구광역시', value: 45.2 },
    { regionCode: '28', regionName: '인천광역시', value: 51.8 },
    { regionCode: '29', regionName: '광주광역시', value: 62.5 },
    { regionCode: '30', regionName: '대전광역시', value: 54.1 },
    { regionCode: '31', regionName: '울산광역시', value: 46.9 },
    { regionCode: '36', regionName: '세종특별자치시', value: 55.7 },
    { regionCode: '41', regionName: '경기도', value: 53.2 },
    { regionCode: '51', regionName: '강원특별자치도', value: 49.3 },
    { regionCode: '43', regionName: '충청북도', value: 50.8 },
    { regionCode: '44', regionName: '충청남도', value: 51.5 },
    { regionCode: '52', regionName: '전북특별자치도', value: 58.2 },
    { regionCode: '46', regionName: '전라남도', value: 61.7 },
    { regionCode: '47', regionName: '경상북도', value: 44.8 },
    { regionCode: '48', regionName: '경상남도', value: 46.3 },
    { regionCode: '50', regionName: '제주특별자치도', value: 54.9 },
  ],
};

// Sample GDP per capita data (fictional)
const gdpData: VisualizationData = {
  name: 'GRDP 1인당 (가상)',
  description: '광역자치단체별 1인당 지역내총생산',
  unit: '만원',
  colorScheme: 'greens',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 4800 },
    { regionCode: '26', regionName: '부산광역시', value: 3200 },
    { regionCode: '27', regionName: '대구광역시', value: 2900 },
    { regionCode: '28', regionName: '인천광역시', value: 3500 },
    { regionCode: '29', regionName: '광주광역시', value: 2800 },
    { regionCode: '30', regionName: '대전광역시', value: 3100 },
    { regionCode: '31', regionName: '울산광역시', value: 5200 },
    { regionCode: '36', regionName: '세종특별자치시', value: 3400 },
    { regionCode: '41', regionName: '경기도', value: 3600 },
    { regionCode: '51', regionName: '강원특별자치도', value: 2700 },
    { regionCode: '43', regionName: '충청북도', value: 3300 },
    { regionCode: '44', regionName: '충청남도', value: 4100 },
    { regionCode: '52', regionName: '전북특별자치도', value: 2600 },
    { regionCode: '46', regionName: '전라남도', value: 3700 },
    { regionCode: '47', regionName: '경상북도', value: 3200 },
    { regionCode: '48', regionName: '경상남도', value: 3400 },
    { regionCode: '50', regionName: '제주특별자치도', value: 3000 },
  ],
};

// Sample aging rate data (fictional)
const agingData: VisualizationData = {
  name: '고령화율 (가상)',
  description: '광역자치단체별 65세 이상 인구 비율',
  unit: '%',
  colorScheme: 'oranges',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 16.8 },
    { regionCode: '26', regionName: '부산광역시', value: 19.2 },
    { regionCode: '27', regionName: '대구광역시', value: 17.5 },
    { regionCode: '28', regionName: '인천광역시', value: 15.3 },
    { regionCode: '29', regionName: '광주광역시', value: 16.1 },
    { regionCode: '30', regionName: '대전광역시', value: 15.9 },
    { regionCode: '31', regionName: '울산광역시', value: 14.7 },
    { regionCode: '36', regionName: '세종특별자치시', value: 11.2 },
    { regionCode: '41', regionName: '경기도', value: 14.8 },
    { regionCode: '51', regionName: '강원특별자치도', value: 22.7 },
    { regionCode: '43', regionName: '충청북도', value: 20.4 },
    { regionCode: '44', regionName: '충청남도', value: 21.8 },
    { regionCode: '52', regionName: '전북특별자치도', value: 23.5 },
    { regionCode: '46', regionName: '전라남도', value: 25.1 },
    { regionCode: '47', regionName: '경상북도', value: 23.9 },
    { regionCode: '48', regionName: '경상남도', value: 19.8 },
    { regionCode: '50', regionName: '제주특별자치도', value: 17.3 },
  ],
};

const sampleData: VisualizationData[] = [
  populationData,
  electionData,
  gdpData,
  agingData,
];

export default sampleData;
