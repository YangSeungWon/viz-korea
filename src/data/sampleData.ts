import type { VisualizationData } from '../types';

// Population data (2023, source: KOSIS 통계청)
const populationData: VisualizationData = {
  name: '인구 (2023)',
  description: '광역자치단체별 주민등록인구 (2023.12 기준)',
  unit: '명',
  colorScheme: 'blues',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 9411282 },
    { regionCode: '26', regionName: '부산광역시', value: 3330946 },
    { regionCode: '27', regionName: '대구광역시', value: 2368834 },
    { regionCode: '28', regionName: '인천광역시', value: 2987300 },
    { regionCode: '29', regionName: '광주광역시', value: 1433816 },
    { regionCode: '30', regionName: '대전광역시', value: 1442856 },
    { regionCode: '31', regionName: '울산광역시', value: 1107687 },
    { regionCode: '36', regionName: '세종특별자치시', value: 387196 },
    { regionCode: '41', regionName: '경기도', value: 13630943 },
    { regionCode: '51', regionName: '강원특별자치도', value: 1536503 },
    { regionCode: '43', regionName: '충청북도', value: 1602136 },
    { regionCode: '44', regionName: '충청남도', value: 2121029 },
    { regionCode: '52', regionName: '전북특별자치도', value: 1770007 },
    { regionCode: '46', regionName: '전라남도', value: 1824246 },
    { regionCode: '47', regionName: '경상북도', value: 2612191 },
    { regionCode: '48', regionName: '경상남도', value: 3298681 },
    { regionCode: '50', regionName: '제주특별자치도', value: 677793 },
  ],
};

// Population density data (2023, source: KOSIS 통계청)
const densityData: VisualizationData = {
  name: '인구밀도 (2023)',
  description: '광역자치단체별 인구밀도 (㎢당 인구)',
  unit: '명/㎢',
  colorScheme: 'oranges',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 15555 },
    { regionCode: '26', regionName: '부산광역시', value: 4345 },
    { regionCode: '27', regionName: '대구광역시', value: 2783 },
    { regionCode: '28', regionName: '인천광역시', value: 2831 },
    { regionCode: '29', regionName: '광주광역시', value: 2893 },
    { regionCode: '30', regionName: '대전광역시', value: 2660 },
    { regionCode: '31', regionName: '울산광역시', value: 1053 },
    { regionCode: '36', regionName: '세종특별자치시', value: 814 },
    { regionCode: '41', regionName: '경기도', value: 1335 },
    { regionCode: '51', regionName: '강원특별자치도', value: 91 },
    { regionCode: '43', regionName: '충청북도', value: 218 },
    { regionCode: '44', regionName: '충청남도', value: 253 },
    { regionCode: '52', regionName: '전북특별자치도', value: 221 },
    { regionCode: '46', regionName: '전라남도', value: 151 },
    { regionCode: '47', regionName: '경상북도', value: 138 },
    { regionCode: '48', regionName: '경상남도', value: 316 },
    { regionCode: '50', regionName: '제주특별자치도', value: 366 },
  ],
};

// GRDP per capita data (2022, source: KOSIS 통계청)
const gdpData: VisualizationData = {
  name: '1인당 GRDP (2022)',
  description: '광역자치단체별 1인당 지역내총생산',
  unit: '만원',
  colorScheme: 'greens',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 5336 },
    { regionCode: '26', regionName: '부산광역시', value: 3391 },
    { regionCode: '27', regionName: '대구광역시', value: 2914 },
    { regionCode: '28', regionName: '인천광역시', value: 3675 },
    { regionCode: '29', regionName: '광주광역시', value: 3076 },
    { regionCode: '30', regionName: '대전광역시', value: 3341 },
    { regionCode: '31', regionName: '울산광역시', value: 6214 },
    { regionCode: '36', regionName: '세종특별자치시', value: 3794 },
    { regionCode: '41', regionName: '경기도', value: 3834 },
    { regionCode: '51', regionName: '강원특별자치도', value: 3038 },
    { regionCode: '43', regionName: '충청북도', value: 3742 },
    { regionCode: '44', regionName: '충청남도', value: 4778 },
    { regionCode: '52', regionName: '전북특별자치도', value: 2863 },
    { regionCode: '46', regionName: '전라남도', value: 4202 },
    { regionCode: '47', regionName: '경상북도', value: 3708 },
    { regionCode: '48', regionName: '경상남도', value: 3678 },
    { regionCode: '50', regionName: '제주특별자치도', value: 3287 },
  ],
};

// Aging rate data (2023, source: KOSIS 통계청)
const agingData: VisualizationData = {
  name: '고령인구비율 (2023)',
  description: '광역자치단체별 65세 이상 인구 비율',
  unit: '%',
  colorScheme: 'purples',
  data: [
    { regionCode: '11', regionName: '서울특별시', value: 18.3 },
    { regionCode: '26', regionName: '부산광역시', value: 20.8 },
    { regionCode: '27', regionName: '대구광역시', value: 18.8 },
    { regionCode: '28', regionName: '인천광역시', value: 16.5 },
    { regionCode: '29', regionName: '광주광역시', value: 17.4 },
    { regionCode: '30', regionName: '대전광역시', value: 17.2 },
    { regionCode: '31', regionName: '울산광역시', value: 15.9 },
    { regionCode: '36', regionName: '세종특별자치시', value: 12.0 },
    { regionCode: '41', regionName: '경기도', value: 15.8 },
    { regionCode: '51', regionName: '강원특별자치도', value: 24.4 },
    { regionCode: '43', regionName: '충청북도', value: 21.9 },
    { regionCode: '44', regionName: '충청남도', value: 23.4 },
    { regionCode: '52', regionName: '전북특별자치도', value: 25.1 },
    { regionCode: '46', regionName: '전라남도', value: 26.7 },
    { regionCode: '47', regionName: '경상북도', value: 25.6 },
    { regionCode: '48', regionName: '경상남도', value: 21.3 },
    { regionCode: '50', regionName: '제주특별자치도', value: 18.6 },
  ],
};

const sampleData: VisualizationData[] = [
  populationData,
  densityData,
  gdpData,
  agingData,
];

export default sampleData;
