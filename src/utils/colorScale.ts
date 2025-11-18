import * as d3 from 'd3';

export type ColorScheme = 'blues' | 'reds' | 'greens' | 'oranges' | 'purples' | 'diverging' | 'rainbow';

export function createColorScale(
  values: number[],
  scheme: ColorScheme = 'blues'
): d3.ScaleSequential<string> | d3.ScaleDiverging<string> {
  const min = Math.min(...values);
  const max = Math.max(...values);

  let interpolator: (t: number) => string;

  switch (scheme) {
    case 'blues':
      interpolator = d3.interpolateBlues;
      break;
    case 'reds':
      interpolator = d3.interpolateReds;
      break;
    case 'greens':
      interpolator = d3.interpolateGreens;
      break;
    case 'oranges':
      interpolator = d3.interpolateOranges;
      break;
    case 'purples':
      interpolator = d3.interpolatePurples;
      break;
    case 'diverging':
      return d3.scaleDiverging([min, (min + max) / 2, max], d3.interpolateRdYlBu);
    case 'rainbow':
      interpolator = d3.interpolateRainbow;
      break;
    default:
      interpolator = d3.interpolateBlues;
  }

  return d3.scaleSequential([min, max], interpolator);
}

export function getColorForValue(
  value: number,
  scale: d3.ScaleSequential<string> | d3.ScaleDiverging<string>
): string {
  return scale(value);
}

export function createQuantileScale(
  values: number[],
  numClasses: number = 5,
  scheme: ColorScheme = 'blues'
): d3.ScaleQuantile<string> {
  const colors = getColorPalette(scheme, numClasses);
  return d3.scaleQuantile<string>()
    .domain(values)
    .range(colors);
}

export function getColorPalette(scheme: ColorScheme, numColors: number): string[] {
  const t = d3.range(numColors).map(i => i / (numColors - 1));

  switch (scheme) {
    case 'blues':
      return t.map(d3.interpolateBlues);
    case 'reds':
      return t.map(d3.interpolateReds);
    case 'greens':
      return t.map(d3.interpolateGreens);
    case 'oranges':
      return t.map(d3.interpolateOranges);
    case 'purples':
      return t.map(d3.interpolatePurples);
    case 'diverging':
      return t.map(d3.interpolateRdYlBu);
    case 'rainbow':
      return t.map(d3.interpolateRainbow);
    default:
      return t.map(d3.interpolateBlues);
  }
}
