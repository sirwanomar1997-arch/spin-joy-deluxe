import starSky from '@/assets/deluxe-star-sky.jpeg.asset.json';

export const backgrounds = [
  { id: 'night', name: 'Midnattsblå', image: starSky.url },
  { id: 'aurora', name: 'Ametist', image: starSky.url },
  { id: 'ocean', name: 'Brons', image: starSky.url },
  { id: 'forest', name: 'Smaragd', image: starSky.url },
  { id: 'satin', name: 'Onyx', image: starSky.url },
  { id: 'mist', name: 'Silver', image: starSky.url },
  { id: 'nebula', name: 'Rubin', image: starSky.url },
  { id: 'depths', name: 'Rosenkvarts', image: starSky.url },
] as const;
export type BackgroundId = typeof backgrounds[number]['id'];