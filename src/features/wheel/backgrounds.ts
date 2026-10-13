import night from '@/assets/night-sky.jpg';
import aurora from '@/assets/background-aurora.jpg';
import ocean from '@/assets/background-ocean.jpg';
import forest from '@/assets/background-forest.jpg';
import satin from '@/assets/background-satin.jpg';
import mist from '@/assets/background-mist.jpg';
import nebula from '@/assets/background-nebula.jpg';
import depths from '@/assets/background-depths.jpg';

export const backgrounds = [
  { id: 'night', name: 'Stjärnnatt', image: night },
  { id: 'aurora', name: 'Norrsken', image: aurora },
  { id: 'ocean', name: 'Månhav', image: ocean },
  { id: 'forest', name: 'Smaragd', image: forest },
  { id: 'satin', name: 'Svart siden', image: satin },
  { id: 'mist', name: 'Silverdis', image: mist },
  { id: 'nebula', name: 'Rubinnebulosa', image: nebula },
  { id: 'depths', name: 'Safirdjup', image: depths },
] as const;
export type BackgroundId = typeof backgrounds[number]['id'];